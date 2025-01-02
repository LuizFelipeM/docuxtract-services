import { AbstractRepository } from '@libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(dataSource: DataSource) {
    super(dataSource.getRepository<User>(User));
  }
}
