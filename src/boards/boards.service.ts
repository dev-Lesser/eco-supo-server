import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';
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
  async getAllBoards(skip: number, limit: number, user: User): Promise <Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId = :userId', {userId: user.id})
      .skip(skip)
      .take(limit)
    const boards = await query.getMany();
    return boards
    // return await this.boardRepository.find({
    //   skip: skip,
    //   take: limit,
    // })
  }
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
  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise <Board> {
    return await this.boardRepository.createBoard(createBoardDto, user); // repository 형식
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
  
  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({
      id, 
      user
    });
    // 없을때의 로직
    if (result.affected === 0) {
      throw new NotFoundException(`Cant find id == ${id}`)
    }

  }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id); //이런식으로 위에 선언한 함수를 다시 재사용 가능하다
  //   board.status = status;
  //   return board;
  // }
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
}
