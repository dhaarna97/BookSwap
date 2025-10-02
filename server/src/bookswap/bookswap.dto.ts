import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BookCondition } from "./bookswap.enum";

export class PostBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(BookCondition)
    condition: BookCondition;

    @IsString()
    @IsOptional()
    image?: string;
}

export class BookRequestDto {
    @IsString()
    @IsNotEmpty()
    bookId: string;

    @IsString()
    @IsOptional()
    requestId?: string;

    @IsString()
    status: string;

    @IsNotEmpty()
    createdAt: Date;
}
