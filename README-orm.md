### NestJS 튜토리얼
1. TypeORM

#### TypeORM
- 객체 관계형 매퍼 라이브러리
- Object <-> DB : 데이터를 자동으로 변형 및 연결하는 작업
- 모델 기반으로 데이터베이스 테이블 체계를 자동으로 생성
- 개체를 쉽게 삽입 업데이트 및 삭제할 수 있음
- 테이블 간의 매핑 일대일, 일대다, 다대다 을 만든다
- CLI 명령 제공
```shell
yarn add pg typeorm @nestjs/typeorm
```
- pg : postgres 모듈
- typeorm 
- @nestjs/typeorm : NestJS 에서 TypeOrm 을 사용하기 위해 연동 모듈


##### TypeORM 애플리케이션 연결
1. 설정파일 생성
- src/configs/typeorm.config.ts
2. typeorm config 파일 생성 :  DB 는 docker compose 이용
```typescript
export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5438,
    username: 'postgres',
    password: 'postgres',
    database: 'board-app',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
}
```
3. 루트 Module 에서 Import
- app.module.ts

---
##### 게시물을 위한 엔티티 생성
-TypeORM 을 사용할 때는 Class 를 생성한 후 컬럼 정의
```shell
1. @Entity > Create table 의 부분
2. @PrimaryGeneratedColumn > primary key column
3. @Column > 각 열
```

```typescript
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;
}
```
---
##### Repository 생성
- 엔티티 개체와 함께 작동 
  - 삽입, 찾기, 업데이트, 삭제 등을 처리
  - [공식문서](https://typeorm.delightful.studio/classes/_repository_repository_.repository.html)
  - DB 관련 작업이라 보면 됨 - repository pattern

1. 리포지토리 파일 생성
- board.repository.tx
2. 생성파일에 리포지토리를 위한 클래스 생성
- 생성시 Repository 클래스를 Extends 함 (Find, insert, delete 등 엔티티 컨트롤)

- @EntityRepository()
  - 클래스를 custom 저장소로 선언하는데 사용

```typescript
@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {   
}
```
- 이후 module 에 들어가 추가해준다. > 모듈을 추가하려고 하니깐 당연하다.
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([BoardRepository]) // 추가
  ],
  controllers: [BoardsController],
  providers: [BoardsService], 
})
```

---

#### TypeORM 수정 코드
- entity와 repository 로 DB 에 접근하려고 함
- 관련 필요없는 코드 주석 처리
```typescript
@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {} // BoardRepository 를 넣어줌 > DB
```
- service 에 repository 를 추가해주어서 사용

#### service 에서 getBoardById 메소드 생성
- TypeORM 에서 제공하는 findOne 메소드 사용
- async, await 이용