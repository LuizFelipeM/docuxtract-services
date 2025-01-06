export class RoutingKey {
  private readonly _value: string;

  constructor(...values: string[]) {
    this._value = values.join('.');
  }

  get value(): string {
    return this._value;
  }

  get all(): string {
    return `${this._value}.#`;
  }

  event(value?: string): string {
    return `${this._value}${value ? `.${value}` : ''}`;
  }
}
