import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: '*******',
  password: '************',
  port: 5432,
  host: '127.0.0.1',
  database: 'stockmanager',
  synchronize: false,
  logging: true,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};