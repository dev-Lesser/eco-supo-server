import { Controller,Get,Param } from '@nestjs/common';
import { BooksService } from './books.service'
@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService){}
    @Get()
    getBooks(): string{
        return this.booksService.getAllBooks()
    }

    @Get('/:id')
    getBook(@Param('id') id:string): string{
        return this.booksService.getBook(id)
    }
}
