import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { Persons } from './shared/entities/persons.entity';
import { Savings } from './shared/entities/savings.entity';
import { Answer } from './shared/entities/answers.entity';
import { Bank } from './shared/entities/bank.entity';
import { Bien } from './shared/entities/biens.entity';
import { Blog } from './shared/entities/blog.entity';
import { Blogs } from './shared/entities/blogs.entity';
import { Budget } from './shared/entities/budget.entity';
import { BudgetItem } from './shared/entities/budget-item.entity';
import { Card } from './shared/entities/card.entity';
import { CategoryBlog } from './shared/entities/category-blog.entity';
import { Child } from './shared/entities/child.entity';
import { Cupon } from './shared/entities/cupon.entity';
import { Deuda } from './shared/entities/deudas.entity';
import { Enterprise } from './shared/entities/enterprises.entity';
import { FailedJob } from './shared/entities/failed-jobs.entity';
import { IncomeType } from './shared/entities/income-type.entity';
import { Income } from './shared/entities/income.entity';
import { PasswordReset } from './shared/entities/password-resets.entity';
import { PasswordResetToken } from './shared/entities/password-reset-tokens.entity';
import { PersonalAccessToken } from './shared/entities/personal-access-tokens.entity';
import { Personality } from './shared/entities/personality.entity';
import { Plan } from './shared/entities/plan.entity';
import { Preuser } from './shared/entities/preuser.entity';
import { Question } from './shared/entities/question.entity';
import { Role } from './shared/entities/roles.entity';
import { Spend } from './shared/entities/spend.entity';
import { SpendSubtype } from './shared/entities/spend-subtype.entity';
import { SpendType } from './shared/entities/spend-type.entity';
import { Subscription } from './shared/entities/subscription.entity';
import { TipoDeuda } from './shared/entities/tipo-deuda.entity';
import { User } from './shared/entities/user.entity';
import { UserRole } from './shared/entities/user-role.entity';
import { UserTest } from './shared/entities/user-test.entity';
import { Users } from './shared/entities/users.entity';
import { Notification } from './shared/entities/notification.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.MONGODB_CONNECTION_STRING}`, {
      connectionName: 'general',
      dbName: process.env.DATABASE_NAME,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.DEV_MODE ? true : false,
      entities: [
        Savings,
        Answer,
        Bank,
        Bien,
        Blog,
        Blogs,
        Budget,
        BudgetItem,
        Card,
        CategoryBlog,
        Child,
        Cupon,
        Deuda,
        Enterprise,
        FailedJob,
        IncomeType,
        Income,
        Notification,
        PasswordResetToken,
        PersonalAccessToken,
        Personality,
        Persons,
        Plan,
        Preuser,
        Question,
        Role,
        Spend,
        SpendSubtype,
        SpendType,
        Subscription,
        TipoDeuda,
        User,
        UserRole,
        UserTest,
        Users,
      ],
    }),
    ChatbotModule,
    MailerModule,
    SharedModule,
    SubscriptionsModule,
    JobsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
