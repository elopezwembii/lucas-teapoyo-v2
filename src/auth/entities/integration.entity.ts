import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntegrationDocument = Integration & Document;

@Schema({ timestamps: true })
export class Integration extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true, enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);
