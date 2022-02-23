import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './board.model'
import { v1 as uuid } from 'uuid'
import { CreateBoardDto } from './dto/create-board.dto';
@Injectable() 
export class BoardsService {
    private boards: Board[] = []; // private 사용하지 않으면, 다른 컴포넌트에서 수정할 수 있게 되어버림 > 데이터의 형식

    getAllBoards(): Board[] { // GET ALL Boards
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto): Board { // CREATE 1 Board
        const {title, description} = createBoardDto;

        const board: Board = {
            id: uuid(),
            title, // > title: title 과 같은 문법 > 이름이 같으면
            description,
            status: BoardStatus.PUBLIC // 기본 default 로 public 으로 설정함
        }
        this.boards.push(board)
        return board
    }

    getBoardById(id: string): Board {
        return this.boards.find((board) => board.id === id)
    }

    deleteBoard(id: string): void {
        this.boards = this.boards.filter((board) => board.id !== id)
    }
}
