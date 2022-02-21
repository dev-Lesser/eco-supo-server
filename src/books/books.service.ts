import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
    getAllBooks(): string{
        return 'get all bookx'
    }

    getBook(id: string): string{
        return `${id} book`
    }
}
