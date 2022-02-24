### Auth 추가 설명
```
nest g mo auth
nest g co auth --no-spec
nest g s auth --no-spec
```

---

### User 엔티티 생성
- user.entity.ts
```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}
```
---

### User repository 생성
- user.repository.ts
```typescript
import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}
```

### 생성된 User repository 를 다른곳에 사용하기 위해 module 에 추가
- forFeature
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
```

### injection 
- User Repository 를 auth Service 안에서 사용하기 위해 injection
```typescript
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}
}
```

### 회원가입 기능 추가
- DTO 추가
``` typescript
export class AuthCredentialsDto {
    username: string;
    password: string;
}
```
- User repository 에 삽입
```typescript
async createUser(authCredentialsDto: AuthCredentialsDto): Promise <User> {
        const { username, password } = authCredentialsDto;
        const user = this.create({
            username,
            password
        })

        await this.save(user);
        return user;
    }
}
```

### 유제 데이터 유효성 체크
- class-validator
```typescript
export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches('/^[a-zA-Z0-9]*$/', {
      message: 'password only accepts english & number'
    })
    password: string;
}
```
- ValidationPipe : 요청이 컨트롤러에 있는 핸들러로 들어왔을때 Dto 에 있는 유효성 조건에 맞게 체크
```typescript
@Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<User>{
      return this.authService.signUp(authCredentialsDto);
  }
```


### 유저 이름에 유니크한 값 주기
두가지 방법
1. repository 에서 findOne : DB 처리 2번
2. 데이터베이스 레벨에서 에러를 던져주는 방법 > 이 방법으로 entity 설정을 함
```typescript
@Entity()
@Unique(['username']) // username 이 유니크한 값이다
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}
```


### 비밀번호 암호화
- bcryptjs : salt, hash
```shell
yarn add bcryptjs
```

```typescript
import * as bcrypt from 'bcryptjs'
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise <User> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt(); // salt 생성
        const hashedPassword = await bcrypt.hash(password, salt); // hash화

        const user = this.create({
            username,
            password: hashedPassword
        })
        ...
```

### 로그인 기능
- hash 한 값과 입력값의 비교
```typescript
async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {username, password} = authCredentialsDto;
        const user = await this.userRepository.findOne({username}); // username으로 찾는다

        if (user && (await bcrypt.compare(password, user.password))){
            return 'Login success'
        }
        else {
            throw new UnauthorizedException('Login failed')
        }
    }
```
