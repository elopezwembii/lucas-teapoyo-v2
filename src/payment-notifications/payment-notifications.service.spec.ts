import { Test, TestingModule } from '@nestjs/testing';
import { PaymentNotificationsService } from './payment-notifications.service';

describe('PaymentNotificationsService', () => {
  let service: PaymentNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentNotificationsService],
    }).compile();

    service = module.get<PaymentNotificationsService>(PaymentNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
