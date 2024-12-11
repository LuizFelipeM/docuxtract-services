import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

type ExchangeProps = 'Commands' | 'Events';

export const Exchange: Record<ExchangeProps, RabbitMQExchangeConfig> = {
  Commands: {
    name: 'commands',
    type: 'topic',
    createExchangeIfNotExists: true,
  },
  Events: {
    name: 'events',
    type: 'topic',
    createExchangeIfNotExists: true,
  },
};
