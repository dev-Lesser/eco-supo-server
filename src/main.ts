import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // 가장 큰 모듈 > 세부 모듈들을 포함하고 있다

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000
  await app.listen(port);
  Logger.log(`Application running on port ${port}`)
}
bootstrap();
