import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Bootstrap
 */
async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

  if (config.get<string>('NODE_ENV') === 'production') {
    const origin = config.get<string>('ORIGIN');

    app.enableCors({ origin });

    logger.log(`Accepting requests from origin ${origin}`);
  }

  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dentist App API')
    .setDescription('This is API documentation of Dentist App')
    .setBasePath('https://stomatolog-uz-api.herokuapp.com')
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

/**
 * Start
 */
bootstrap();
