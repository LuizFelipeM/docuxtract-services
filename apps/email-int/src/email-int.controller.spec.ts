import { Test, TestingModule } from '@nestjs/testing';
import { EmailIntController } from './email-int.controller';
import { EmailIntService } from './email-int.service';

describe('EmailIntController', () => {
  let emailIntController: EmailIntController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmailIntController],
      providers: [EmailIntService],
    }).compile();

    emailIntController = app.get<EmailIntController>(EmailIntController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emailIntController.getHello()).toBe('Hello World!');
    });
  });
});
