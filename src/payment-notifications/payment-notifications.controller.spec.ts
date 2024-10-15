import { Test, TestingModule } from '@nestjs/testing';
import { PaymentNotificationsController } from './payment-notifications.controller';
import { PaymentNotificationsService } from './payment-notifications.service';

describe('PaymentNotificationsController', () => {
  let controller: PaymentNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentNotificationsController],
      providers: [PaymentNotificationsService],
    }).compile();

    controller = module.get<PaymentNotificationsController>(PaymentNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
