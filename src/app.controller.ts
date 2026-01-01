import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return this.appService.getRootInfo();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealthCheck();
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('version')
  getVersion() {
    return {
      name: 'blog-nest-api',
      version: '1.0.0',
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }
}
