'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Wallet,
  Clock,
  CreditCard,
  History,
  Lock,
  X,
  Check,
  AlertCircle,
  Loader2,
  LogOut,
  RefreshCw,
  TrendingUp,
  Trophy
} from 'lucide-react';

interface UserProfile {
  id: string;
  login: string;
  email: string;
  balance: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface Booking {
  id: string;
  zone: {
    name: string;
    type: string;
  };
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  status: string;
}

interface Stats {
  totalBookings: number;
  totalHours: number;
  totalSpent: number;
  favoriteZone: string;
  averageSession: number;
}

type Tab = 'balance' | 'bookings' | 'settings';

const Profile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('balance');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalHours: 0,
    totalSpent: 0,
    favoriteZone: 'Нет данных',
    averageSession: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/user/stats', {
        credentials: 'include'
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadProfile();
    loadTransactions();
    loadBookings();
    loadStats();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', { credentials: 'include' });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch('/api/user/balance', { credentials: 'include' });
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await fetch('/api/bookings', { credentials: 'include' });
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const refreshBalance = async () => {
    setRefreshing(true);
    await loadProfile();
    await loadTransactions();
    setRefreshing(false);
  };

  const handleTopUp = async () => {
    if (topUpAmount < 100) {
      alert('Минимальная сумма пополнения 100₽');
      return;
    }

    setTopUpLoading(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: topUpAmount })
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Ошибка создания платежа');
      }
    } catch (error: any) {
      alert(error.message || 'Ошибка пополнения');
      setTopUpLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Отменить бронирование? Средства будут возвращены согласно политике возврата.')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        alert(`Бронирование отменено. Возврат: ${data.refundAmount}₽ (${data.refundPercent}%)`);
        loadBookings();
        loadProfile();
      } else {
        alert(data.error);
      }
    } catch (error: any) {
      alert(error.message || 'Ошибка отмены');
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Пароль должен содержать минимум 8 символов');
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setPasswordError(error.message || 'Ошибка смены пароля');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Loader2 className="text-cyan-400 animate-spin" size={48} />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'balance', label: 'Баланс', icon: Wallet },
    { id: 'bookings', label: 'Бронирования', icon: Clock },
    { id: 'settings', label: 'Настройки', icon: Lock }
  ];

  const quickAmounts = [500, 1000, 2000, 5000];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-400/30';
      case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-400/30';
      case 'cancelled': return 'text-rose-400 bg-rose-500/10 border-rose-400/30';
      case 'active': return 'text-cyan-400 bg-cyan-500/10 border-cyan-400/30';
      case 'completed': return 'text-gray-400 bg-gray-500/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-400/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Успешно';
      case 'pending': return 'Ожидание';
      case 'cancelled': return 'Отменено';
      case 'active': return 'Активно';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.3)] overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors z-10"
          >
            <X className="text-gray-400 hover:text-white" size={24} />
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="font-orbitron text-2xl font-bold text-white">
                  {user.login}
                </h2>
                <p className="text-gray-400 font-rajdhani">{user.email}</p>
              </div>
            </div>

            {/* Balance & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30">
                <Wallet className="text-cyan-400" size={24} />
                <div>
                  <p className="text-xs text-gray-400 font-rajdhani uppercase">Баланс</p>
                  <p className="text-2xl font-orbitron font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {user.balance}₽
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshBalance}
                  disabled={refreshing}
                  className="p-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-500/20 border-2 border-rose-400/50 rounded-lg text-rose-400 font-rajdhani font-bold hover:bg-rose-500/30 transition-all flex items-center gap-2"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Выход</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-cyan-400" />
                <p className="text-xs text-gray-400 font-rajdhani">Бронирований</p>
              </div>
              <p className="text-xl font-orbitron font-bold text-white">{stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-blue-400" />
                <p className="text-xs text-gray-400 font-rajdhani">Часов сыграно</p>
              </div>
              <p className="text-xl font-orbitron font-bold text-white">{stats.totalHours}</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={16} className="text-emerald-400" />
                <p className="text-xs text-gray-400 font-rajdhani">Потрачено</p>
              </div>
              <p className="text-xl font-orbitron font-bold text-white">{stats.totalSpent}₽</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={16} className="text-amber-400" />
                <p className="text-xs text-gray-400 font-rajdhani">Любимая зона</p>
              </div>
              <p className="text-sm font-rajdhani font-bold text-white truncate">{stats.favoriteZone}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 px-6 py-4 font-rajdhani font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 border-b-2 border-cyan-400 text-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon size={20} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-400px)]">
          <AnimatePresence mode="wait">
            {/* Баланс */}
            {activeTab === 'balance' && (
              <motion.div
                key="balance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Пополнение */}
                <div className="mb-6 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-400/20">
                  <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CreditCard size={24} className="text-cyan-400" />
                    Пополнить баланс
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTopUpAmount(amount)}
                        className={`py-3 rounded-lg font-rajdhani font-bold transition-all ${
                          topUpAmount === amount
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {amount}₽
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    min={100}
                    max={100000}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-rajdhani text-lg mb-4 focus:border-cyan-400 focus:outline-none"
                    placeholder="Введите сумму"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTopUp}
                    disabled={topUpLoading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-rajdhani font-bold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {topUpLoading ? (
                      <Loader2 className="animate-spin mx-auto" size={24} />
                    ) : (
                      `Пополнить на ${topUpAmount}₽`
                    )}
                  </motion.button>
                </div>

                {/* История транзакций */}
                <h3 className="font-orbitron text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <History size={20} className="text-cyan-400" />
                  История пополнений
                </h3>

                <div className="space-y-3">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white font-rajdhani font-bold">
                            +{tx.amount}₽
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(tx.createdAt).toLocaleString('ru')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(tx.status)}`}>
                          {getStatusLabel(tx.status)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-8 font-rajdhani">
                      История пополнений пуста
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Бронирования */}
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="space-y-4">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-orbitron font-bold text-white">
                            {booking.zone.name}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm font-rajdhani">
                          <div>
                            <p className="text-gray-400">Начало</p>
                            <p className="text-white">
                              {new Date(booking.startTime).toLocaleString('ru')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Конец</p>
                            <p className="text-white">
                              {new Date(booking.endTime).toLocaleString('ru')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Часов</p>
                            <p className="text-white">{booking.hours}ч</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Стоимость</p>
                            <p className="text-cyan-400 font-bold">
                              {booking.totalPrice}₽
                            </p>
                          </div>
                        </div>
                        {booking.status === 'active' && new Date(booking.startTime) > new Date() && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCancelBooking(booking.id)}
                            className="mt-3 w-full py-2 bg-rose-500/20 border border-rose-400/50 rounded-lg text-rose-400 font-rajdhani font-bold hover:bg-rose-500/30 transition-all"
                          >
                            Отменить бронирование
                          </motion.button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-8 font-rajdhani">
                      У вас пока нет бронирований
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Настройки */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="space-y-4">
                  <h3 className="font-orbitron text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-cyan-400" />
                    Сменить пароль
                  </h3>

                  {passwordError && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-3">
                      <AlertCircle className="text-rose-400" size={20} />
                      <p className="text-rose-400 font-rajdhani">{passwordError}</p>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                      <Check className="text-emerald-400" size={20} />
                      <p className="text-emerald-400 font-rajdhani">
                        Пароль успешно изменен
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-rajdhani">
                      Текущий пароль
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none font-rajdhani"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-rajdhani">
                      Новый пароль
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none font-rajdhani"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-rajdhani">
                      Подтвердите новый пароль
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-cyan-400 focus:outline-none font-rajdhani"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePasswordChange}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-rajdhani font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                  >
                    Сменить пароль
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;