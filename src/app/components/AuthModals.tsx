// components/AuthModals.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    type: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSubmit, type }) => {
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (type === 'login') {
                await onSubmit({ login: formData.login, password: formData.password });
            } else {
                await onSubmit(formData);
            }
            onClose();
            setFormData({ login: '', email: '', password: '' });
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
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
                                        {type === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
                                        {type === 'login' ? 'Вход' : 'Регистрация'}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <X className="text-gray-400 hover:text-white" size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                                    >
                                        <p className="text-red-400 text-sm font-rajdhani">{error}</p>
                                    </motion.div>
                                )}

                                {/* Login Field */}
                                <div>
                                    <label className="block text-sm font-rajdhani text-gray-300 mb-2">
                                        Логин
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                                        <input
                                            type="text"
                                            value={formData.login}
                                            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors font-rajdhani"
                                            placeholder="Введите логин"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Email Field (только для регистрации) */}
                                {type === 'register' && (
                                    <div>
                                        <label className="block text-sm font-rajdhani text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors font-rajdhani"
                                                placeholder="Введите email"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-rajdhani text-gray-300 mb-2">
                                        Пароль
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors font-rajdhani"
                                            placeholder="Введите пароль"
                                            required
                                            minLength={8}
                                            disabled={loading}
                                        />
                                    </div>
                                    {type === 'register' && (
                                        <p className="text-xs text-gray-500 mt-1 font-rajdhani">
                                            Минимум 8 символов
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className="w-full py-3 font-rajdhani font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Загрузка...' : type === 'login' ? 'Войти' : 'Зарегистрироваться'}
                                </motion.button>
                            </form>

                            {/* Footer */}
                            <div className="p-6 pt-0 space-y-3">
                                {type === 'login' && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            // Открыть модальное окно восстановления пароля
                                            setTimeout(() => {
                                                const event = new CustomEvent('openForgotPassword');
                                                window.dispatchEvent(event);
                                            }, 100);
                                        }}
                                        className="text-center w-full text-sm text-gray-400 hover:text-cyan-400 font-rajdhani transition-colors"
                                    >
                                        Забыли пароль?
                                    </button>
                                )}

                                <p className="text-center text-sm text-gray-400 font-rajdhani">
                                    {type === 'login' ? (
                                        <>
                                            Нет аккаунта?{' '}
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    setTimeout(() => {
                                                        const event = new CustomEvent('openRegister');
                                                        window.dispatchEvent(event);
                                                    }, 100);
                                                }}
                                                className="text-cyan-400 hover:text-cyan-300 font-bold"
                                            >
                                                Зарегистрируйтесь
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Уже есть аккаунт?{' '}
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    setTimeout(() => {
                                                        const event = new CustomEvent('openLogin');
                                                        window.dispatchEvent(event);
                                                    }, 100);
                                                }}
                                                className="text-cyan-400 hover:text-cyan-300 font-bold"
                                            >
                                                Войдите
                                            </button>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};