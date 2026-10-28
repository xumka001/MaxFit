import { z } from 'zod';
export const leadSchema = z.object({
  name: z.string().trim().min(1, 'Укажи имя').max(60),
  contact: z.string().trim().min(3, 'Укажи Telegram, телефон или email').max(120),
  goal: z.enum(['Стать сильнее и подтянуть форму', 'Снизить вес', 'Набрать мышечную массу', 'Вернуться к тренировкам']),
  serviceId: z.enum(['undecided', 'personal', 'online', 'program']),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
}).strict();
export const checkoutSchema = z.object({ serviceId: z.enum(['personal', 'online', 'program']) }).strict();
export type LeadInput = z.infer<typeof leadSchema>;
