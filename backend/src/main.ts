import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dns from 'node:dns';

dns.setServers(['1.1.1.1', '1.0.0.1']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Konfigurasi Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kostify API')
    .setDescription(
      'Dokumentasi REST API untuk Sistem Informasi Manajemen Kos Kostify',
    )
    .setVersion('1.0')
    .addTag('rooms', 'Manajemen data kamar')
    .addTag('tenants', 'Manajemen data penghuni')
    .addTag('payments', 'Manajemen data pembayaran')
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();