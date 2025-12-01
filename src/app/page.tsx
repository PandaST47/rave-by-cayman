import Header from '@/app/components/Header';
import Hero from '@/app/components/Hero';
import CursorTrail from '@/app/components/effects/CursorTrail';
import Zones from '@/app/components/Zones';
import Pricing from '@/app/components/Pricing';
import Contacts from './components/Contacts';
import { PaymentNotification } from './components/PaymentNotification';

/**
 * Главная страница Rave By Cayman
 */

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <CursorTrail />
      <Header />
      <Hero />
      <Zones />
      <Pricing />
      <Contacts />
      <PaymentNotification />
    </main>
  );
}