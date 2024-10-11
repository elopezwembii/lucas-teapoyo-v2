import {
  Controller,
  Post,
  Body,
  Req,
  Query,
  Res,
  Get,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtDecode } from 'jwt-decode';

@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('ask')
  async ask(
    @Body() createChatbotDto: CreateChatbotDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = jwtDecode(req.headers['authorization']);
    console.log({ token });
    if (!token) throw new UnauthorizedException('Token inválido');

    const response = await this.chatbotService.ask(
      createChatbotDto,
      req.headers['authorization'],
    );
    return res.status(200).json(response);
  }
  @Get('test')
  get() {
    return this.chatbotService.test();
  }
}
