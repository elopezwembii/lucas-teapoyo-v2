import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { MailerService } from 'src/mailer/mailer.service';
import { SendEmailDto } from '../mailer/dto/send-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EmailType } from 'src/mailer/types/email.type';

@Injectable()
export class JobsService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  private async sendNotification(emailData: SendEmailDto) {
    return await this.mailerService.sendEmail(emailData);
  }

  @Cron('0 0 1 * *')
  async handleStartOfMonth() {
    const users = await this.userRepository.find();
    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject: '¡Inicio de mes! Revisa tu presupuesto.',
        to: user.email,
        type: EmailType.MARKETING_EMAIL,
      });
    });
  }

  @Cron('0 0 15 * *')
  async handleMidMonth() {
    const users = await this.userRepository.find();
    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject:
          '¡Mitad de mes! Es un buen momento para revisar tu presupuesto.',
        to: user.email,
        type: EmailType.MARKETING_EMAIL,
      });
    });
  }

  @Cron('0 0 28-31 * *')
  async handleEndOfMonth() {
    const users = await this.userRepository.find();
    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject:
          '¡Fin de mes! Asegúrate de que tu presupuesto esté actualizado.',
        to: user.email,
        type: EmailType.MARKETING_EMAIL,
      });
    });
  }

  @Interval(172800000)
  async handleEvery48Hours() {
    const users = await this.userRepository.find();
    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject: '¿Cómo va tu presupuesto? ¡No olvides revisarlo!',
        to: user.email,
        type: EmailType.MARKETING_EMAIL,
      });
    });
  }
}
