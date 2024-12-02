import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { MercadoPagoConfig, PreApprovalPlan } from 'mercadopago';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from 'src/shared/entities/plan.entity';
import { Currency } from './types/currency.type';
import { User } from 'src/shared/entities/user.entity';
import { SubscribeSuccessDto } from './dto/subscribe-success-query.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyPlan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class SubscriptionsService {
  client: MercadoPagoConfig;
  subscription: PreApprovalPlan;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Plan)
    private repository: Repository<Plan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectModel(MyPlan.name, 'general')
    private readonly myPlanModel: Model<MyPlan>,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.configService.get('MERCADO_PAGO_ACCESS_TOKEN'),
    });
    this.subscription = new PreApprovalPlan(this.client);
  }
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await this.subscription.create({
        body: {
          reason: createSubscriptionDto.reason,
          auto_recurring: {
            ...createSubscriptionDto.auto_recurring,
            billing_day_proportional: false,
            currency_id: Currency.CLP,
          },

          back_url: this.configService.get('MERCADO_PAGO_BACK_URL'),
        },
      });
      return await this.repository.save({
        uid: subscription.id,
        frequency: subscription.auto_recurring.frequency,
        frequency_type: subscription.auto_recurring.frequency_type,
        repetitions: subscription.auto_recurring.repetitions,
        billing_day: subscription.auto_recurring.billing_day,
        billing_day_proportional:
          subscription.auto_recurring.billing_day_proportional,
        frequency_free: subscription.auto_recurring.free_trial.frequency,
        frequency_type_free:
          subscription.auto_recurring.free_trial.frequency_type,
        first_invoice_offset:
          subscription.auto_recurring.free_trial.first_invoice_offset,
        transaction_amount: subscription.auto_recurring.transaction_amount,
        currency_id: subscription.auto_recurring.currency_id,
        cupon: createSubscriptionDto.coupon,
        percentage: createSubscriptionDto.percentage,
        state_cupon: createSubscriptionDto.state_cupon,
        reason: createSubscriptionDto.reason,
        empresa_id: createSubscriptionDto.enterpriseId,
        tipo: createSubscriptionDto.type,
        promo: createSubscriptionDto.promo,
        status: createSubscriptionDto.status,
      });
    } catch (error) {
      if (error.status == 400) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }
  async subscribeSuccess(subscribeSuccessDto: SubscribeSuccessDto) {
    const userUpdated = await this.userRepository.update(
      subscribeSuccessDto.id,
      {
        suscripcion_fin: subscribeSuccessDto.endDate,
        suscripcion_inicio: subscribeSuccessDto.startDate,
        subscripcion_nombre: subscribeSuccessDto.reason,
      },
    );
    if (userUpdated.affected == 1) {
      return {
        redirectUrl: this.configService.get('SUBSCRIPTION_SUCCESS_URL'),
      };
    }
    const planExists = await this.myPlanModel.findOne({
      userId: subscribeSuccessDto.id,
    });
    if (planExists) {
      await this.myPlanModel.updateOne({
        startDate: subscribeSuccessDto.startDate,
        endDate: subscribeSuccessDto.endDate,
        reason: subscribeSuccessDto.reason,
      });
      return {
        redirectUrl: this.configService.get('SUBSCRIPTION_SUCCESS_URL'),
      };
    } else {
      await this.myPlanModel.create({
        startDate: subscribeSuccessDto.startDate,
        endDate: subscribeSuccessDto.endDate,
        reason: subscribeSuccessDto.reason,
      });
      return {
        redirectUrl: this.configService.get('SUBSCRIPTION_SUCCESS_URL'),
      };
    }
  }
  async findAll() {
    return await this.repository.find();
  }
  async findMyPlan(userId: string) {
    return await this.myPlanModel.findOne({
      userId,
    });
  }
  async createPlan(createPlanDto: CreatePlanDto) {
    const date = new Date();
    const monthly = date.setDate(date.getDate() + 30);
    return await this.myPlanModel.create({
      userId: createPlanDto.userId,
      startDate: date.toISOString(),
      endDate: monthly,
      reason: createPlanDto.reason,
    });
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('Id es requerido.');
    const subscriptionExists = await this.repository.findOne({ where: { id } });
    if (!subscriptionExists) {
      throw new NotFoundException('La subscripción no existe.');
    }
    return subscriptionExists;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    if (!id) throw new BadRequestException('Id es requerido.');
    if (!Object.keys(updateSubscriptionDto).length) {
      throw new BadRequestException(
        'Debes aportar al menos un campo editable.',
      );
    }
    const subscriptionExists = await this.findOne(id);
    if (!subscriptionExists) {
      throw new NotFoundException('La subscripción no existe.');
    }
    try {
      const updated = await this.repository.update(id, {
        frequency: updateSubscriptionDto.auto_recurring.frequency,
        frequency_type: updateSubscriptionDto.auto_recurring.frequency_type,
        repetitions: updateSubscriptionDto.auto_recurring.repetitions,
        billing_day: updateSubscriptionDto.auto_recurring.billing_day,
        billing_day_proportional: false,
        frequency_free:
          updateSubscriptionDto.auto_recurring.free_trial.frequency,
        frequency_type_free:
          updateSubscriptionDto.auto_recurring.free_trial.frequency_type,
        first_invoice_offset:
          updateSubscriptionDto.auto_recurring.free_trial.first_invoice_offset,
        transaction_amount:
          updateSubscriptionDto.auto_recurring.transaction_amount,
        currency_id: Currency.CLP,
        cupon: updateSubscriptionDto.coupon,
        percentage: updateSubscriptionDto.percentage,
        state_cupon: updateSubscriptionDto.state_cupon,
        reason: updateSubscriptionDto.reason,
        empresa_id: updateSubscriptionDto.enterpriseId,
        tipo: updateSubscriptionDto.type,
        promo: updateSubscriptionDto.promo,
        status: updateSubscriptionDto.status,
      });
      if (updated.affected) return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('Id es requerido.');
    const subscriptionExists = await this.findOne(id);
    if (!subscriptionExists) {
      throw new NotFoundException('La subscripción no existe.');
    }
    const result = await this.repository.delete(id);
    if (result.affected == 1) return { success: true };
  }
}
