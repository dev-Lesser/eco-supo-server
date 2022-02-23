import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Board } from './board.model';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

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
    createBoard(@Body() createBoardDto: CreateBoardDto): Board {
        return this.boardsService.createBoard(createBoardDto)
    }
    
    @Get('/:id')
    getBoardById(@Param('id') id: string): Board {
        return this.boardsService.getBoardById(id)
    }
}
