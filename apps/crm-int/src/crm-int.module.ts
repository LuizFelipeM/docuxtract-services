import { Module } from '@nestjs/common';
import { CrmIntController } from './crm-int.controller';
import { CrmIntService } from './crm-int.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'crm_int',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [CrmIntController],
  providers: [CrmIntService],
})
export class CrmIntModule { }
