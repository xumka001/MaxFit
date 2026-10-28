import { env } from 'cloudflare:workers';
import type { LeadInput } from '../validation';
// The only database access point. Replace this adapter to use PostgreSQL/Supabase.
export function getDatabase(): D1Database | null {
  return (env as unknown as { DB?: D1Database }).DB ?? null;
}
export async function saveLead(input: LeadInput, submissionId: string) {
  const database = getDatabase();
  if (!database) return null;
  const result = await database.prepare(
    'INSERT INTO leads (id, name, contact, goal, service_id, consent_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING'
  ).bind(submissionId, input.name, input.contact, input.goal, input.serviceId, new Date().toISOString(), new Date().toISOString()).run();
  if (!result.success) throw new Error('Lead storage failed');
  return { id: submissionId };
}
