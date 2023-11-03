import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './config.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: false,
      isGlobal: true,
      envFilePath: ['.env*.local', '.env.local', '.env.*', '.env'],
      validate,
    }),
  ],
})
export class ConfigModule {}
