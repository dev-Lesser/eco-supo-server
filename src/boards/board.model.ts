export interface Board { // 모델 변수 타입 정의
    id: string;
    title: string;
    description: string;
    status: BoardStatus;
}

export enum BoardStatus { // type enum
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}