'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Cpu,
    Crown,
    Clock,
    Zap,
    Users,
    ChevronRight,
    Minus,
    Plus,
    Gift
} from 'lucide-react';
import { GiConsoleController, GiPc } from "react-icons/gi";
import { BsHeadsetVr } from 'react-icons/bs';

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

const QUICK_HOURS = [1, 2, 4, 8] as const;
const MIN_HOURS = 1;
const MAX_HOURS = 24;

const ZONES_DATA: TariffZone[] = [
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
        prices: [{ perHour: 800, label: 'Стандарт' }]
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
        prices: [{ perHour: 500, label: 'Стандарт' }]
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
        prices: [{ perHour: 300, label: 'Базовый' }]
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
        prices: [{ perHour: 450, label: 'Про' }]
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
        prices: [{ perHour: 700, label: 'Ультра' }]
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
        prices: [{ perHour: 1000, label: 'За комнату' }]
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
        prices: [{ perHour: 1000, label: 'За комнату' }]
    }
];

const ADDITIONAL_BENEFITS = [
    {
        icon: <Zap size={32} />,
        title: 'Мгновенное бронирование',
        desc: 'Подтверждение за 1 минуту'
    },
    {
        icon: <Clock size={32} />,
        title: 'Гибкие тарифы',
        desc: 'От 1 часа до целого дня'
    },
    {
        icon: <Users size={32} />,
        title: 'Групповые скидки',
        desc: 'До 30% при бронировании для группы'
    }
];

const getAvailabilityStyles = (percent: number) => {
    if (percent > 50) {
        return {
            textColor: 'text-emerald-400',
            bgGradient: 'from-emerald-500/20 to-emerald-500/5',
            borderColor: 'border-emerald-400/30',
            barGradient: 'bg-gradient-to-r from-emerald-400 to-emerald-600'
        };
    }
    if (percent > 20) {
        return {
            textColor: 'text-amber-400',
            bgGradient: 'from-amber-500/20 to-amber-500/5',
            borderColor: 'border-amber-400/30',
            barGradient: 'bg-gradient-to-r from-amber-400 to-amber-600'
        };
    }
    return {
        textColor: 'text-rose-400',
        bgGradient: 'from-rose-500/20 to-rose-500/5',
        borderColor: 'border-rose-400/30',
        barGradient: 'bg-gradient-to-r from-rose-400 to-rose-600'
    };
};

const getHoursLabel = (hours: number): string => {
    if (hours === 1) return 'час';
    if (hours < 5) return 'часа';
    return 'часов';
};

const ZoneCard = ({
    zone,
    isSelected,
    index,
    onSelect
}: {
    zone: TariffZone;
    isSelected: boolean;
    index: number;
    onSelect: (id: string) => void;
}) => {
    const availability = zone.totalSlots - zone.occupiedSlots;
    const isOccupied = availability === 0;

    const handleClick = useCallback(() => {
        if (!isOccupied) {
            onSelect(zone.id);
        }
    }, [isOccupied, zone.id, onSelect]);

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={!isOccupied ? { scale: 1.05, y: -5 } : undefined}
            whileTap={!isOccupied ? { scale: 0.98 } : undefined}
            viewport={{ once: true }}
            onClick={handleClick}
            disabled={isOccupied}
            className={`relative glass p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected
                    ? `${zone.borderColor} shadow-[0_0_40px_${zone.glowColor}]`
                    : `border-gray-700 ${isOccupied ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}`
            }`}
            style={{
                boxShadow: isSelected ? `0 0 40px ${zone.glowColor}` : 'none'
            }}
        >
            {isOccupied && (
                <div className="absolute top-3 right-3 bg-rose-500/90 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full z-10">
                    ЗАНЯТО
                </div>
            )}

            <div className={`mb-3 sm:mb-4 ${isSelected ? `text-${zone.borderColor.split('-')[1]}-400` : 'text-gray-400'}`}>
                {zone.icon}
            </div>

            <h3 className="font-orbitron text-base sm:text-lg font-bold text-white mb-2 pr-16">
                {zone.name}
            </h3>

            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Users size={16} className="text-gray-400 flex-shrink-0" />
                <span className="font-rajdhani text-xs sm:text-sm text-gray-400">
                    {availability}/{zone.totalSlots} свободно
                </span>
            </div>

            <div className="font-rajdhani text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
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
};

