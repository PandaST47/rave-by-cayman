// app/admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Monitor,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  zones: ZoneStats[];
}

interface ZoneStats {
  id: string;
  name: string;
  type: string;
  totalSlots: number;
  occupiedSlots: number;
  occupancyRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Обновление каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      });
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <Activity className="text-cyan-400 animate-pulse" size={48} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <p className="text-white font-orbitron">Ошибка загрузки данных</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: <Users size={32} />,
      label: 'Пользователей',
      value: stats.totalUsers,
      color: 'cyan'
    },
    {
      icon: <Calendar size={32} />,
      label: 'Активных бронирований',
      value: stats.activeBookings,
      color: 'blue'
    },
    {
      icon: <DollarSign size={32} />,
      label: 'Выручка (₽)',
      value: stats.totalRevenue.toLocaleString(),
      color: 'emerald'
    },
    {
      icon: <TrendingUp size={32} />,
      label: 'Загрузка (%)',
      value: `${stats.occupancyRate.toFixed(1)}%`,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Панель администратора
            </span>
          </h1>
          <p className="font-rajdhani text-xl text-gray-300">
            Мониторинг и управление клубом в реальном времени
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass p-6 rounded-2xl border-2 border-${card.color}-400/30`}
            >
              <div className={`text-${card.color}-400 mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-rajdhani text-gray-400 text-sm mb-2">
                {card.label}
              </h3>
              <p className={`font-orbitron text-3xl font-bold text-${card.color}-400`}>
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Zones Status */}
        <div className="glass p-6 rounded-2xl border-2 border-cyan-400/30">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="text-cyan-400" size={32} />
            <h2 className="font-orbitron text-2xl font-bold text-white">
              Статус зон
            </h2>
          </div>

          <div className="space-y-4">
            {stats.zones.map((zone) => (
              <div
                key={zone.id}
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-orbitron text-lg text-white font-bold">
                    {zone.name}
                  </h3>
                  <span className="font-rajdhani text-cyan-400 font-bold">
                    {zone.occupiedSlots}/{zone.totalSlots} мест
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.occupancyRate}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${
                      zone.occupancyRate > 80
                        ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                        : zone.occupancyRate > 50
                        ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                        : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                    }`}
                  />
                </div>

                <p className="font-rajdhani text-sm text-gray-400 mt-2">
                  Загрузка: {zone.occupancyRate.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}