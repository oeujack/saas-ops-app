import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organizations } from './organizations.schema';
import { users } from './users.schema';

export const SUBSCRIPTION_CATEGORIES = [
  'productivity',
  'communication',
  'design',
  'security',
  'analytics',
  'devtools',
  'hr',
  'finance',
  'sales',
  'other',
] as const;

export const SUBSCRIPTION_STATUSES = ['active', 'cancelled', 'paused', 'trial'] as const;
export const BILLING_CYCLES = ['monthly', 'annual', 'quarterly'] as const;

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  vendor: text('vendor').notNull(),
  category: text('category', { enum: SUBSCRIPTION_CATEGORIES }).notNull(),
  status: text('status', { enum: SUBSCRIPTION_STATUSES }).notNull().default('active'),
  amount: integer('amount').notNull(), // cents per billing cycle
  billingCycle: text('billing_cycle', { enum: BILLING_CYCLES }).notNull(),
  seats: integer('seats'),
  renewalDate: timestamp('renewal_date', { withTimezone: true }),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