const AvailabilityIndicator = ({
    availability,
    totalSlots
}: {
    availability: number;
    totalSlots: number;
}) => {
    const availabilityPercent = (availability / totalSlots) * 100;
    const styles = getAvailabilityStyles(availabilityPercent);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 sm:p-6 rounded-2xl bg-gradient-to-r ${styles.bgGradient} border-2 ${styles.borderColor} mb-4 sm:mb-6`}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="font-rajdhani text-sm sm:text-base text-gray-300">Доступность</span>
                <span className={`font-orbitron font-bold text-lg sm:text-xl ${styles.textColor}`}>
                    {availability}/{totalSlots}
                </span>
            </div>
            <div className="h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${availabilityPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${styles.barGradient}`}
                />
            </div>
        </motion.div>
    );
};

const TimeCalculator = ({
    hours,
    onHoursChange,
    pricePerHour
}: {
    hours: number;
    onHoursChange: (hours: number) => void;
    pricePerHour: number;
}) => {
    const totalPrice = pricePerHour * hours;

    const handleDecrement = useCallback(() => {
        onHoursChange(Math.max(MIN_HOURS, hours - 1));
    }, [hours, onHoursChange]);

    const handleIncrement = useCallback(() => {
        onHoursChange(Math.min(MAX_HOURS, hours + 1));
    }, [hours, onHoursChange]);

    return (
        <div className="glass p-4 sm:p-6 lg:p-8 rounded-2xl border-2 border-cyan-400/30 mb-4 sm:mb-6 flex-grow">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Clock className="text-cyan-400 flex-shrink-0" size={24} />
                <h4 className="font-orbitron text-lg sm:text-xl font-bold text-white">
                    Калькулятор времени
                </h4>
            </div>

            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecrement}
                    className="p-3 sm:p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all"
                    aria-label="Уменьшить количество часов"
                >
                    <Minus className="text-cyan-400" size={20} />
                </motion.button>

                <div className="text-center">
                    <div className="font-orbitron text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {hours}
                    </div>
                    <div className="font-rajdhani text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                        {getHoursLabel(hours)}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleIncrement}
                    className="p-3 sm:p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all"
                    aria-label="Увеличить количество часов"
                >
                    <Plus className="text-cyan-400" size={20} />
                </motion.button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4 sm:mb-6">
                {QUICK_HOURS.map((h) => (
                    <motion.button
                        key={h}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onHoursChange(h)}
                        className={`py-2 rounded-lg font-rajdhani font-bold text-sm sm:text-base transition-all ${
                            hours === h
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-black'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                        }`}
                    >
                        {h}ч
                    </motion.button>
                ))}
            </div>

            <div className="pt-4 sm:pt-6 border-t-2 border-cyan-400/30">
                <div className="flex items-center justify-between mb-2 text-sm sm:text-base">
                    <span className="font-rajdhani text-gray-400">Цена за час:</span>
                    <span className="font-rajdhani text-white">
                        {pricePerHour}₽
                    </span>
                </div>
                <div className="flex items-center justify-between mb-3 sm:mb-4 text-sm sm:text-base">
                    <span className="font-rajdhani text-gray-400">Часов:</span>
                    <span className="font-rajdhani text-white">
                        {hours}
                    </span>
                </div>
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-700">
                    <span className="font-orbitron font-bold text-white text-lg sm:text-xl">ИТОГО:</span>
                    <span className="font-orbitron font-black text-2xl sm:text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {totalPrice.toLocaleString()}₽
                    </span>
                </div>
            </div>
        </div>
    );
};

