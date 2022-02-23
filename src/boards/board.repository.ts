import { EntityRepository, Repository } from "typeorm";
import { Board } from "./board.entity";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
    // board.service 에서 사용할 수 있게 DB 적용
}