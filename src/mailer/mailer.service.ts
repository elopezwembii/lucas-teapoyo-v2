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
        templateId: this.parseEmailType(emailData.type),
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
  private parseEmailType(emailType: string) {
    if (emailType === 'marketingEmail')
      return 'd-c0f62d6234d94977aee21e20481bcc3d';
    if (emailType === 'budgetEmail')
      return 'd-f473bcf2380d4f2ebdc789d4632ac211';
    if (emailType === 'reminderBudgetEmail')
      return EmailType.REMINDER_BUDGET_EMAIL;
    if (emailType === 'paymentNotificationEmail')
      return 'd-c4dbee00cbf74ec8a82f36b1fb064930';
  }
  private retrieveTemplateId(type: EmailType) {
    switch (type) {
      case EmailType.REMINDER_BUDGET_EMAIL:
        return 'd-f473bcf2380d4f2ebdc789d4632ac211';
      case EmailType.BUDGET_EMAIL:
        return 'd-c0f62d6234d94977aee21e20481bcc3d';
      case EmailType.PAYMENT_NOTIFICATION_EMAIL:
        return 'd-c4dbee00cbf74ec8a82f36b1fb064930';
      default:
        return 'Lost';
    }
  }
}
