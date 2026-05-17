import { Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { subscriptions } from '../database/schema';
import type {
  CreateSubscriptionDto,
  ListSubscriptionsQuery,
  UpdateSubscriptionDto,
} from './subscriptions.schemas';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(orgId: string, query: ListSubscriptionsQuery) {
    const conditions = [eq(subscriptions.orgId, orgId)];

    if (query.status) {
      conditions.push(eq(subscriptions.status, query.status));
    }
    if (query.category) {
      conditions.push(eq(subscriptions.category, query.category));
    }

    return this.database.db
      .select()
      .from(subscriptions)
      .where(and(...conditions))
      .orderBy(desc(subscriptions.createdAt));
  }

  async getStats(orgId: string) {
    const all = await this.database.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.orgId, orgId));

    const active = all.filter((s) => s.status === 'active');
    const trial = all.filter((s) => s.status === 'trial');
    const cancelled = all.filter((s) => s.status === 'cancelled');

    const totalMonthlySpend = active.reduce((sum, s) => {
      const monthly =
        s.billingCycle === 'annual'
          ? Math.round(s.amount / 12)
          : s.billingCycle === 'quarterly'
            ? Math.round(s.amount / 3)
            : s.amount;
      return sum + monthly;
    }, 0);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const renewingSoon = all.filter(
      (s) => s.status === 'active' && s.renewalDate !== null && s.renewalDate <= thirtyDaysFromNow,
    );

    return {
      totalMonthlySpend,
      activeCount: active.length,
      trialCount: trial.length,
      cancelledCount: cancelled.length,
      renewingSoonCount: renewingSoon.length,
      renewingSoon,
    };
  }

  async findOne(id: string, orgId: string) {
    const result = await this.database.db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.orgId, orgId)))
      .limit(1);

    const sub = result.at(0);
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  async create(orgId: string, dto: CreateSubscriptionDto) {
    const [sub] = await this.database.db
      .insert(subscriptions)
      .values({
        orgId,
        ...dto,
        renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : null,
      })
      .returning();

    return sub;
  }

  async update(id: string, orgId: string, dto: UpdateSubscriptionDto) {
    await this.findOne(id, orgId);

    const [sub] = await this.database.db
      .update(subscriptions)
      .set({
        ...dto,
        renewalDate:
          dto.renewalDate !== undefined
            ? dto.renewalDate
              ? new Date(dto.renewalDate)
              : null
            : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(subscriptions.id, id), eq(subscriptions.orgId, orgId)))
      .returning();

    return sub;
  }

  async remove(id: string, orgId: string) {
    await this.findOne(id, orgId);

    await this.database.db
      .delete(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.orgId, orgId)));
  }
}
