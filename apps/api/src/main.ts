import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const config = app.get(AppConfigService);

  app.setGlobalPrefix(config.apiPrefix);

  app.enableCors({
    origin: config.isDevelopment ? '*' : config.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SaaS Ops API')
    .setDescription('SaaS Management Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${config.apiPrefix}/docs`, app, document);

  await app.listen(config.port, '0.0.0.0');

  console.log(`API running on http://localhost:${config.port}/${config.apiPrefix}`);
  console.log(`Swagger docs at http://localhost:${config.port}/${config.apiPrefix}/docs`);
}

bootstrap();
