import { leadSchema } from '@/lib/validation';
import { saveLead } from '@/lib/server/database';
import { json, readJson, rejectCrossOrigin, submissionKey } from '@/lib/server/http';
export async function POST(request: Request) {
  if (rejectCrossOrigin(request)) return json({ error: 'Недопустимый источник запроса.' }, 403);
  const key = submissionKey(request);
  if (!key) return json({ error: 'Неверный идентификатор заявки.' }, 400);
  let body: unknown;
  try { body = await readJson(request); } catch { return json({ error: 'Неверный формат запроса.' }, 400); }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return json({ error: 'Проверь данные формы.' }, 400);
  try {
    const lead = await saveLead(parsed.data, key);
    if (!lead) return json({ error: 'Запись пока не подключена. Попробуй позже.' }, 503);
    return json({ id: lead.id }, 201);
  } catch {
    return json({ error: 'Не удалось сохранить заявку. Попробуй ещё раз.' }, 503);
  }
}
