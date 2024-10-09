import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ConfigModule } from '@nestjs/config';
import { OpenAIService } from './open-ai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatbot, ChatbotSchema } from './entities/chatbot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Budget } from 'src/shared/entities/budget.entity';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, OpenAIService],
  imports: [
    TypeOrmModule.forFeature([Budget]),
    ConfigModule,
    MongooseModule.forFeature(
      [
        {
          name: Chatbot.name,
          schema: ChatbotSchema,
        },
      ],
      'general',
    ),
  ],
})
export class ChatbotModule {}
