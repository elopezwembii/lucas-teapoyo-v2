import { Module } from '@nestjs/common';
import { PaymentNotificationsService } from './payment-notifications.service';
import { PaymentNotificationsController } from './payment-notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentNotification,
  PaymentNotificationSchema,
} from './entities/payment-notification.entity';

@Module({
  controllers: [PaymentNotificationsController],
  providers: [PaymentNotificationsService],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: PaymentNotification.name,
          schema: PaymentNotificationSchema,
        },
      ],
      'general',
    ),
  ],
  exports: [PaymentNotificationsService],
})
export class PaymentNotificationsModule {}
