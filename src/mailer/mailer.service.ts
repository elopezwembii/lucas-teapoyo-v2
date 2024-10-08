import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
const sgMail = require('@sendgrid/mail');
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailType } from './types/email.type';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}
  async sendEmail(emailData: SendEmailDto) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));

    try {
      return await sgMail.send({
        templateId: this.retrieveTemplateId(emailData.type),
        to: emailData.to,
        from: emailData.from,
        subject: emailData.subject,
        dynamicTemplateData: emailData.dynamicTemplateData,
      });
    } catch (error: any) {
      if (error.response && error.response.body && error.response.body.errors) {
        throw new BadRequestException(error.response.body.errors);
      }
      throw new InternalServerErrorException(
        'Ha ocurrido un error mientras se envíaba el email',
      );
    }
  }
  private retrieveTemplateId(type: EmailType) {
    switch (type) {
      case EmailType.MARKETING_EMAIL:
        return 'd-b5ad04d3d5f34c50b3c3e09039a911ff';

      default:
        return '';
    }
  }
}
