import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    
    app.setGlobalPrefix("api");
    app.enableCors({
        origin: "*",
    });
    app.useGlobalPipes(new ValidationPipe());
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`App is listening on port ${port}`);
}
bootstrap();