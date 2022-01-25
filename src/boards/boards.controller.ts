import { Controller } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService){} // 암묵적으로 boardsService가 클래스 프로퍼티로 선언됨 > typescript 특징
}
