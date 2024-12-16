import { AmqpConnection, RequestOptions } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Options } from 'amqplib';
import { Exchange } from '../constants/exchange';
import { Exchanges } from '../constants/exchanges';
import { RoutingKey } from '../constants/routing-key';

interface RPCRequestOptions
  extends Omit<RequestOptions, 'exchange' | 'routingKey'> {
  routingKey: RoutingKey;
  payload: unknown;
  exchange?: Exchange;
}

interface PublishOptions extends Options.Publish {
  routingKey: RoutingKey;
  payload: unknown;
  exchange?: Exchange;
}

@Injectable()
export class RmqService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  private isRoutingKey(val: unknown): val is RoutingKey {
    return val instanceof RoutingKey;
  }

  rpc<T>(options: RPCRequestOptions): Promise<T>;
  rpc<T>(
    routingKey: RoutingKey,
    payload: unknown,
    exchange?: Exchange,
  ): Promise<T>;
  rpc<T>(
    opts: RPCRequestOptions | RoutingKey,
    pld?: unknown,
    exc?: Exchange,
  ): Promise<T> {
    const { exchange, routingKey, ...options } = this.isRoutingKey(opts)
      ? { exchange: exc, routingKey: opts, payload: pld }
      : opts;
    return this.amqpConnection.request<T>({
      exchange: exchange?.name ?? Exchanges.commands.name,
      routingKey: routingKey.value,
      timeout: 5000,
      ...options,
    });
  }

  publish(options: PublishOptions): Promise<boolean>;
  publish(
    routingKey: RoutingKey,
    payload: unknown,
    exchange?: Exchange,
  ): Promise<boolean>;
  publish(
    opts: PublishOptions | RoutingKey,
    pld?: unknown,
    exc?: Exchange,
  ): Promise<boolean> {
    const { exchange, routingKey, payload, ...options } = this.isRoutingKey(
      opts,
    )
      ? { exchange: exc, routingKey: opts, payload: pld }
      : opts;
    return this.amqpConnection.publish(
      exchange?.name ?? Exchanges.events.name,
      routingKey.value,
      payload,
      options,
    );
  }
}
