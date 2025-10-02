import { Module } from "@nestjs/common";
import { BookswapController } from "./bookswap.controller";
import { BookswapService } from "./bookswap.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BookswapSchema } from "./bookswap.schema";
import { UserSchema } from "src/user/user.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
         MongooseModule.forFeature([{ name: 'Bookswap', schema: BookswapSchema },
            { name: 'User', schema: UserSchema }
         ]),
         AuthModule
    ],
    controllers: [BookswapController],
    providers: [BookswapService],
})
export class BookswapModule {}