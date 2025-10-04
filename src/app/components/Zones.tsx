'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Martini, Cigarette, Coffee, Play, Sparkles } from 'lucide-react';
import { BsHeadsetVr } from 'react-icons/bs';
import { GiPc } from 'react-icons/gi';
import { RiVipLine, RiPlaystationLine } from 'react-icons/ri';

interface Zone {
    id: string;
    name: string;
    icon: JSX.Element;
    tagline: string;
    description: string;
    features: string[];
    capacity: string;
    imageUrl: string;
    gradient: string;
    accentColor: string;
    glowColor: string;
}

const AUTOPLAY_INTERVAL = 5000;
const ICON_SIZE = 48;
const THUMBNAIL_ICON_SIZE = 24;

const Zones = () => {
    const [activeZone, setActiveZone] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const zones: Zone[] = useMemo(() => [
        {
            id: 'vr',
            name: 'VR Зона',
            icon: <BsHeadsetVr size={ICON_SIZE} />,
            tagline: 'Погружение в виртуальную реальность',
            description: 'Испытай невероятные ощущения с Oculus Quest 3. Новейшие VR-игры, симуляторы и виртуальные миры ждут тебя.',
            features: ['Oculus Quest 3', 'Беспроводная свобода', 'AAA VR-игры', 'Симуляторы'],
            capacity: '10 зон',
            imageUrl: '/zones/vr-zone.png',
            gradient: 'from-cyan-500 via-blue-600 to-purple-600',
            accentColor: 'cyan',
            glowColor: 'rgba(34,211,238,0.4)'
        },
        {
            id: 'ps5',
            name: 'PS5 Зона',
            icon: <RiPlaystationLine size={ICON_SIZE} />,
            tagline: 'Консольный гейминг нового поколения',
            description: '15 игровых станций PlayStation 5 с эксклюзивными играми. Мощность новой генерации консолей в твоих руках.',
            features: ['PlayStation 5', '4K 120Hz дисплеи', 'Эксклюзивы PS5', 'DualSense контроллеры'],
            capacity: '15 мест',
            imageUrl: '/zones/ps5-zone.png',
            gradient: 'from-blue-500 via-indigo-600 to-purple-600',
            accentColor: 'blue',
            glowColor: 'rgba(59,130,246,0.4)'
        },
        {
            id: 'pc',
            name: 'ПК Зона',
            icon: <GiPc size={ICON_SIZE} />,
            tagline: 'Топовые игровые станции',
            description: '60 мощных игровых компьютеров с видеокартами RTX 4000 серии. Киберспортивные турниры, стримы и любые игры на максимальных настройках.',
            features: ['RTX 4070/4090', 'Intel Core i7/i9', '144Hz+ мониторы', 'Механические клавиатуры'],
            capacity: '60 мест',
            imageUrl: '/zones/pc-zone.png',
            gradient: 'from-emerald-500 via-cyan-600 to-blue-600',
            accentColor: 'emerald',
            glowColor: 'rgba(16,185,129,0.4)'
        },
        {
            id: 'vip',
            name: 'VIP Комнаты',
            icon: <RiVipLine size={ICON_SIZE} />,
            tagline: 'Приватное пространство премиум-класса',
            description: '2 эксклюзивные комнаты с топовыми ПК на базе RTX 4090. Личный бар, караоке-система и полная приватность для твоей команды.',
            features: ['5 ПК RTX 4090', 'Приватная комната', 'Личный бар', 'Караоке-система'],
            capacity: '2 комнаты по 5 мест',
            imageUrl: '/zones/vip-zone.png',
            gradient: 'from-amber-500 via-orange-600 to-rose-600',
            accentColor: 'amber',
            glowColor: 'rgba(251,191,36,0.4)'
        },
        {
            id: 'bar',
            name: 'Барная Зона',
            icon: <Martini size={ICON_SIZE} />,
            tagline: 'Стильный бар с игровой атмосферой',
            description: 'Освежись между игровыми сессиями. Энергетики, коктейли, снеки и полноценное меню. Барная стойка с киберпанк-дизайном.',
            features: ['Энергетики', 'Коктейли', 'Горячие напитки', 'Фастфуд меню'],
            capacity: 'Барная стойка',
            imageUrl: '/zones/bar-zone.png',
            gradient: 'from-rose-500 via-pink-600 to-purple-600',
            accentColor: 'rose',
            glowColor: 'rgba(244,63,94,0.4)'
        },
        {
            id: 'lounge',
            name: 'Лаунж Зона',
            icon: <Cigarette size={ICON_SIZE} />,
            tagline: 'Расслабься и отдохни',
            description: 'Комфортная зона отдыха с кальянами премиум-качества. Мягкие диваны, приглушенный свет и атмосфера для общения.',
            features: ['Премиум кальяны', 'Мягкие диваны', 'Заказ еды', 'Чилл-атмосфера'],
            capacity: 'Лаунж-зона',
            imageUrl: '/zones/lounge-zone.png',
            gradient: 'from-purple-500 via-violet-600 to-indigo-600',
            accentColor: 'purple',
            glowColor: 'rgba(168,85,247,0.4)'
        },
        {
            id: 'vending',
            name: 'Вендинг Зона',
            icon: <Coffee size={ICON_SIZE} />,
            tagline: 'Быстрые перекусы 24/7',
            description: 'Автоматы с напитками, снеками и всем необходимым. Мгновенный доступ к еде и напиткам в любое время.',
            features: ['Напитки', 'Снеки', 'Сладости', 'Доступно 24/7'],
            capacity: 'Вендинг-автоматы',
            imageUrl: '/zones/vending-zone.png',
            gradient: 'from-cyan-500 via-teal-600 to-emerald-600',
            accentColor: 'cyan',
            glowColor: 'rgba(20,184,166,0.4)'
        }
    ], []);

    const currentZone = zones[activeZone];

    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setActiveZone((prev) => (prev + 1) % zones.length);
        }, AUTOPLAY_INTERVAL);

        return () => clearInterval(interval);
    }, [isAutoPlay, zones.length]);

    const handleZoneChange = (index: number) => {
        setIsAutoPlay(false);
        setActiveZone(index);
    };

    const toggleAutoPlay = () => setIsAutoPlay((prev) => !prev);

    const generateFallbackSvg = (name: string, tagline: string) => {
        return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="800"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23111827;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23000000;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="1920" height="800"/%3E%3Ctext fill="%2322d3ee" font-family="Arial" font-size="48" font-weight="bold" x="50%25" y="45%25" text-anchor="middle" dominant-baseline="middle"%3E${name}%3C/text%3E%3Ctext fill="%236B7280" font-family="Arial" font-size="24" x="50%25" y="55%25" text-anchor="middle" dominant-baseline="middle"%3E${tagline}%3C/text%3E%3C/svg%3E`;
    };

    const generateThumbnailFallback = () => {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23111827" width="200" height="200"/%3E%3C/svg%3E';
    };

    return (
        <div id="zones" className="relative bg-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-purple-900/20 to-black" />
                <motion.div
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.1) 0%, transparent 50%)',
                        backgroundSize: '100% 100%'
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-12 lg:mb-16"
                >
                    <h2 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 px-4">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                            НАШИ ЗОНЫ
                        </span>
                    </h2>
                    <p className="font-rajdhani text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto px-4">
                        Исследуй все пространства клуба Rave by Cayman — от футуристических игровых зон до атмосферных лаунж-площадок
                    </p>
                </motion.div>

                {/* Main Showcase */}
                <div className="relative">
                    {/* Main Display */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeZone}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-400/30 mb-6 sm:mb-8"
                            style={{ boxShadow: `0 0 60px ${currentZone.glowColor}` }}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-video md:aspect-[16/6] bg-gradient-to-br from-gray-900 to-black">
                                <img
                                    src={currentZone.imageUrl}
                                    alt={currentZone.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = generateFallbackSvg(currentZone.name, currentZone.tagline);
                                    }}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                {/* Zone Badge */}
                                <motion.div
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 glass px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border-2 border-cyan-400/30 flex items-center gap-2 sm:gap-3"
                                >
                                    <div className={`text-${currentZone.accentColor}-400 [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-8 sm:[&>svg]:h-8 md:[&>svg]:w-12 md:[&>svg]:h-12`}>
                                        {currentZone.icon}
                                    </div>
                                    <div>
                                        <div className="font-orbitron font-black text-white text-sm sm:text-base md:text-xl">
                                            {currentZone.name}
                                        </div>
                                        <div className="font-rajdhani text-[10px] sm:text-xs text-gray-400 uppercase">
                                            {currentZone.capacity}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="max-w-4xl"
                                    >
                                        <h3 className="font-orbitron text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-2 sm:mb-3 md:mb-4">
                                            <span className={`bg-gradient-to-r ${currentZone.gradient} bg-clip-text text-transparent`}>
                                                {currentZone.tagline}
                                            </span>
                                        </h3>
                                        <p className="font-rajdhani text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-5 md:mb-6 max-w-3xl">
                                            {currentZone.description}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {currentZone.features.map((feature, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                                    className="glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-cyan-400/30 backdrop-blur-xl"
                                                >
                                                    <span className="font-rajdhani text-xs sm:text-sm text-gray-200 flex items-center gap-1.5 sm:gap-2">
                                                        <Sparkles size={12} className="text-cyan-400 flex-shrink-0" />
                                                        {feature}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Zone Thumbnails */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
                        {zones.map((zone, index) => (
                            <motion.button
                                key={zone.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                viewport={{ once: true }}
                                onClick={() => handleZoneChange(index)}
                                className={`relative group overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                                    activeZone === index
                                        ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]'
                                        : 'border-gray-700 hover:border-gray-500'
                                }`}
                                aria-label={`Перейти к ${zone.name}`}
                            >
                                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative">
                                    <img
                                        src={zone.imageUrl}
                                        alt={zone.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = generateThumbnailFallback();
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all" />

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-3">
                                        <div className={`text-${zone.accentColor}-400 mb-1.5 sm:mb-2 transform group-hover:scale-110 transition-transform [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8`}>
                                            {zone.icon}
                                        </div>
                                        <span className="font-orbitron text-[10px] sm:text-xs md:text-sm font-bold text-white text-center leading-tight">
                                            {zone.name}
                                        </span>
                                    </div>

                                    {activeZone === index && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-cyan-400 to-blue-400"
                                        />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Progress Dots & AutoPlay Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <div className="flex gap-1.5 sm:gap-2">
                            {zones.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleZoneChange(index)}
                                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                                        activeZone === index
                                            ? 'w-8 sm:w-12 bg-gradient-to-r from-cyan-400 to-blue-400'
                                            : 'w-1.5 sm:w-2 bg-gray-600 hover:bg-gray-500'
                                    }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Перейти к зоне ${index + 1}`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleAutoPlay}
                            className={`glass px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                                isAutoPlay
                                    ? 'border-cyan-400/50 bg-cyan-400/10'
                                    : 'border-gray-700 hover:border-gray-500'
                            }`}
                            aria-label={isAutoPlay ? 'Остановить автопрокрутку' : 'Включить автопрокрутку'}
                        >
                            <Play size={14} className={isAutoPlay ? 'text-cyan-400' : 'text-gray-400'} />
                            <span className="font-rajdhani text-xs sm:text-sm text-white">
                                {isAutoPlay ? 'Авто' : 'Пауза'}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Zones;