import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {} // BoardRepository 를 넣어줌 > DB

  // private boards: Board[] = []; // private 사용하지 않으면, 다른 컴포넌트에서 수정할 수 있게 되어버림 > 데이터의 형식

  // getAllBoards(): Board[] {
  //   // GET ALL Boards
  //   return this.boards;
  // }

  // createBoard(createBoardDto: CreateBoardDto): Board {
  //   // CREATE 1 Board
  //   const { title, description } = createBoardDto;

  //   const board: Board = {
  //     id: uuid(),
  //     title, // > title: title 과 같은 문법 > 이름이 같으면
  //     description,
  //     status: BoardStatus.PUBLIC, // 기본 default 로 public 으로 설정함
  //   };
  //   this.boards.push(board);
  //   return board;
  // }
    createBoard(createBoardDto: CreateBoardDto): Promise <Board> {
      return this.boardRepository.createBoard(createBoardDto); // repository 형식
    }

  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);
  //   if (!found){
  //     throw new NotFoundException(`Cant find Board with id == ${id}`); // message 형태로 나옴
  //   }
  //   else {
  //     return found;
  //   }
  // }
    async getBoardById(id: number): Promise <Board> { // 엔티티에 정의된 값
      const found = await this.boardRepository.findOne(id);
      if (!found) {
        throw new NotFoundException(`${id} cant be found`)
      }
      return found
    }
  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id); // 있는지 먼저 체크
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id); //이런식으로 위에 선언한 함수를 다시 재사용 가능하다
  //   board.status = status;
  //   return board;
  // }
}
