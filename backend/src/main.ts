import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dns from 'node:dns';

dns.setServers(['1.1.1.1', '1.0.0.1']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix untuk seluruh REST API
  app.setGlobalPrefix('api');

  app.enableCors();

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

  // Swagger dipindahkan dari /api menjadi /docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();