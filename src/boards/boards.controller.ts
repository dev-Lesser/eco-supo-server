import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {} // 암묵적으로 boardsService가 클래스 프로퍼티로 선언됨 > typescript 특징 > 아래와 같이 할 수 있음
  // boardsService: BoardsService;
  // constructor(boardsService: BoardsService) {
  //     this.boardsService = boardsService
  // }
  // @Get()
  // getAllBoards(): Board[] {
  //   return this.boardsService.getAllBoards();
  // }

  // @Post()
  // @UsePipes(ValidationPipe) // handler level 로 dto 안의 is not empty 를 체크
  // createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //   return this.boardsService.createBoard(createBoardDto);
  // }

  // @Get('/:id')
  // getBoardById(@Param('id') id: string): Board {
  //   return this.boardsService.getBoardById(id);
  // }
    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise <Board> {
      return this.boardsService.getBoardById(id)
    }

  // @Delete('/:id')
  // deleteBoard(@Param('id') id: string): void {
  //   this.boardsService.deleteBoard(id); // return 값 따로 없음
  // }

  // @Patch('/:id/status')
  // updateBoardStatus(
  //   @Param('id') id: string,
  //   @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  // ): Board {
  //   return this.boardsService.updateBoardStatus(id, status);
  // }
}
