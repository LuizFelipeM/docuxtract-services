import { Test, TestingModule } from '@nestjs/testing';
import { CrmIntController } from './crm-int.controller';
import { CrmIntService } from './crm-int.service';

describe('CrmIntController', () => {
  let crmIntController: CrmIntController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CrmIntController],
      providers: [CrmIntService],
    }).compile();

    crmIntController = app.get<CrmIntController>(CrmIntController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(crmIntController.getHello()).toBe('Hello World!');
    });
  });
});
