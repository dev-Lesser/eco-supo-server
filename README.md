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
