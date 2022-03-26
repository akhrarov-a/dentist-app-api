import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

/**
 * Bootstrap
 */
async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

  if (process.env.NODE_ENV === 'production') {
    const origin = config.get<string>('ORIGIN');

    app.enableCors({ origin });

    logger.log(`Accepting requests from origin ${origin}`);
  }

  app.setGlobalPrefix('api/v1');

  const port = parseInt(`${config.get<string>('PORT')}`);

  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}

/**
 * Start
 */
bootstrap();
