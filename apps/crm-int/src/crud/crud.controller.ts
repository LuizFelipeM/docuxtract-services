import { Controller, Get } from '@nestjs/common';

@Controller('crud')
export class CrudController {
  @Get()
  getHello() {
    return 'Hello World!';
  }
}
