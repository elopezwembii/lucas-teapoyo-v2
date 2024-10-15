import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PaymentNotification extends Document {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true, trim: true })
  reminderDate: string;
  @Prop({ required: true })
  recurrentItemId: number;
}

export const PaymentNotificationSchema =
  SchemaFactory.createForClass(PaymentNotification);
