import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // 가장 큰 모듈 > 세부 모듈들을 포함하고 있다

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
