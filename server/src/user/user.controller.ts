import { Controller, Get, Post, Body, Param, Res, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    cb(null, `avatar_${Date.now()}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    @Post('register')
    async createUser(
        @Body() userDto: CreateUserDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response,
        @Req() req: Request
    ): Promise<any> {
        try {
            if (file) {
                // Create full URL for the uploaded image
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                userDto.avatar = `${baseUrl}/uploads/${file.filename}`;
            }

            const result = await this.userService.createUser(userDto);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }

    @Post('login')
    async loginUser(
        @Body() loginUserDto: LoginUserDto,
        @Res() res: Response
    ): Promise<any> {
        try {
            const result = await this.userService.loginUser(loginUserDto);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    @Get('profile')
    async getUserProfile(@Req() req: any, @Res() res: Response) {
        try {
            const authorizationToken = req.headers.authorization;
            if (!authorizationToken) {
                return res.status(401).json({ message: 'No authorization token provided' });
            }

            const { token, tokenPayload, fullToken }: any = 
                this.authService.decodeAuthToken(authorizationToken);

            if (!tokenPayload || !tokenPayload.id) {
                return res.status(401).json({ message: 'Invalid token payload' });
            }

            const verifiedPayload = this.authService.verifyAuthToken(authorizationToken);
            
            const userId = verifiedPayload.id;
            const result = await this.userService.getUserProfile(userId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(401).json({ 
                message: 'Invalid or expired token',
                error: error.message 
            });
        }
    }
}