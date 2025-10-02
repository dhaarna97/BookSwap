import { Controller, Get, Post, Put, Delete, Body, Param, Res, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BookswapService } from './bookswap.service';
import { PostBookDto } from './bookswap.dto';
import { Response, Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('books')
export class BookswapController {
  constructor(
    private readonly bookswapService: BookswapService,
    private readonly authService: AuthService
  ) {}

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    }),
  )
  @Post()
  async postBook(
    @Body() bookDto: PostBookDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      // If file is uploaded, create full URL for the image
      if (file) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        bookDto.image = `${baseUrl}/uploads/${file.filename}`;
      }

      const result = await this.bookswapService.postBook(bookDto, userId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  }

  @Get()
  async getAllBooks(@Res() res: Response): Promise<any> {
    try {
      const result = await this.bookswapService.getAllBooks();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  }

  @Get('my-books')
  async getMyBooks(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return; 

      const result = await this.bookswapService.getMyBooks(userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  }

  @Get('my-requests')
  async getMyRequests(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.getMyRequests(userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  }


  @Get('requests-received')
  async getReceivedRequests(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.getReceivedRequests(userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  }

  @Get(':id')
  async getBookById(@Param('id') id: string, @Res() res: Response): Promise<any> {
    try {
      const result = await this.bookswapService.getBookById(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({
        message: error.message
      });
    }
  }


  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateData: PostBookDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.updateBook(id, userId, updateData);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  @Delete(':id')
  async deleteBook(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.deleteBook(id, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  @Post(':id/request')
  async requestBook(
    @Param('id') bookId: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.requestBook(bookId, userId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  @Put('requests/:requestId/:action')
  async handleBookRequest(
    @Param('requestId') requestId: string,
    @Param('action') action: 'accept' | 'decline',
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.handleBookRequest(requestId, action, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  @Delete('requests/:requestId')
  async cancelBookRequest(
    @Param('requestId') requestId: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.cancelBookRequest(requestId, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  @Get(':id/requests')
  async getBookRequests(
    @Param('id') bookId: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<any> {
    try {
      const userId = await this.bookswapService.extractUserIdFromToken(req, res);
      if (!userId) return;

      const result = await this.bookswapService.getBookRequests(bookId, userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

}

