import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * App Controller
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  /**
   * Get hello
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
