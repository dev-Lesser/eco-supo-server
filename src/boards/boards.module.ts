import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService], // 종속성 주입, 서비스 말고도 repository , factory 등
})
export class BoardsModule {}
