import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env manual karena kita tidak pakai ConfigService NestJS di sini
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'mysql',

  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        extra: { ssl: { rejectUnauthorized: false } },
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
  entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
  migrations: ['dist/migrations/*.js', 'src/migrations/*.ts'],

  synchronize: false,
});