const Pricing = () => {
    const [selectedZone, setSelectedZone] = useState<string>('vr');
    const [hours, setHours] = useState<number>(2);

    const zones = useMemo(() => ZONES_DATA, []);

    const selectedZoneData = useMemo(
        () => zones.find(z => z.id === selectedZone) || zones[0],
        [zones, selectedZone]
    );

    const availability = useMemo(
        () => selectedZoneData.totalSlots - selectedZoneData.occupiedSlots,
        [selectedZoneData]
    );

    const handleZoneSelect = useCallback((zoneId: string) => {
        setSelectedZone(zoneId);
    }, []);

    const handleHoursChange = useCallback((newHours: number) => {
        setHours(newHours);
    }, []);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23111827" width="400" height="300"/%3E%3Ctext fill="%236B7280" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E${selectedZoneData.name}%3C/text%3E%3C/svg%3E`;
    }, [selectedZoneData.name]);

    return (
        <div id='tariffs' className="relative bg-gradient-to-b from-black via-gray-900 to-black py-12 sm:py-16 lg:py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                            ТАРИФЫ
                        </span>
                    </h2>
                    <p className="font-rajdhani text-lg sm:text-xl md:text-2xl text-gray-300 px-4">
                        Выбери свою игровую зону и начни играть прямо сейчас
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
                >
                    {zones.map((zone, index) => (
                        <ZoneCard
                            key={zone.id}
                            zone={zone}
                            isSelected={selectedZone === zone.id}
                            index={index}
                            onSelect={handleZoneSelect}
                        />
                    ))}
                </motion.div>

                <motion.div
                    key={selectedZone}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-2xl sm:rounded-3xl border-2 border-cyan-400/30 overflow-hidden"
                >
                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8 md:p-12">
                        <div className="flex flex-col h-full">
                            <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-400/20 mb-4 sm:mb-6">
                                <img
                                    src={selectedZoneData.imageUrl}
                                    alt={selectedZoneData.name}
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                />
                            </div>

                            <AvailabilityIndicator
                                availability={availability}
                                totalSlots={selectedZoneData.totalSlots}
                            />

                            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 flex items-center gap-3 mt-auto">
                                <Gift className="text-cyan-400 flex-shrink-0" size={20} />
                                <p className="font-rajdhani text-xs sm:text-sm text-gray-300">
                                    Первое посещение - <span className="text-cyan-400 font-bold">2 часа в подарок!</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col h-full">
                            <h3 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">
                                <span className={`bg-gradient-to-r ${selectedZoneData.gradient} bg-clip-text text-transparent`}>
                                    {selectedZoneData.name}
                                </span>
                            </h3>

                            <p className="font-rajdhani text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
                                {selectedZoneData.description}
                            </p>

                            <TimeCalculator
                                hours={hours}
                                onHoursChange={handleHoursChange}
                                pricePerHour={selectedZoneData.prices[0].perHour}
                            />

                            <motion.button
                                whileHover={{ scale: 1.03, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-rajdhani font-black text-lg sm:text-xl text-white bg-gradient-to-r ${selectedZoneData.gradient} shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group overflow-hidden relative`}
                                style={{
                                    boxShadow: `0 10px 40px ${selectedZoneData.glowColor}`
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                    <Zap size={20} className="animate-pulse flex-shrink-0" />
                                    <span className="truncate">Забронировать {selectedZoneData.name}</span>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
                >
                    {ADDITIONAL_BENEFITS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            viewport={{ once: true }}
                            className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-cyan-400/20 hover:border-cyan-400/50 transition-all text-center"
                        >
                            <div className="text-cyan-400 mb-3 inline-block">
                                {item.icon}
                            </div>
                            <h4 className="font-orbitron font-bold text-white text-sm sm:text-base mb-2">
                                {item.title}
                            </h4>
                            <p className="font-rajdhani text-xs sm:text-sm text-gray-400">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;