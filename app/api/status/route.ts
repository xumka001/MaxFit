import { getDatabase } from '@/lib/server/database';
import { json } from '@/lib/server/http';
export function GET() {
  return json({ leadsEnabled: Boolean(getDatabase()), paymentsEnabled: false });
}
