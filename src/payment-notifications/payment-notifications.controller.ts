import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentNotificationsService } from './payment-notifications.service';
import { CreatePaymentNotificationDto } from './dto/create-payment-notification.dto';
import { UpdatePaymentNotificationDto } from './dto/update-payment-notification.dto';
import { Protected } from 'src/auth/decorators/protected.decorator';

@Controller('payment-notifications')
export class PaymentNotificationsController {
  constructor(
    private readonly paymentNotificationsService: PaymentNotificationsService,
  ) {}

  @Post()
  @Protected()
  create(@Body() createPaymentNotificationDto: CreatePaymentNotificationDto) {
    return this.paymentNotificationsService.create(
      createPaymentNotificationDto,
    );
  }
}
