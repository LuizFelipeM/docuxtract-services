export abstract class Step<T, R> {
  abstract name: string;
  abstract invoke(params: T): Promise<R>;
  abstract withCompensation(params: T): Promise<R>;
}
