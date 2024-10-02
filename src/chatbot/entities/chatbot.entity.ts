import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chatbot extends Document {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true, trim: true })
  message: string;
  @Prop({ required: true })
  isChatGpt: boolean;
}

export const ChatbotSchema = SchemaFactory.createForClass(Chatbot);
