import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'bookswapsecret',
            signOptions: { expiresIn: '1d' },
        }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        AuthModule
    ],
    controllers: [UserController],
    providers: [UserService],  
})
export class UserModule {}