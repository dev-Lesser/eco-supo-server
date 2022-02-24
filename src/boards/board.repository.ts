import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { BoardStatus } from "./board-status.enum";
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/create-board.dto";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
    // board.service 에서 사용할 수 있게 DB 적용
    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>{
        const {title, description} = createBoardDto;
        const board = this.create({ // 이미 repository 안에 있어서
            title,
            description,
            status: BoardStatus.PUBLIC,
            user
        });
        await this.save(board);
        return board
    
    }
}