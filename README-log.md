### 로그
- Log
- Warning
- Error
- Debug
- Verbose

#### 로그 처리 모듈
- expressJS : winston
- nestJS : 빌트인 된 logger class 있음

---
- main.ts
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000
  await app.listen(port);
  Logger.log(`Application running on port ${port}`)
}
bootstrap();
```

- board get all boards
```typescript
@Get()
  getAllBoards(
    @Query('skip', new DefaultValuePipe(0) , ParseIntPipe) skip: number, // DefulatValue Pipe 추가
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @GetUser() user: User,
  ): Promise <Board[]>{
    this.logger.verbose(`User ${user.username} trying to get all boards`) /// log
    return this.boardsService.getAllBoards(skip, limit, user);
  }
```