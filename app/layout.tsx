import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'MaxFit — твоя форма. Твой темп.',
  description: 'Персональные тренировки, онлайн-сопровождение и программы под твою цель.',
  icons: { icon: '/favicon.svg' },
};
export default function Layout({children}:{children:React.ReactNode}) {
  return <html lang="ru"><body>{children}</body></html>;
}
