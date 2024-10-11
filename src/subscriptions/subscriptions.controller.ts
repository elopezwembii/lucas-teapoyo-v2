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
import { Protected } from 'src/auth/decorators/protected.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Protected()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @Protected()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get('subscription')
  @Protected()
  findOne(@Query('subscriptionId') id: string) {
    return this.subscriptionsService.findOne(+id);
  }
  @Get('success')
  @Protected()
  async subscribe(
    @Query() subscribeSuccessDto: SubscribeSuccessDto,
    @Res() res: Response,
  ) {
    const result =
      await this.subscriptionsService.subscribeSuccess(subscribeSuccessDto);
    return res.redirect(result.redirectUrl);
  }

  @Patch('subscription')
  @Protected()
  update(
    @Query('subscriptionId') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }

  @Delete('subscription')
  @Protected()
  remove(@Query('subscriptionId') id: string) {
    return this.subscriptionsService.remove(+id);
  }
}
