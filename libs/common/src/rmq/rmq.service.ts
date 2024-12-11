import { AmqpConnection, RequestOptions } from '@golevelup/nestjs-rabbitmq';
import { RoutingKey } from '@libs/contracts';
import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Options } from 'amqplib';

interface RPCRequestOptions
  extends Omit<RequestOptions, 'exchange' | 'routingKey'> {
  exchange: string;
  routingKey: RoutingKey;
}

interface PublishRequestOptions extends Options.Publish {
  exchange: string;
  routingKey: RoutingKey;
}

@Injectable()
export class RmqService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  rpc<T>({ exchange, routingKey, ...opts }: RPCRequestOptions): Promise<T> {
    return this.amqpConnection.request<T>({
      exchange: exchange,
      routingKey: routingKey.value,
      ...opts,
    });
  }

  publish({
    exchange,
    routingKey,
    ...opts
  }: PublishRequestOptions): Promise<boolean> {
    return this.amqpConnection.publish(exchange, routingKey.value, opts);
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
