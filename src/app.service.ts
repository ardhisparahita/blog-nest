import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getRootInfo() {
    return {
      message: 'Blog NestJS API',
      repository: 'https://github.com/ardhisparahita/blog-nest',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: this.formatMemoryUsage(process.memoryUsage()),
    };
  }

  getHello(): string {
    return 'Hello from Blog NestJS API!';
  }

  private formatMemoryUsage(memory: NodeJS.MemoryUsage) {
    return {
      rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memory.external / 1024 / 1024)} MB`,
    };
  }
}
