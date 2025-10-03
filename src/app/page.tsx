import Header from '@/app/components/Header';
import Hero from '@/app/components/Hero';
import CursorTrail from '@/app/components/effects/CursorTrail';
import Pricing from '@/app/components/Pricing';

/**
 * Главная страница Rave By Cayman
 * 
 * Использование:
 * 1. Разместите Header.tsx в components/layout/
 * 2. Разместите Hero.tsx в components/hero/
 * 3. Разместите CursorTrail.tsx в components/effects/
 * 4. Убедитесь, что все зависимости установлены
 * 5. Tailwind config настроен по инструкции
 */

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <CursorTrail />
      <Header />
      <Hero />
      <Pricing />
    </main>
  );
}