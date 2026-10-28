import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  goal: text('goal').notNull(),
  serviceId: text('service_id').notNull(),
  consentAt: text('consent_at').notNull(),
  createdAt: text('created_at').notNull(),
});
