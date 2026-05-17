import { z } from 'zod';
import {
  BILLING_CYCLES,
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_STATUSES,
} from '../database/schema/subscriptions.schema';

export const CreateSubscriptionSchema = z.object({
  name: z.string().min(1).max(100),
  vendor: z.string().min(1).max(100),
  category: z.enum(SUBSCRIPTION_CATEGORIES),
  status: z.enum(SUBSCRIPTION_STATUSES).default('active'),
  amount: z.number().int().min(0),
  billingCycle: z.enum(BILLING_CYCLES),
  seats: z.number().int().min(1).optional(),
  renewalDate: z.string().datetime({ offset: true }).optional(),
  notes: z.string().max(1000).optional(),
  ownerId: z.string().uuid().optional(),
});

export const UpdateSubscriptionSchema = CreateSubscriptionSchema.partial();

export const ListSubscriptionsQuerySchema = z.object({
  status: z.enum(SUBSCRIPTION_STATUSES).optional(),
  category: z.enum(SUBSCRIPTION_CATEGORIES).optional(),
});

export type CreateSubscriptionDto = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionDto = z.infer<typeof UpdateSubscriptionSchema>;
export type ListSubscriptionsQuery = z.infer<typeof ListSubscriptionsQuerySchema>;
