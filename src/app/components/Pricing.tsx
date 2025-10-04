'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Gamepad2,
    Cpu,
    Monitor,
    Crown,
    Clock,
    Zap,
    Users,
    ChevronRight,
    Minus,
    Plus,
    Gift
} from 'lucide-react';
import { GiConsoleController, GiPc  } from "react-icons/gi";
import { BsHeadsetVr  } from 'react-icons/bs';


interface TariffZone {
    id: string;
    name: string;
    icon: JSX.Element;
    description: string;
    totalSlots: number;
    occupiedSlots: number;
    imageUrl: string;
    gradient: string;
    borderColor: string;
    glowColor: string;
    prices: {
        perHour: number;
        label?: string;
    }[];
}

const Pricing = () => {
    const [selectedZone, setSelectedZone] = useState<string>('vr');
    const [hours, setHours] = useState<number>(2);

    // Имитация данных занятости (потом будет из бэкенда)
    const zones: TariffZone[] = useMemo(() => [
        {
            id: 'vr',
            name: 'VR Зона',
            icon: <BsHeadsetVr size={40} />,
            description: 'Oculus Quest 3 - виртуальная реальность нового поколения',
            totalSlots: 10,
            occupiedSlots: 3,
            imageUrl: '/pricing/vr-zone.png',
            gradient: 'from-cyan-500 via-blue-500 to-cyan-500',
            borderColor: 'border-cyan-400',
            glowColor: 'rgba(34,211,238,0.6)',
            prices: [
                { perHour: 800, label: 'Стандарт' }
            ]
        },
        {
            id: 'ps5',
            name: 'PS5 Зона',
            icon: <GiConsoleController size={40} />,
            description: '15 консолей PlayStation 5 с эксклюзивными играми',
            totalSlots: 15,
            occupiedSlots: 8,
            imageUrl: '/pricing/ps5-zone.png',
            gradient: 'from-blue-500 via-purple-500 to-blue-500',
            borderColor: 'border-blue-400',
            glowColor: 'rgba(59,130,246,0.6)',
            prices: [
                { perHour: 500, label: 'Стандарт' }
            ]
        },
        {
            id: 'pc-basic',
            name: 'ПК Зона - Базовый',
            icon: <GiPc size={40} />,
            description: 'RTX 3060 Ti, i5-12400F, 16GB RAM, 144Hz',
            totalSlots: 20,
            occupiedSlots: 12,
            imageUrl: '/pricing/pc-basic.png',
            gradient: 'from-emerald-500 via-cyan-500 to-emerald-500',
            borderColor: 'border-emerald-400',
            glowColor: 'rgba(16,185,129,0.6)',
            prices: [
                { perHour: 300, label: 'Базовый' }
            ]
        },
        {
            id: 'pc-pro',
            name: 'ПК Зона - Про',
            icon: <Cpu size={40} />,
            description: 'RTX 4070 Ti, i7-13700K, 32GB RAM, 240Hz',
            totalSlots: 25,
            occupiedSlots: 18,
            imageUrl: '/pricing/pc-pro.png',
            gradient: 'from-cyan-500 via-blue-500 to-cyan-500',
            borderColor: 'border-cyan-400',
            glowColor: 'rgba(34,211,238,0.6)',
            prices: [
                { perHour: 450, label: 'Про' }
            ]
        },
        {
            id: 'pc-ultra',
            name: 'ПК Зона - Ультра',
            icon: <Zap size={40} />,
            description: 'RTX 4090 Ti, i9-14900K, 64GB RAM, 240Hz, 4K',
            totalSlots: 15,
            occupiedSlots: 9,
            imageUrl: '/pricing/pc-ultra.png',
            gradient: 'from-purple-500 via-pink-500 to-purple-500',
            borderColor: 'border-purple-400',
            glowColor: 'rgba(168,85,247,0.6)',
            prices: [
                { perHour: 700, label: 'Ультра' }
            ]
        },
        {
            id: 'vip-1',
            name: 'VIP Комната #1',
            icon: <Crown size={40} />,
            description: '5 ПК RTX 4090 Ti в приватной комнате с баром',
            totalSlots: 5,
            occupiedSlots: 0,
            imageUrl: '/pricing/vip-room-2.png',
            gradient: 'from-amber-500 via-orange-500 to-amber-500',
            borderColor: 'border-amber-400',
            glowColor: 'rgba(251,191,36,0.6)',
            prices: [
                { perHour: 1000, label: 'За комнату' }
            ]
        },
        {
            id: 'vip-2',
            name: 'VIP Комната #2',
            icon: <Crown size={40} />,
            description: '5 ПК RTX 4090 Ti в приватной комнате с караоке',
            totalSlots: 5,
            occupiedSlots: 5,
            imageUrl: '/pricing/vip-room-1.png',
            gradient: 'from-rose-500 via-pink-500 to-rose-500',
            borderColor: 'border-rose-400',
            glowColor: 'rgba(244,63,94,0.6)',
            prices: [
                { perHour: 1000, label: 'За комнату' }
            ]
        }
    ], []);

    const selectedZoneData = zones.find(z => z.id === selectedZone) || zones[0];
    const availability = selectedZoneData.totalSlots - selectedZoneData.occupiedSlots;
    const availabilityPercent = (availability / selectedZoneData.totalSlots) * 100;
    const totalPrice = selectedZoneData.prices[0].perHour * hours;

    const getAvailabilityColor = () => {
        if (availabilityPercent > 50) return 'text-emerald-400';
        if (availabilityPercent > 20) return 'text-amber-400';
        return 'text-rose-400';
    };

    const getAvailabilityBg = () => {
        if (availabilityPercent > 50) return 'from-emerald-500/20 to-emerald-500/5';
        if (availabilityPercent > 20) return 'from-amber-500/20 to-amber-500/5';
        return 'from-rose-500/20 to-rose-500/5';
    };

    return (
        <div id='tariffs' className="relative bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-orbitron text-5xl md:text-7xl font-black mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                            ТАРИФЫ
                        </span>
                    </h2>
                    <p className="font-rajdhani text-xl md:text-2xl text-gray-300">
                        Выбери свою игровую зону и начни играть прямо сейчас
                    </p>
                </motion.div>

                {/* Зоны - Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    {zones.map((zone, index) => {
                        const isSelected = selectedZone === zone.id;
                        const zoneAvailability = zone.totalSlots - zone.occupiedSlots;
                        const isOccupied = zoneAvailability === 0;

                        return (
                            <motion.button
                                key={zone.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                viewport={{ once: true }}
                                onClick={() => !isOccupied && setSelectedZone(zone.id)}
                                disabled={isOccupied}
                                className={`relative glass p-6 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                                        ? `${zone.borderColor} shadow-[0_0_40px_${zone.glowColor}]`
                                        : `border-gray-700 ${isOccupied ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}`
                                    }`}
                                style={{
                                    boxShadow: isSelected ? `0 0 40px ${zone.glowColor}` : 'none'
                                }}
                            >
                                {isOccupied && (
                                    <div className="absolute top-3 right-3 bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        ЗАНЯТО
                                    </div>
                                )}

                                <div className={`mb-4 ${isSelected ? `text-${zone.borderColor.split('-')[1]}-400` : 'text-gray-400'}`}>
                                    {zone.icon}
                                </div>

                                <h3 className="font-orbitron text-lg font-bold text-white mb-2">
                                    {zone.name}
                                </h3>

                                <div className="flex items-center gap-2 mb-3">
                                    <Users size={16} className="text-gray-400" />
                                    <span className="font-rajdhani text-sm text-gray-400">
                                        {zoneAvailability}/{zone.totalSlots} свободно
                                    </span>
                                </div>

                                <div className="font-rajdhani text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    {zone.prices[0].perHour}₽/час
                                </div>

                                {isSelected && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '70%' }}
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-b-xl"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Детальная информация о выбранной зоне */}
                <motion.div
                    key={selectedZone}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-3xl border-2 border-cyan-400/30 overflow-hidden"
                >
                    <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12">
                        {/* Левая часть - Изображение */}
                        <div className="flex flex-col h-full">
                            <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-400/20 mb-6">
                                <img
                                    src={selectedZoneData.imageUrl}
                                    alt={selectedZoneData.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23111827" width="400" height="300"/%3E%3Ctext fill="%236B7280" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E' + selectedZoneData.name + '%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>

                            {/* Статус доступности */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`p-6 rounded-2xl bg-gradient-to-r ${getAvailabilityBg()} border-2 ${availabilityPercent > 50 ? 'border-emerald-400/30' :
                                        availabilityPercent > 20 ? 'border-amber-400/30' : 'border-rose-400/30'
                                    } mb-6`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-rajdhani text-gray-300">Доступность</span>
                                    <span className={`font-orbitron font-bold text-xl ${getAvailabilityColor()}`}>
                                        {availability}/{selectedZoneData.totalSlots}
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${availabilityPercent}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className={`h-full rounded-full ${availabilityPercent > 50 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                                availabilityPercent > 20 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                                                    'bg-gradient-to-r from-rose-400 to-rose-600'
                                            }`}
                                    />
                                </div>
                            </motion.div>

                            {/* Информация о первом посещении */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 flex items-center gap-3 mt-auto">
                                <Gift className="text-cyan-400 flex-shrink-0" size={24} />
                                <p className="font-rajdhani text-sm text-gray-300">
                                    Первое посещение - <span className="text-cyan-400 font-bold">2 часа в подарок!</span>
                                </p>
                            </div>
                        </div>

                        {/* Правая часть - Калькулятор и информация */}
                        <div className="flex flex-col h-full">
                            <h3 className="font-orbitron text-3xl md:text-4xl font-black mb-4">
                                <span className={`bg-gradient-to-r ${selectedZoneData.gradient} bg-clip-text text-transparent`}>
                                    {selectedZoneData.name}
                                </span>
                            </h3>

                            <p className="font-rajdhani text-lg text-gray-300 mb-8">
                                {selectedZoneData.description}
                            </p>

                            {/* Калькулятор времени */}
                            <div className="glass p-8 rounded-2xl border-2 border-cyan-400/30 mb-6 flex-grow">
                                <div className="flex items-center gap-3 mb-6">
                                    <Clock className="text-cyan-400" size={24} />
                                    <h4 className="font-orbitron text-xl font-bold text-white">
                                        Калькулятор времени
                                    </h4>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setHours(Math.max(1, hours - 1))}
                                        className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all"
                                    >
                                        <Minus className="text-cyan-400" size={24} />
                                    </motion.button>

                                    <div className="text-center">
                                        <div className="font-orbitron text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                            {hours}
                                        </div>
                                        <div className="font-rajdhani text-sm text-gray-400 uppercase tracking-wider">
                                            {hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setHours(Math.min(24, hours + 1))}
                                        className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all"
                                    >
                                        <Plus className="text-cyan-400" size={24} />
                                    </motion.button>
                                </div>

                                {/* Быстрый выбор */}
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {[1, 2, 4, 8].map((h) => (
                                        <motion.button
                                            key={h}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setHours(h)}
                                            className={`py-2 rounded-lg font-rajdhani font-bold transition-all ${hours === h
                                                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-black'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                                                }`}
                                        >
                                            {h}ч
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Итого */}
                                <div className="pt-6 border-t-2 border-cyan-400/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-rajdhani text-gray-400">Цена за час:</span>
                                        <span className="font-rajdhani text-white text-lg">
                                            {selectedZoneData.prices[0].perHour}₽
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-rajdhani text-gray-400">Часов:</span>
                                        <span className="font-rajdhani text-white text-lg">
                                            {hours}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                        <span className="font-orbitron font-bold text-white text-xl">ИТОГО:</span>
                                        <span className="font-orbitron font-black text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                            {totalPrice.toLocaleString()}₽
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Кнопка бронирования */}
                            <motion.button
                                whileHover={{ scale: 1.03, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-5 rounded-2xl font-rajdhani font-black text-xl text-white bg-gradient-to-r ${selectedZoneData.gradient} shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative`}
                                style={{
                                    boxShadow: `0 10px 40px ${selectedZoneData.glowColor}`
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <Zap size={24} className="animate-pulse" />
                                    Забронировать {selectedZoneData.name}
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Дополнительные преимущества */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { icon: <Zap size={32} />, title: 'Мгновенное бронирование', desc: 'Подтверждение за 1 минуту' },
                        { icon: <Clock size={32} />, title: 'Гибкие тарифы', desc: 'От 1 часа до целого дня' },
                        { icon: <Users size={32} />, title: 'Групповые скидки', desc: 'До 30% при бронировании для группы' }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            viewport={{ once: true }}
                            className="glass p-6 rounded-2xl border-2 border-cyan-400/20 hover:border-cyan-400/50 transition-all text-center"
                        >
                            <div className="text-cyan-400 mb-3 inline-block">
                                {item.icon}
                            </div>
                            <h4 className="font-orbitron font-bold text-white mb-2">
                                {item.title}
                            </h4>
                            <p className="font-rajdhani text-sm text-gray-400">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }

        .font-rajdhani {
          font-family: 'Rajdhani', sans-serif;
        }

        .glass {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
        </div>
    );
};

export default Pricing;