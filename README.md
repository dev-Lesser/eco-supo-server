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