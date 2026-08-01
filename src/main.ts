import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Pipe: validates & transforms every incoming request body/query/param
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws if extra properties are sent
      transform: true, // auto-transforms payloads to DTO instances (works with @Type())
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
