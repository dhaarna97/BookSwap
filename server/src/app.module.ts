import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { BookswapModule } from "./bookswap/bookswap.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/bookswap'),
        UserModule,
        BookswapModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],

})
export class AppModule {}