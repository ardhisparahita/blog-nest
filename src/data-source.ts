import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// --- TAMBAHKAN LOG INI UTK DEBUG ---
console.log('--- DEBUG TYPEORM ---');
console.log('URL dari ENV:', process.env.DATABASE_URL);
// -----------------------------------

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
