import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDevelopment = this.config.get<string>('NODE_ENV') === 'development';

    let options: TypeOrmModuleOptions = {
      type: 'postgres',
      entities: [__dirname + '/../../**/*.entity.js'],
      synchronize: this.config.get<boolean>('DATABASE_SYNCHRONIZE'),
    };

    if (isDevelopment) {
      options = {
        ...options,
        port: this.config.get<number>('DATABASE_PORT'),
        database: this.config.get<string>('DATABASE_NAME'),
        host: this.config.get<string>('DATABASE_HOST'),
        username: this.config.get<string>('DATABASE_USERNAME'),
        password: this.config.get<string>('DATABASE_PASSWORD'),
        logging: true,
      };
    } else {
      options = {
        ...options,
        url: this.config.get<string>('DATABASE_URL'),
        logging: false,
        extra: {
          max: this.config.get<number>('DATABASE_POOL_SIZE') || 10,
          connectionTimeoutMillis:
            this.config.get<number>('DATABASE_CONNECTION_TIMEOUT') || 100000,
          ssl: {
            rejectUnauthorized: false,
          },
        },
      };
    }

    return options;
  }
}
