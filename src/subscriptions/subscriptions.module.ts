import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/shared/entities/plan.entity';
import { User } from 'src/shared/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MyPlan, MyPlanSchema } from './entities/plan.entity';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [
    TypeOrmModule.forFeature([Plan]),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    AuthModule,
    MongooseModule.forFeature(
      [
        {
          name: MyPlan.name,
          schema: MyPlanSchema,
        },
      ],
      'general',
    ),
  ],
})
export class SubscriptionsModule {}
