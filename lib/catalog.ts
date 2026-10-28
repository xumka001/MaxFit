// Public service identifiers are stable API keys. Prices belong on the server.
export const services = [
  { id: 'personal', title: 'Персональные тренировки' },
  { id: 'online', title: 'Онлайн-сопровождение' },
  { id: 'program', title: 'Программа тренировок' },
] as const;
export type ServiceId = typeof services[number]['id'];
export const goals = ['Стать сильнее и подтянуть форму', 'Снизить вес', 'Набрать мышечную массу', 'Вернуться к тренировкам'] as const;
