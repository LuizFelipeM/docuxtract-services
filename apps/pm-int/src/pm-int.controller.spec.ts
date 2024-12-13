import { Test, TestingModule } from '@nestjs/testing';
import { PmIntController } from './pm-int.controller';
import { PmIntService } from './pm-int.service';

describe('PmIntController', () => {
  let pmIntController: PmIntController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PmIntController],
      providers: [PmIntService],
    }).compile();

    pmIntController = app.get<PmIntController>(PmIntController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pmIntController.getHello()).toBe('Hello World!');
    });
  });
});
