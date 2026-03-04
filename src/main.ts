import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Library Management System')
    .setDescription('The Library Management System API description')
    .setVersion('1.0')
    .addTag('Library Management System')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .addCookieAuth('token', {
      type: 'http',
      in: 'cookie',
      name: 'token',
    })
    .build();

  app.enableCors();
  app.use(cookieParser());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, () => document, {
    jsonDocumentUrl: 'doc/json',
    yamlDocumentUrl: 'doc/yaml',
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;

  await app.listen(port);
}
bootstrap();
