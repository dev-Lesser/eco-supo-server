import { Controller,Get,Param, Post, Body } from '@nestjs/common';
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

    @Post()
    createBook(@Body() bookData): Object{
        return this.booksService.createBook(bookData)
    }
}
