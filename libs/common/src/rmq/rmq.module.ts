import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Services, ServicesConfigs } from '@libs/contracts';

interface RmqModuleOptions {
  name: Services;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(
    options: RmqModuleOptions | Array<RmqModuleOptions>,
  ): DynamicModule {
    let imports = [];
    if (!Array.isArray(options))
      imports.push(
        ClientsModule.registerAsync([
          {
            name: options.name,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URL')],
                queue: ServicesConfigs[options.name].queue,
              },
            }),
          },
        ]),
      );
    else
      imports = options.map(({ name }) =>
        ClientsModule.registerAsync([
          {
            name,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URL')],
                queue: ServicesConfigs[name].queue,
              },
            }),
          },
        ]),
      );

    return {
      module: RmqModule,
      exports: [ClientsModule],
      imports,
    };
  }
}
