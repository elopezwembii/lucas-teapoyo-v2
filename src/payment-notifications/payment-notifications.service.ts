import { Injectable } from '@nestjs/common';
import { CreatePaymentNotificationDto } from './dto/create-payment-notification.dto';
import { UpdatePaymentNotificationDto } from './dto/update-payment-notification.dto';
import { PaymentNotification } from './entities/payment-notification.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentNotificationsService {
  constructor(
    @InjectModel(PaymentNotification.name, 'general')
    private readonly paymentNotificationSchema: Model<PaymentNotification>,
  ) {}
  async create(createPaymentNotificationDto: CreatePaymentNotificationDto) {
    return await this.paymentNotificationSchema.create(createPaymentNotificationDto);
  }

 async findAll() {
    return await this.paymentNotificationSchema.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentNotification`;
  }

  update(
    id: number,
    updatePaymentNotificationDto: UpdatePaymentNotificationDto,
  ) {
    return `This action updates a #${id} paymentNotification`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentNotification`;
  }
}
