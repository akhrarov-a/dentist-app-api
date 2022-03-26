import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Type orm config service
 */
@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  /**
   * Crate type orm options
   */
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDevelopment = this.config.get<string>('NODE_ENV') === 'development';

    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      entities: [__dirname + '/../../**/*.entity.js'],
      synchronize: isDevelopment,
    };

    if (isDevelopment) {
      options.port = this.config.get<number>('DATABASE_PORT');
      options.database = this.config.get<number>('DATABASE_NAME');
      options.host = this.config.get<number>('DATABASE_HOST');
      options.username = this.config.get<string>('DATABASE_USERNAME');
      options.password = this.config.get<string>('DATABASE_PASSWORD');
      options.logging = true;
    } else {
      options.url = this.config.get<number>('DATABASE_URL');
      options.logging = false;
      options.extra = {
        max: this.config.get<number>('DATABASE_POOL_SIZE') || 10,
        connectionTimeoutMillis:
          this.config.get<number>('DATABASE_CONNECTION_TIMEOUT') || 100000,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }

    return options;
  }
}

export { TypeOrmConfigService };
