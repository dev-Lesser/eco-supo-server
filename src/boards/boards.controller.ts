import { Body, Controller, Get, Post } from '@nestjs/common';
import { Board } from './board.model';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService){} // 암묵적으로 boardsService가 클래스 프로퍼티로 선언됨 > typescript 특징 > 아래와 같이 할 수 있음
    // boardsService: BoardsService;
    // constructor(boardsService: BoardsService) {
    //     this.boardsService = boardsService
    // }
    @Get()
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }
    @Post()
    createBoard(
        @Body('title') title: string,
        @Body('description') description: string
    ): Board {
            return this.boardsService.createBoard(title, description)
    }
    
}
