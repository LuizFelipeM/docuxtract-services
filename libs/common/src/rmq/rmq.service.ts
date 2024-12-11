import { AmqpConnection, RequestOptions } from '@golevelup/nestjs-rabbitmq';
import { Exchange, RoutingKey } from '@libs/contracts';
import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Options } from 'amqplib';

interface RPCRequestOptions
  extends Omit<RequestOptions, 'exchange' | 'routingKey'> {
  exchange: Exchange;
  routingKey: RoutingKey;
  payload: unknown;
}

interface PublishOptions extends Options.Publish {
  exchange: Exchange;
  routingKey: RoutingKey;
  payload: unknown;
}

@Injectable()
export class RmqService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  rpc<T>(options: RPCRequestOptions): Promise<T>;
  rpc<T>(
    exchange: Exchange,
    routingKey: RoutingKey,
    payload: unknown,
  ): Promise<boolean>;
  rpc<T>(
    opts: RPCRequestOptions | Exchange,
    rtk?: RoutingKey,
    pld?: unknown,
  ): Promise<T> {
    const { exchange, routingKey, ...options } = isExchange(opts)
      ? { exchange: opts, routingKey: rtk, payload: pld }
      : opts;
    return this.amqpConnection.request<T>({
      exchange: exchange.name,
      routingKey: routingKey.value,
      ...options,
    });
  }

  publish(options: PublishOptions): Promise<boolean>;
  publish(
    exchange: Exchange,
    routingKey: RoutingKey,
    payload: unknown,
  ): Promise<boolean>;
  publish(
    opts: PublishOptions | Exchange,
    rtk?: RoutingKey,
    pld?: unknown,
  ): Promise<boolean> {
    const { exchange, routingKey, payload, ...options } = isExchange(opts)
      ? { exchange: opts, routingKey: rtk, payload: pld }
      : opts;

    return this.amqpConnection.publish(
      exchange.name,
      routingKey.value,
      payload,
      options,
    );
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}

const isExchange = (val: unknown): val is Exchange => val instanceof Exchange;
