import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ConfigService } from '@nestjs/config';
import {
  RabbitMQChannels,
  RabbitMQConfig,
  RabbitMQExchangeConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';

interface RmqModuleOptions {
  exchanges: RabbitMQExchangeConfig[];
  prefetchCount?: number;
  defaultRpcTimeout?: number;
  channels?: RabbitMQChannels;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static forRoot({
    exchanges,
    prefetchCount = 20,
    defaultRpcTimeout = undefined,
    channels = {},
  }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      exports: [RabbitMQModule],
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          inject: [ConfigService],
          useFactory: (
            configService: ConfigService,
          ): RabbitMQConfig | Promise<RabbitMQConfig> => ({
            enableControllerDiscovery: true,
            uri: configService.get<string>('RABBIT_MQ_URL'),
            exchanges,
            channels,
            prefetchCount,
            defaultRpcTimeout,
          }),
        }),
      ],
    };
  }
}
