import { Injectable } from '@nestjs/common';

/**
 * App Service
 */
@Injectable()
export class AppService {
  /**
   * Get hello
   */
  getHello(): string {
    return 'Hello World!';
  }
}
