import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto'

@Injectable()
export class BooksService {
    getAllBooks(): string{
        return 'get all bookx'
    }

    getBook(id: string): string{
        return `${id} book`
    }

    createBook(data: CreateBookDto): string{
        return Object.assign({
            data: data,
            statusMsg: 'created successfully',
          });
    }
}
