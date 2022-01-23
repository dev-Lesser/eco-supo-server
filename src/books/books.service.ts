import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
    getAllBooks(): string{
        return 'get all bookx'
    }

    getBook(id: string): string{
        return `${id} book`
    }

    createBook(id: string): string{
        return Object.assign({
            statusCode: 201,
            data: id,
            statusMsg: 'created successfully',
          });
    }
}
