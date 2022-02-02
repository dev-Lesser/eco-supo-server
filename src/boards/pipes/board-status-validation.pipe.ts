import { BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board.model";

export class BoardStatusValidationPipe implements PipeTransform {
    readonly StatusOptions = [
        BoardStatus.PUBLIC,
        BoardStatus.PRIVATE
    ] // 바깥에서 접근을 할 수 있지만, 수정 할 수 없다

    transform(value: any) {
        // value:
        // metadata: 

        // enum 이외의 값이 들어 왔을때 에러가 나올 수 있도록 구현
        value = value.toUpperCase()
        if (!this.isStatusValid(value)){
            throw new BadRequestException(`${value} isnt in the status`)
        }

        return value;
    }
    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1
    }
}