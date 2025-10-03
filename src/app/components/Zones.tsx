'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Monitor,
    Crown,
    Martini,
    Cigarette,
    Coffee,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Users,
    Sparkles,
    Zap,
    Eye,
    Camera,
    Play
} from 'lucide-react';

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

const Zones = () => {
    const [activeZone, setActiveZone] = useState<number>(0);
    const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

    const zones: Zone[] = [
        {
            id: 'vr',
            name: 'VR Зона',
            icon: <Gamepad2 size={48} />,
            tagline: 'Погружение в виртуальную реальность',
            description: 'Испытай невероятные ощущения с Oculus Quest 3. Новейшие VR-игры, симуляторы и виртуальные миры ждут тебя.',
            features: ['Oculus Quest 3', 'Беспроводная свобода', 'AAA VR-игры', 'Симуляторы'],
            capacity: '10 зон',
            imageUrl: '/zones/vr-zone.jpg',
            gradient: 'from-cyan-500 via-blue-600 to-purple-600',
            accentColor: 'cyan',
            glowColor: 'rgba(34,211,238,0.4)'
        },
        {
            id: 'ps5',
            name: 'PS5 Зона',
            icon: <Gamepad2 size={48} />,
            tagline: 'Консольный гейминг нового поколения',
            description: '15 игровых станций PlayStation 5 с эксклюзивными играми. Мощность новой генерации консолей в твоих руках.',
            features: ['PlayStation 5', '4K 120Hz дисплеи', 'Эксклюзивы PS5', 'DualSense контроллеры'],
            capacity: '15 мест',
            imageUrl: '/zones/ps5-zone.jpg',
            gradient: 'from-blue-500 via-indigo-600 to-purple-600',
            accentColor: 'blue',
            glowColor: 'rgba(59,130,246,0.4)'
        },
        {
            id: 'pc',
            name: 'ПК Зона',
            icon: <Monitor size={48} />,
            tagline: 'Топовые игровые станции',
            description: '60 мощных игровых компьютеров с видеокартами RTX 4000 серии. Киберспортивные турниры, стримы и любые игры на максимальных настройках.',
            features: ['RTX 4070/4090', 'Intel Core i7/i9', '144Hz+ мониторы', 'Механические клавиатуры'],
            capacity: '60 мест',
            imageUrl: '/zones/pc-zone.jpg',
            gradient: 'from-emerald-500 via-cyan-600 to-blue-600',
            accentColor: 'emerald',
            glowColor: 'rgba(16,185,129,0.4)'
        },
        {
            id: 'vip',
            name: 'VIP Комнаты',
            icon: <Crown size={48} />,
            tagline: 'Приватное пространство премиум-класса',
            description: '2 эксклюзивные комнаты с топовыми ПК на базе RTX 4090. Личный бар, караоке-система и полная приватность для твоей команды.',
            features: ['5 ПК RTX 4090', 'Приватная комната', 'Личный бар', 'Караоке-система'],
            capacity: '2 комнаты по 5 мест',
            imageUrl: '/zones/vip-room.jpg',
            gradient: 'from-amber-500 via-orange-600 to-rose-600',
            accentColor: 'amber',
            glowColor: 'rgba(251,191,36,0.4)'
        },
        {
            id: 'bar',
            name: 'Барная Зона',
            icon: <Martini size={48} />,
            tagline: 'Стильный бар с игровой атмосферой',
            description: 'Освежись между игровыми сессиями. Энергетики, коктейли, снеки и полноценное меню. Барная стойка с киберпанк-дизайном.',
            features: ['Энергетики', 'Коктейли', 'Горячие напитки', 'Фастфуд меню'],
            capacity: 'Барная стойка',
            imageUrl: '/zones/bar-zone.jpg',
            gradient: 'from-rose-500 via-pink-600 to-purple-600',
            accentColor: 'rose',
            glowColor: 'rgba(244,63,94,0.4)'
        },
        {
            id: 'lounge',
            name: 'Лаунж Зона',
            icon: <Cigarette size={48} />,
            tagline: 'Расслабься и отдохни',
            description: 'Комфортная зона отдыха с кальянами премиум-качества. Мягкие диваны, приглушенный свет и атмосфера для общения.',
            features: ['Премиум кальяны', 'Мягкие диваны', 'Заказ еды', 'Чилл-атмосфера'],
            capacity: 'Лаунж-зона',
            imageUrl: '/zones/lounge-zone.jpg',
            gradient: 'from-purple-500 via-violet-600 to-indigo-600',
            accentColor: 'purple',
            glowColor: 'rgba(168,85,247,0.4)'
        },
        {
            id: 'vending',
            name: 'Вендинг Зона',
            icon: <Coffee size={48} />,
            tagline: 'Быстрые перекусы 24/7',
            description: 'Автоматы с напитками, снеками и всем необходимым. Мгновенный доступ к еде и напиткам в любое время.',
            features: ['Напитки', 'Снеки', 'Сладости', 'Доступно 24/7'],
            capacity: 'Вендинг-автоматы',
            imageUrl: '/zones/vending-zone.jpg',
            gradient: 'from-cyan-500 via-teal-600 to-emerald-600',
            accentColor: 'cyan',
            glowColor: 'rgba(20,184,166,0.4)'
        }
    ];

    const currentZone = zones[activeZone];

    useEffect(() => {
        if (!isAutoPlay) return;
        
        const interval = setInterval(() => {
            setActiveZone((prev) => (prev + 1) % zones.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay, zones.length]);

    const nextZone = () => {
        setIsAutoPlay(false);
        setActiveZone((prev) => (prev + 1) % zones.length);
    };

    const prevZone = () => {
        setIsAutoPlay(false);
        setActiveZone((prev) => (prev - 1 + zones.length) % zones.length);
    };

    const goToZone = (index: number) => {
        setIsAutoPlay(false);
        setActiveZone(index);
    };

    return (
        <div className="relative bg-black py-20 px-4 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-purple-900/20 to-black" />
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.1) 0%, transparent 50%)',
                        backgroundSize: '100% 100%',
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
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        viewport={{ once: true }}
                        className="inline-block mb-6"
                    >
                    </motion.div>

                    <h2 className="font-orbitron text-5xl md:text-7xl font-black mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                            НАШИ ЗОНЫ
                        </span>
                    </h2>
                    <p className="font-rajdhani text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
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
                            className="relative rounded-3xl overflow-hidden border-2 border-cyan-400/30 mb-8"
                            style={{
                                boxShadow: `0 0 60px ${currentZone.glowColor}`
                            }}
                        >
                            {/* Image */}
                            <div className="relative aspect-video md:aspect-[21/9] bg-gradient-to-br from-gray-900 to-black">
                                <img
                                    src={currentZone.imageUrl}
                                    alt={currentZone.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="800"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23111827;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23000000;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="1920" height="800"/%3E%3Ctext fill="%2322d3ee" font-family="Arial" font-size="48" font-weight="bold" x="50%25" y="45%25" text-anchor="middle" dominant-baseline="middle"%3E${currentZone.name}%3C/text%3E%3Ctext fill="%236B7280" font-family="Arial" font-size="24" x="50%25" y="55%25" text-anchor="middle" dominant-baseline="middle"%3E${currentZone.tagline}%3C/text%3E%3C/svg%3E`;
                                    }}
                                />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                {/* Zone Badge */}
                                <motion.div
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute top-6 left-6 glass px-6 py-3 rounded-xl border-2 border-cyan-400/30 flex items-center gap-3"
                                >
                                    <div className={`text-${currentZone.accentColor}-400`}>
                                        {currentZone.icon}
                                    </div>
                                    <div>
                                        <div className="font-orbitron font-black text-white text-xl">
                                            {currentZone.name}
                                        </div>
                                        <div className="font-rajdhani text-xs text-gray-400 uppercase">
                                            {currentZone.capacity}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="max-w-4xl"
                                    >
                                        <h3 className="font-orbitron text-3xl md:text-5xl font-black mb-4">
                                            <span className={`bg-gradient-to-r ${currentZone.gradient} bg-clip-text text-transparent`}>
                                                {currentZone.tagline}
                                            </span>
                                        </h3>
                                        <p className="font-rajdhani text-lg md:text-xl text-gray-200 mb-6 max-w-3xl">
                                            {currentZone.description}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-3">
                                            {currentZone.features.map((feature, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                                    className="glass px-4 py-2 rounded-lg border border-cyan-400/30 backdrop-blur-xl"
                                                >
                                                    <span className="font-rajdhani text-sm text-gray-200 flex items-center gap-2">
                                                        <Sparkles size={14} className="text-cyan-400" />
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                        {zones.map((zone, index) => (
                            <motion.button
                                key={zone.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                viewport={{ once: true }}
                                onClick={() => goToZone(index)}
                                className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                    activeZone === index
                                        ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]'
                                        : 'border-gray-700 hover:border-gray-500'
                                }`}
                            >
                                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative">
                                    <img
                                        src={zone.imageUrl}
                                        alt={zone.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23111827" width="200" height="200"/%3E%3C/svg%3E`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all" />
                                    
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                        <div className={`text-${zone.accentColor}-400 mb-2 transform group-hover:scale-110 transition-transform`}>
                                            {zone.icon}
                                        </div>
                                        <span className="font-orbitron text-xs font-bold text-white text-center">
                                            {zone.name}
                                        </span>
                                    </div>

                                    {activeZone === index && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400"
                                        />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Progress Dots & AutoPlay Toggle */}
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex gap-2">
                            {zones.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => goToZone(index)}
                                    className={`h-2 rounded-full transition-all ${
                                        activeZone === index
                                            ? 'w-12 bg-gradient-to-r from-cyan-400 to-blue-400'
                                            : 'w-2 bg-gray-600 hover:bg-gray-500'
                                    }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsAutoPlay(!isAutoPlay)}
                            className={`glass px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                                isAutoPlay
                                    ? 'border-cyan-400/50 bg-cyan-400/10'
                                    : 'border-gray-700 hover:border-gray-500'
                            }`}
                        >
                            <Play size={16} className={isAutoPlay ? 'text-cyan-400' : 'text-gray-400'} />
                            <span className="font-rajdhani text-sm text-white">
                                {isAutoPlay ? 'Авто' : 'Пауза'}
                            </span>
                        </motion.button>
                    </div>
                </div>
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

export default Zones;