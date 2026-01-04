import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  return {
    type: 'mysql',
    ...(isProd
      ? {
          url: configService.get<string>('DATABASE_URL'),
          synchronize: true,
        }
      : {
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          synchronize: true,
        }),

    autoLoadEntities: true,

    extra: {
      connectTimeout: 30000,
    },
  };
};
