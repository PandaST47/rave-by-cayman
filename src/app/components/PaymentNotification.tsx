// components/PaymentNotification.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, X } from 'lucide-react';

export const PaymentNotification = () => {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | 'pending' | null>(null);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');

    if (paymentStatus) {
      if (paymentStatus === 'success') setStatus('success');
      else if (paymentStatus === 'cancelled' || paymentStatus === 'error') setStatus('error');
      else if (paymentStatus === 'pending') setStatus('pending');

      setShow(true);

      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());

      setTimeout(() => setShow(false), 5000);
    }
  }, [searchParams]);

  const config = {
    success: {
      icon: <CheckCircle size={24} />,
      title: 'Оплата успешна!',
      description: 'Средства зачислены на ваш баланс',
      gradient: 'from-emerald-500 to-emerald-600',
      color: 'emerald-400'
    },
    error: {
      icon: <XCircle size={24} />,
      title: 'Оплата отменена',
      description: 'Средства не были списаны',
      gradient: 'from-rose-500 to-rose-600',
      color: 'rose-400'
    },
    pending: {
      icon: <Clock size={24} />,
      title: 'Платеж в обработке',
      description: 'Средства будут зачислены в течение нескольких минут',
      gradient: 'from-amber-500 to-amber-600',
      color: 'amber-400'
    }
  };

  if (!show || !status) return null;

  const currentConfig = config[status];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 right-4 z-[100] max-w-md"
        >
          <div className={`bg-gray-900/95 backdrop-blur-xl p-4 rounded-xl border-2 border-${currentConfig.color} shadow-lg`}>
            <div className="flex items-start gap-3">
              <div className={`text-${currentConfig.color} flex-shrink-0`}>
                {currentConfig.icon}
              </div>

              <div className="flex-1">
                <h3 className={`font-orbitron font-bold text-${currentConfig.color} mb-1`}>
                  {currentConfig.title}
                </h3>
                <p className="font-rajdhani text-sm text-gray-300">
                  {currentConfig.description}
                </p>
              </div>

              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className={`h-1 bg-${currentConfig.color} rounded-full mt-3`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};