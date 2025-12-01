// components/ForgotPasswordModal.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, Check, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.requestPasswordReset(email);
      
      // В development режиме получаем токен сразу
      if (response.token && process.env.NODE_ENV === 'development') {
        setToken(response.token);
        setStep('reset');
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setStep('email');
          setEmail('');
          setSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setLoading(true);

    try {
      await apiClient.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setStep('email');
        setEmail('');
        setToken('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.3)] overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-cyan-400/20">
                <div className="flex items-center justify-between">
                  <h2 className="font-orbitron text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Key size={24} />
                    Восстановление пароля
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="text-gray-400 hover:text-white" size={24} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3"
                  >
                    <Check className="text-emerald-400" size={20} />
                    <p className="text-emerald-400 text-sm font-rajdhani">
                      {step === 'email'
                        ? 'Инструкции отправлены на email'
                        : 'Пароль успешно изменен!'}
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle className="text-rose-400" size={20} />
                    <p className="text-rose-400 text-sm font-rajdhani">{error}</p>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {step === 'email' ? (
                    <motion.form
                      key="email-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleRequestReset}
                      className="space-y-4"
                    >
                      <p className="text-gray-400 text-sm font-rajdhani mb-4">
                        Введите email, использованный при регистрации. Мы отправим инструкции по восстановлению пароля.
                      </p>

                      <div>
                        <label className="block text-sm font-rajdhani text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors font-rajdhani"
                            placeholder="your@email.com"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full py-3 font-rajdhani font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Отправка...
                          </>
                        ) : (
                          'Отправить инструкции'
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="reset-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleResetPassword}
                      className="space-y-4"
                    >
                      <p className="text-gray-400 text-sm font-rajdhani mb-4">
                        Введите новый пароль для вашего аккаунта.
                      </p>

                      {process.env.NODE_ENV === 'development' && (
                        <div>
                          <label className="block text-sm font-rajdhani text-gray-300 mb-2">
                            Токен (Dev mode)
                          </label>
                          <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none font-rajdhani text-sm"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-rajdhani text-gray-300 mb-2">
                          Новый пароль
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors font-rajdhani"
                            placeholder="Минимум 8 символов"
                            required
                            minLength={8}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-rajdhani text-gray-300 mb-2">
                          Подтвердите пароль
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors font-rajdhani"
                            placeholder="Повторите пароль"
                            required
                            minLength={8}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full py-3 font-rajdhani font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Изменение...
                          </>
                        ) : (
                          'Изменить пароль'
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};