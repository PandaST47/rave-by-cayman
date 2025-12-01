'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Проверка платежа...');

  useEffect(() => {
    const checkPayment = async () => {
      try {
        // ИСПРАВЛЕНО: ЮКасса не возвращает paymentId в URL автоматически
        // Нам нужно получить список последних платежей пользователя
        // и проверить статус последнего pending платежа
        
        const response = await fetch('/api/payment/check-latest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data = await response.json();

        if (data.status === 'success') {
          setStatus('success');
          setMessage('Платёж успешно обработан!');
          setTimeout(() => router.push('/?payment=success'), 2000);
        } else if (data.status === 'cancelled') {
          setStatus('error');
          setMessage('Платёж отменён');
          setTimeout(() => router.push('/?payment=cancelled'), 2000);
        } else if (data.status === 'pending') {
          // Продолжаем проверку
          setMessage('Обработка платежа...');
          setTimeout(checkPayment, 2000);
        } else {
          setStatus('error');
          setMessage('Не удалось определить статус платежа');
          setTimeout(() => router.push('/?payment=error'), 2000);
        }

      } catch (error) {
        console.error('Payment check error:', error);
        setStatus('error');
        setMessage('Ошибка проверки платежа');
        setTimeout(() => router.push('/?payment=error'), 2000);
      }
    };

    checkPayment();
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full glass p-8 rounded-2xl border-2 border-cyan-400/30 text-center"
      >
        {status === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">
              Обработка платежа
            </h2>
            <p className="font-rajdhani text-gray-400">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="font-orbitron text-2xl font-bold text-emerald-400 mb-2">
              Успешно!
            </h2>
            <p className="font-rajdhani text-gray-400">
              {message}
            </p>
            <p className="font-rajdhani text-sm text-gray-500 mt-2">
              Перенаправление...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <XCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="font-orbitron text-2xl font-bold text-rose-400 mb-2">
              Ошибка
            </h2>
            <p className="font-rajdhani text-gray-400">
              {message}
            </p>
            <p className="font-rajdhani text-sm text-gray-500 mt-2">
              Перенаправление...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}