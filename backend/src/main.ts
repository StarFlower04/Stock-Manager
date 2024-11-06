import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', 
  });

  app.use(cors({
    origin: 'http://localhost:5000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  }));

  const config = new DocumentBuilder()
    .setTitle("Stock Manager API")
    .setDescription("This API for stock management")
    .setVersion("1.0")
    .addTag('API')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT', 
      },
      'jwt', 
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();