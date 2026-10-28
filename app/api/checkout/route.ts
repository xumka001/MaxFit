import { checkoutSchema } from '@/lib/validation';
import { getPaymentProvider } from '@/lib/server/payments';
import { json, readJson, rejectCrossOrigin, submissionKey } from '@/lib/server/http';
export async function POST(request: Request) {
  if (rejectCrossOrigin(request)) return json({ error: 'Недопустимый источник запроса.' }, 403);
  const key = submissionKey(request);
  if (!key) return json({ error: 'Неверный идентификатор операции.' }, 400);
  let body: unknown;
  try { body = await readJson(request); } catch { return json({ error: 'Неверный формат запроса.' }, 400); }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return json({ error: 'Выбери доступную услугу.' }, 400);
  const provider = getPaymentProvider();
  if (!provider) return json({ error: 'Онлайн-оплата пока не подключена.' }, 503);
  try {
    const session = await provider.createCheckout(parsed.data.serviceId, key);
    if (new URL(session.url).protocol !== 'https:') throw new Error('Invalid checkout URL');
    return json(session);
  } catch { return json({ error: 'Не удалось открыть оплату.' }, 502); }
}
