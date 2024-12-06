import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('DB_CONNECTION_STRING'),
        entities: [],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
