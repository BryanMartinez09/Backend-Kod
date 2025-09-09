// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { BootcampsModule } from './bootcamps/bootcamps.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get<string>('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_NAME'),
        // Usa autoLoadEntities si tus entidades están registradas con TypeOrmModule.forFeature en cada módulo
        autoLoadEntities: true,
        // O elimina autoLoadEntities y especifica entities: [User, Bootcamp] si prefieres
        synchronize: true, // SOLO DEV. En prod usa migraciones.
        logging: false,
        charset: 'utf8mb4',
        timezone: 'Z', // o 'local' si quieres fechas locales
      }),
    }),
    UserModule,
    AuthModule,
    BootcampsModule,
  ],
})
export class AppModule {}
