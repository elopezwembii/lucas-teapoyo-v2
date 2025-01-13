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

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleStartOfMonth() {
    const now = new Date();
    const currentDay = now.getDay();
    //Set at three days to notify in the month
    if (currentDay === 1 && currentDay < 5) {
      let budgetItems = null;
      let budgetTotalSpends = 0;
      let budgetTotalAmount = 0;
      const users = await this.userRepository.find();
      const monthlyBudget = await this.budgetRepository.findOne({
        where: {
          anio: now.getFullYear(),
          mes: now.getMonth(),
        },
      });
      if (monthlyBudget !== null) {
        budgetItems = await this.budgetItemRepository.find({
          where: {
            idPresupuesto: monthlyBudget.id,
          },
        });
        budgetTotalSpends = budgetItems.reduce(
          (acc, acum) => acc + acum.monto,
          0,
        );
      }

      const incomes = await this.incomeRepository.find({
        where: {
          anio: now.getFullYear(),
          mes: now.getMonth(),
        },
      });
      budgetTotalAmount = incomes.reduce(
        (acc, acum) => acc + acum.montoReal,
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
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleMidMonth() {
    const now = new Date();
    const currentDay = now.getDay();
    //Set at three days to notify in the month
    if (currentDay == 15 && currentDay < 18) {
      const users = await this.userRepository.find();
      let budgetRemaining = 0;
      let budgetTotalAmount = 0;
      let budgetTotalSpends = null;
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
      if (monthlyBudget !== null) {
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
        budgetRemaining = budgetTotalAmount - budgetTotalSpends;
      }
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
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleEndOfMonth() {
    const now = new Date();
    const currentDay = now.getDay();
    //Set at three days to notify in the month

    if (currentDay === 28 && currentDay <= 31) {
      let budgetRemaining = 0;
      let budgetTotalAmount = 0;
      let budgetTotalSpends = null;
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
      if (monthlyBudget !== null) {
        budgetTotalAmount = incomes.reduce(
          (acc, acum) => acc + acum.montoReal,
          0,
        );
        const budgetItems = await this.budgetItemRepository.find({
          where: {
            idPresupuesto: monthlyBudget.id,
          },
        });

        budgetTotalSpends = budgetItems.reduce(
          (acc, acum) => acc + acum.monto,
          0,
        );
        budgetRemaining = budgetTotalAmount - budgetTotalSpends;
      }
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
  }

  @Interval(48 * 60 * 60 * 1000)
  async handleEvery48Hours() {
    const now = new Date();
    const users = await this.userRepository.find();
    let budgetRemaining = 0;
    let budgetTotalAmount = 0;
    let budgetTotalSpends = null;
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
    if (monthlyBudget !== null) {
      budgetTotalAmount = incomes.reduce(
        (acc, acum) => acc + acum.montoReal,
        0,
      );
      const budgetItems = await this.budgetItemRepository.find({
        where: {
          idPresupuesto: monthlyBudget.id,
        },
      });

      budgetTotalSpends = budgetItems.reduce(
        (acc, acum) => acc + acum.monto,
        0,
      );
      budgetRemaining = budgetTotalAmount - budgetTotalSpends;
    }
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
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async checkBudgets() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const budgets = await this.budgetRepository.find();
    const notifications = [];
    if (budgets.length)
      for (const budget of budgets) {
        const budgetItems = await this.budgetItemRepository.find({
          where: { presupuesto: budget },
        });

        const totalItemsAmount = budgetItems.reduce(
          (acc, curr) => acc + curr.monto,
          0,
        );

        const incomes = await this.incomeRepository.findBy({
          usuario: budget.usuario,
        });
        const incomesAmount = incomes.reduce(
          (acc, curr) => acc + curr.montoReal,
          0,
        );
        const user = await this.userRepository.findOne({
          where: { id: budget.usuario },
        });

        let currentPercent = 100;
        if (incomesAmount > 0 && totalItemsAmount > 0) {
          currentPercent = (totalItemsAmount / incomesAmount) * 100;
        }
        if (incomesAmount > 0 && totalItemsAmount <= 0) {
          currentPercent = 100;
        }
        if (incomesAmount <= 0 && totalItemsAmount <= 0) {
          currentPercent = 0;
        }

        if (
          Number(currentPercent.toFixed(2)) >= 50 &&
          Number(currentPercent.toFixed(2)) < 80
        ) {
          notifications.push(
            this.sendNotification({
              from: this.configService.get('ROOT_EMAIL_DOMAIN'),
              subject: '¡Estás llegando al 50% de tu presupuesto!',
              to: user.email,
              type: EmailType.BUDGET_EMAIL,
              dynamicTemplateData: {
                clientName: user.nombres,
                month: currentMonth,
                year: currentYear,
                isFiftyPercentUsed: true,
                isEightyPercentUsed: false,
              },
            }),
          );
        } else if (Number(currentPercent.toFixed(2)) >= 80) {
          notifications.push(
            this.sendNotification({
              from: this.configService.get('ROOT_EMAIL_DOMAIN'),
              subject: '¡Estás llegando al 80% de tu presupuesto!',
              to: user.email,
              type: EmailType.BUDGET_EMAIL,
              dynamicTemplateData: {
                clientName: user.nombres,
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
