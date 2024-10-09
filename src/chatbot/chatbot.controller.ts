import { Controller, Post, Body, Req, Query, Res, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { Request, Response } from 'express';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('ask')
  async ask(
    @Body() createChatbotDto: CreateChatbotDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.chatbotService.ask(
      createChatbotDto,
      req.headers['authorization'],
    );
    return res.status(200).json(response);
  }
  @Get("test")
  get(){
    return this.chatbotService.test();
  }
}
