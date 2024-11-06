import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

  const origin = config.get<string>('ORIGIN');
  app.enableCors({ origin });
  logger.log(`Accepting requests from origin ${origin}`);

  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dentist App API')
    .setDescription('This is API documentation of Dentist App')
    .setBasePath(config.get<string>('BASE_URL'))
    .setVersion('v1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'Dentist App API',
  });

  const port = parseInt(`${config.get<string>('PORT')}`);

  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}

bootstrap();
