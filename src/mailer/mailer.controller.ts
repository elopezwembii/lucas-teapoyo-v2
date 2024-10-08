import { Body, Controller, Post, Res } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/send-email.dto';
import { Response } from 'express';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}
  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto, @Res() res: Response) {
    const response = await this.mailerService.sendEmail(sendEmailDto);
    return res.status(response[0].statusCode).json({
      status: response[0].statusCode,
      message: 'Correo envíado exitosamente.',
    });
  }
}
