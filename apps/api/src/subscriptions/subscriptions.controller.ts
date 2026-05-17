import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/auth.schemas';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateSubscriptionSchema,
  ListSubscriptionsQuerySchema,
  UpdateSubscriptionSchema,
} from './subscriptions.schemas';
import type {
  CreateSubscriptionDto,
  ListSubscriptionsQuery,
  UpdateSubscriptionDto,
} from './subscriptions.schemas';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all subscriptions for the organization' })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query(new ZodValidationPipe(ListSubscriptionsQuerySchema)) query: ListSubscriptionsQuery,
  ) {
    return this.subscriptionsService.findAll(user.orgId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get subscription statistics for the organization' })
  getStats(@CurrentUser() user: JwtPayload) {
    return this.subscriptionsService.getStats(user.orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single subscription by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.subscriptionsService.findOne(id, user.orgId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(CreateSubscriptionSchema)) dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(user.orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(UpdateSubscriptionSchema)) dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, user.orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subscription' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.subscriptionsService.remove(id, user.orgId);
  }
}
