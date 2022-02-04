### NestJS 튜토리얼
1. nest cli
2. module
3. controller
4. service
5. provider
6. model
7. dto

#### nest cli

####
```
private boards: Board[] = []; 
```
- private 사용하지 않으면, 다른 컴포넌트에서 수정할 수 있게 되어버림 > 데이터의 형식


#### DTO > Class 로 사용
- 데이터 유효성을 체크
- 안정적인 코드 > 타입스크립트의 타입

- controller, service 의 변수의 타입 체크에 효율적 > 반복작업 제거
- interface 가 아닌 class 로 하는 이유는 프로그램 실행중에 class 가 작동하기 때문에 파이프 같은 기능을 이용할 때 더 유용

---
#### Param
```typescript
@Get('/:id')
    getBoardById(@Param('id') id: string): Board {
        return this.boardsService.getBoardById(id)
    }
```
- 이렇게 Param 의 id 를 specific 하게 선언할 수 있지만
```typescript
getBoardById(@Param() params: string[]): Board {
```
- 이런식으로 params 의 Array string 형식으로 여러개를 한번에 가져올 수 있다.

---
#### 함수 재사용
```typescript
    getBoardById(id: string): Board {
        return this.boards.find((board) => board.id === id)
    }
    updateBoardStatus(id: string, status: BoardStatus): Board {
        const board = this.getBoardById(id); //이런식으로 위에 선언한 함수를 다시 재사용 가능하다
        board.status = status;
        return board
    }
```
- 이런식으로 위에 선언한 함수를 다시 재사용 가능하다


##### 위의 방법으로는 데이터의 transformation 이나 validation 이 안됨
---

#### Pipe 란
- @Injectable () 데코레이터로 주석이 달린 클래스
- data transformation / validation 을 위해 사용
- 요청을 보내기 전에 Pipe 에 들려서 유효성 검증을 함
- 라우트 핸들러 가 처리하는 인수에 대해 작동
- 메소드 바로 직전 작동

##### Built-in Pipes
- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe

##### Pipe 필요한 모듈
- class-validator, class-transformer
```bash
yarn add class-validator class-transformer
```
- DTO 부분에 유효성 체크 : 빈공간이면 에러 IsNotEmpty
```typescript
export class CreateBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
```

#### 커스텀 파이프를 이용한 유효성 체크
- 인터페이스 새로 만들어야 한다
- PipeTransform
```typescript
class testPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata)
}
```
- 이렇게 무조건 설정

- transform method : value, metadata 파라미터를 가짐 
  - 처리가 된 인자값, 그것의 메타데이터
- 보통 enum 타입 체크를 위한 것이라고 생각해도 될듯

---

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

