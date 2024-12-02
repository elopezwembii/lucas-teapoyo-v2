import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MyPlanDocument = MyPlan & Document;

@Schema({ timestamps: true })
export class MyPlan extends Document {
  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true, enum: ['active', 'inactive'] })
  preferenceId: 'active' | 'inactive';
}

export const MyPlanSchema = SchemaFactory.createForClass(MyPlan);
