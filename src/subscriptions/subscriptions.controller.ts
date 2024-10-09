import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscribeSuccessDto } from './dto/subscribe-success-query.dto';
import { Response } from 'express';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get('subscription')
  findOne(@Query('subscriptionId') id: string) {
    return this.subscriptionsService.findOne(+id);
  }
  @Get('success')
  async subscribe(
    @Query() subscribeSuccessDto: SubscribeSuccessDto,
    @Res() res: Response,
  ) {
    const result =
      await this.subscriptionsService.subscribeSuccess(subscribeSuccessDto);
    return res.redirect(result.redirectUrl);
  }

  @Patch('subscription')
  update(
    @Query('subscriptionId') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }

  @Delete('subscription')
  remove(@Query('subscriptionId') id: string) {
    return this.subscriptionsService.remove(+id);
  }
}
