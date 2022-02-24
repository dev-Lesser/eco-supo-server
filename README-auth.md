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

### JWT
- json web token : json 객체로 안전하게 전송하기 위한 개방형 표준
```
yarn add @nestjs/jwt @nestjs/passport passport passport-jwt
```
#### auth 모듈에 jwt 모듈 등록
```typescript
Module({
  imports: [
    JwtModule.register({
      secret: 'SupperSecret', // .env 화 필요
      signOptions: {
        expiresIn: 60*60 // 한시간
      }
    }),
```
#### auth 모듈에 passport 모듈 등록
- jwt 방법으로
```typescript
@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
```


### Passport 모듈
- 클라이언트에서 요청 보낼때의 jwt 토큰을 함께 보내는 방법
1. jwt.strategy.ts 파일 생성
- @types/passport-jwt 모듈 > passport-jwt 모듈을 위함

2. 코드작성
- 다른곳에서도 써야하므로 injectable 을 해준다
```typescript
@Injectable() // > 다른곳에서도 사용할 수 있게 데코레이션 넣음

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: 'SuperSecret', // .env 추가 > jwt 비교를 위한 값
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }   
```
- payload 에 담에 validation 을 진행함 > 이때 DB 에서 findOne 으로 username 을 검색함
```typescript
async validate(payload) {
        const {username} = payload;
        const user: User = await this.userRepository.findOne({username});

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
```
- JwtStrategy 를 prividers 에 넣어줘야함
```typescript
providers: [AuthService, JwtStrategy],
exports: [JwtStrategy, PassportModule] // 다른데에서도 사용할 수 있게 export
```
#### 요청안에 유저 정보를 넣는 방법
- UserGuards : @nestjs/passport 에서 가져온 AuthGuard()를 이용하면 요청안에 유저 정보를 넣음
```typescript
@Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req){
        console.log(req)
    }
```
- 이 validate 함수의 전략을 사용하여 UseGuards 미들웨어가 들어가 있으면 user 정보가 들어가져 있음
```typescript
async validate(payload) {
    const {username} = payload;
    const user: User = await this.userRepository.findOne({username});
    if (!user) {
        throw new UnauthorizedException();
    }
    return user;
}
```
---

### 커스텀 데코레이터 생성
- 위의 방법에서 user 를 가져오려면 req.user 로 해야한다
- 단순 user 로 객체를 가져오기 위해 커스터마이징 함
1. get-user.decorator.ts
```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) =>{
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})
```
```typescript
@Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){
        console.log(user)
    }
```
```bash
User {
  id: 8,
  username: 'test',
  password: '...'
}
```
- 이런식으로 user 정보만 따로 빼서 나타낼수 있다


### 인증된 유저만 게시물 보고 쓸수 있게 만들기
- boards 모듈에 auth 모듈을 넣어준다
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([BoardRepository]),
    AuthModule,
  ],
```
```typescript
@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  constructor(private boardsService: BoardsSe
```
- controller 레벨로 전체 인증이 필요

### 유저와 게시물의 관계 형성
- **엔티티**에 서로간의 필드를 넣어줘야함
- [관계형성 설명 사이트](https://typeorm.io/#/many-to-one-one-to-many-relations)
    - user entity : one to many, 
    - boards entity : many to one
```typescript
 @OneToMany(type => Board, board => board.user, {eager: true})
    boards: Board[] //여러개
```
- (user entity)
```typescript
@ManyToOne(type => User, user => user, {eager: false})
    user: User // 
}
```
-(boards entity)

---
### 게시물 생성할 때 유저정보 넣어주기
- 생성요청 > 헤더안 토큰 유저정보 > 가져와서 생성
