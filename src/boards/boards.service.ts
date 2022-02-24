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
  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise <Board> {
    return await this.boardRepository.createBoard(createBoardDto, user); // repository 형식
  }

  async getBoardById(id: number): Promise <Board> { // 엔티티에 정의된 값
    const found = await this.boardRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`${id} cant be found`)
    }
    return found
  }
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

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
}
