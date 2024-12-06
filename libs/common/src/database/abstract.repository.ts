import { Logger } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export abstract class AbstractRepostiroy<TEntity extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(private readonly repository: Repository<TEntity>) {}

  async insert(entity: TEntity): Promise<void> {
    await this.repository.insert(entity as any);
  }

  async update(entity: WithRequired<Partial<TEntity>, 'id'>): Promise<void> {
    await this.repository.update(entity.id, entity as any);
  }

  async upsert(entity: TEntity): Promise<void> {
    await this.repository.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<TEntity> {
    return await this.repository.findOneBy(where);
  }

  async find(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<TEntity[]> {
    return await this.repository.findBy(where);
  }

  async delete(entity: WithRequired<Partial<TEntity>, 'id'>): Promise<void> {
    await this.repository.delete(entity.id);
  }
}
