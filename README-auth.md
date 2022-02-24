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