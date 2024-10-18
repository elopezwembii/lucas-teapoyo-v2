import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { MailerService } from 'src/mailer/mailer.service';
import { SendEmailDto } from '../mailer/dto/send-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EmailType } from 'src/mailer/types/email.type';
import { Budget } from 'src/shared/entities/budget.entity';
import { BudgetItem } from 'src/shared/entities/budget-item.entity';
import { Income } from 'src/shared/entities/income.entity';
import { PaymentNotificationsService } from '../payment-notifications/payment-notifications.service';

@Injectable()
export class JobsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private budgetItemRepository: Repository<BudgetItem>,
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
    private readonly paymentNotificationsService: PaymentNotificationsService,
  ) {}
  private async sendNotification(emailData: SendEmailDto) {
    return await this.mailerService.sendEmail(emailData);
  }

  @Cron('0 0 1 * *')
  async handleStartOfMonth() {
    const now = new Date();
    const users = await this.userRepository.find();
    const monthlyBudget = await this.budgetRepository.findOne({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const incomes = await this.incomeRepository.find({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const budgetTotalAmount = incomes.reduce(
      (acc, acum) => acc + acum.montoReal,
      0,
    );
    const budgetItems = await this.budgetItemRepository.find({
      where: {
        idPresupuesto: monthlyBudget.id,
      },
    });

    const budgetTotalSpends = budgetItems.reduce(
      (acc, acum) => acc + acum.monto,
      0,
    );
    const budgetRemaining = budgetTotalAmount - budgetTotalSpends;
    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject: '¡Inicio de mes! Revisa tu presupuesto.',
        to: user.email,
        type: EmailType.REMINDER_BUDGET_EMAIL,
        dynamicTemplateData: {
          clientName: user.nombres,
          month: now.getMonth(),
          year: now.getFullYear(),
          budgetTotalAmount,
          budgetTotalSpends,
          budgetRemaining,
        },
      });
    });
  }

  @Cron('0 0 15 * *')
  async handleMidMonth() {
    const now = new Date();
    const users = await this.userRepository.find();
    const monthlyBudget = await this.budgetRepository.findOne({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const incomes = await this.incomeRepository.find({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const budgetTotalAmount = incomes.reduce(
      (acc, acum) => acc + acum.montoReal,
      0,
    );
    const budgetItems = await this.budgetItemRepository.find({
      where: {
        idPresupuesto: monthlyBudget.id,
      },
    });

    const budgetTotalSpends = budgetItems.reduce(
      (acc, acum) => acc + acum.monto,
      0,
    );
    const budgetRemaining = budgetTotalAmount - budgetTotalSpends;

    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject:
          '¡Mitad de mes! Es un buen momento para revisar tu presupuesto.',
        to: user.email,
        type: EmailType.REMINDER_BUDGET_EMAIL,
        dynamicTemplateData: {
          clientName: user.nombres,
          month: now.getMonth(),
          year: now.getFullYear(),
          budgetTotalAmount,
          budgetTotalSpends,
          budgetRemaining,
        },
      });
    });
  }

  @Cron('0 0 28-31 * *')
  async handleEndOfMonth() {
    const now = new Date();
    const users = await this.userRepository.find();
    const monthlyBudget = await this.budgetRepository.findOne({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const incomes = await this.incomeRepository.find({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const budgetTotalAmount = incomes.reduce(
      (acc, acum) => acc + acum.montoReal,
      0,
    );
    const budgetItems = await this.budgetItemRepository.find({
      where: {
        idPresupuesto: monthlyBudget.id,
      },
    });

    const budgetTotalSpends = budgetItems.reduce(
      (acc, acum) => acc + acum.monto,
      0,
    );
    const budgetRemaining = budgetTotalAmount - budgetTotalSpends;

    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject:
          '¡Fin de mes! Asegúrate de que tu presupuesto esté actualizado.',
        to: user.email,
        type: EmailType.REMINDER_BUDGET_EMAIL,
        dynamicTemplateData: {
          clientName: user.nombres,
          month: now.getMonth(),
          year: now.getFullYear(),
          budgetTotalAmount,
          budgetTotalSpends,
          budgetRemaining,
        },
      });
    });
  }

  @Interval(172800000)
  async handleEvery48Hours() {
    const now = new Date();
    const users = await this.userRepository.find();
    const monthlyBudget = await this.budgetRepository.findOne({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const incomes = await this.incomeRepository.find({
      where: {
        anio: now.getFullYear(),
        mes: now.getMonth(),
      },
    });
    const budgetTotalAmount = incomes.reduce(
      (acc, acum) => acc + acum.montoReal,
      0,
    );
    const budgetItems = await this.budgetItemRepository.find({
      where: {
        idPresupuesto: monthlyBudget.id,
      },
    });

    const budgetTotalSpends = budgetItems.reduce(
      (acc, acum) => acc + acum.monto,
      0,
    );
    const budgetRemaining = budgetTotalAmount - budgetTotalSpends;

    return users.map(async (user) => {
      return await this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject: '¿Cómo va tu presupuesto? ¡No olvides revisarlo!',
        to: user.email,
        type: EmailType.REMINDER_BUDGET_EMAIL,
        dynamicTemplateData: {
          clientName: user.nombres,
          month: now.getMonth(),
          year: now.getFullYear(),
          budgetTotalAmount,
          budgetTotalSpends,
          budgetRemaining,
        },
      });
    });
  }
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendPaymentNotifications() {
    const date = new Date();
    const paymentNotifications =
      await this.paymentNotificationsService.findAll();

    for (const paymentNotification of paymentNotifications) {
      const budgetItem = await this.budgetItemRepository.findOne({
        where: { id: paymentNotification.recurrentItemId },
      });
      const user = await this.userRepository.findOne({
        where: { id: paymentNotification.userId },
      });

      this.sendNotification({
        from: this.configService.get('ROOT_EMAIL_DOMAIN'),
        subject: '¡Es hora de pagar las cuentas!',
        to: user.email,
        type: EmailType.PAYMENT_NOTIFICATION_EMAIL,
        dynamicTemplateData: {
          clientName: user.nombres,
          month: date.getMonth(),
          year: date.getFullYear(),
          paymentAmount: budgetItem.monto,
        },
      });
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async checkBudgets() {
    const now = new Date();
    const budgets = await this.budgetRepository.find();
    const notifications = [];
    for (const budget of budgets) {
      const budgetItems = await this.budgetItemRepository.find({
        where: { presupuesto: budget },
      });

      const totalItems = budgetItems.reduce((acc, curr) => acc + curr.monto, 0);

      const income = await this.incomeRepository.findOne({
        where: { usuario: budget.usuario },
      });

      const currentPercent =
        totalItems > 0 ? (income.montoReal / totalItems) * 100 : 0;

      if (currentPercent >= 50 && currentPercent < 80) {
        notifications.push(
          this.sendNotification({
            from: this.configService.get('ROOT_EMAIL_DOMAIN'),
            subject: '¡Estás llegando al 50% de tu presupuesto!',
            to: budget.usuario.email,
            type: EmailType.BUDGET_EMAIL,
            dynamicTemplateData: {
              clientName: budget.usuario.nombres,
              month: now.getMonth(),
              year: now.getFullYear(),
              isFiftyPercentUsed: true,
              isEightyPercentUsed: false,
            },
          }),
        );
      } else if (currentPercent >= 80) {
        notifications.push(
          this.sendNotification({
            from: this.configService.get('ROOT_EMAIL_DOMAIN'),
            subject: '¡Estás llegando al 80% de tu presupuesto!',
            to: budget.usuario.email,
            type: EmailType.BUDGET_EMAIL,
            dynamicTemplateData: {
              clientName: budget.usuario.nombres,
              month: now.getMonth(),
              year: now.getFullYear(),
              isFiftyPercentUsed: false,
              isEightyPercentUsed: true,
            },
          }),
        );
      }
    }

    await Promise.all(notifications);
  }
}
