import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',

  // ✅ PAKAI URL SAJA
  url: configService.get<string>('DATABASE_URL'),

  autoLoadEntities: true,

  // ⚠️ PRODUCTION HARUS FALSE
  synchronize: false,

  extra: {
    connectTimeout: 30000,
  },
});
