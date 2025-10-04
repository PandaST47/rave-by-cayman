'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Phone,
    MapPin,
    Clock,
    ChevronRight,
    Navigation,
    Zap,
    Instagram,
    Youtube
} from 'lucide-react';
import { FaTelegramPlane, FaVk } from "react-icons/fa";

// Types
interface ContactCard {
    id: string;
    icon: JSX.Element;
    title: string;
    content: string;
    subtitle: string;
    gradient: string;
    glowColor: string;
    action: string;
    badge: string;
}

interface WorkingHour {
    day: string;
    hours: string;
    isOpen: boolean;
    highlight?: boolean;
}

interface SocialLink {
    icon: JSX.Element;
    name: string;
    url: string;
    color: string;
}

// Constants
const CONTACT_CARDS: ContactCard[] = [
    {
        id: 'phone',
        icon: <Phone size={40} />,
        title: 'Телефон',
        content: '+7 (495) 123-45-67',
        subtitle: 'Звони прямо сейчас',
        gradient: 'from-cyan-500 via-blue-500 to-cyan-500',
        glowColor: 'rgba(34,211,238,0.6)',
        action: 'tel:+74951234567',
        badge: 'Быстрый ответ'
    },
    {
        id: 'telegram',
        icon: <FaTelegramPlane size={40} />,
        title: 'Telegram',
        content: '@rave_by_cayman_msk',
        subtitle: 'Новости и бронирование',
        gradient: 'from-blue-500 via-cyan-500 to-blue-500',
        glowColor: 'rgba(59,130,246,0.6)',
        action: 'https://t.me/cyberclub_msk',
        badge: 'Онлайн 24/7'
    },
    {
        id: 'address',
        icon: <MapPin size={40} />,
        title: 'Адрес',
        content: 'ул. Тверская, 15',
        subtitle: 'м. Маяковская, 3 мин пешком',
        gradient: 'from-purple-500 via-pink-500 to-purple-500',
        glowColor: 'rgba(168,85,247,0.6)',
        action: 'https://yandex.ru/maps/-/CDdkVVhd',
        badge: 'В центре Москвы'
    }
];

const WORKING_HOURS: WorkingHour[] = [
    { day: 'Пн - Чт', hours: '12:00 - 03:00', isOpen: true },
    { day: 'Пт - Вс', hours: 'Круглосуточно', isOpen: true, highlight: true },
    { day: 'Праздники', hours: 'Круглосуточно', isOpen: true, highlight: true }
];

const SOCIAL_LINKS: SocialLink[] = [
    { icon: <FaTelegramPlane size={24} />, name: 'Telegram', url: 'https://t.me/cyberclub_msk', color: 'from-blue-400 to-cyan-400' },
    { icon: <Instagram size={24} />, name: 'Instagram', url: '#', color: 'from-pink-500 to-purple-500' },
    { icon: <Youtube size={24} />, name: 'YouTube', url: '#', color: 'from-red-500 to-rose-500' },
    { icon: <FaVk size={24} />, name: 'VK', url: '#', color: 'from-blue-600 to-blue-400' }
];

const MAP_URL = "https://yandex.ru/map-widget/v1/?ll=37.605000%2C55.768889&z=16&l=map&pt=37.605000,55.768889,pm2rdm";
const MAP_LINK = "https://yandex.ru/maps/?ll=37.605000%2C55.768889&z=16&l=map&pt=37.605000,55.768889,pm2rdm";

// Animation Variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
};

const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

// Sub-components
const AnimatedParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{
                    x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                    y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
                    opacity: 0
                }}
                animate={{
                    y: typeof window !== 'undefined' ? [null, Math.random() * window.innerHeight] : 0,
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    delay: Math.random() * 3
                }}
            />
        ))}
    </div>
);

const SectionHeader = () => (
    <motion.div
        {...fadeInUp}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16"
    >
        <motion.div
            animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
        >
            <h2 className="font-orbitron text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] bg-[length:200%_auto]">
                    КОНТАКТЫ
                </span>
            </h2>
        </motion.div>
        <p className="font-rajdhani text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto px-4">
            Свяжись с нами любым удобным способом.<br />
            <span className="text-cyan-400 font-bold">Мы всегда на связи!</span>
        </p>
    </motion.div>
);

const ContactCard = ({ 
    card, 
    index, 
    isHovered, 
    onHover 
}: { 
    card: ContactCard; 
    index: number; 
    isHovered: boolean; 
    onHover: (id: string | null) => void;
}) => {
    const getActionLabel = () => {
        if (card.id === 'phone') return 'Позвонить';
        if (card.id === 'telegram') return 'Написать';
        return 'Показать на карте';
    };

    return (
        <motion.a
            href={card.action}
            target={card.id !== 'phone' ? '_blank' : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            viewport={{ once: true }}
            onMouseEnter={() => onHover(card.id)}
            onMouseLeave={() => onHover(null)}
            className="relative glass p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 group overflow-hidden cursor-pointer"
            style={{
                boxShadow: isHovered ? `0 0 50px ${card.glowColor}` : 'none'
            }}
        >
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                animate={isHovered ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {card.badge}
            </div>

            <motion.div
                className="mb-4 sm:mb-6 text-cyan-400 relative inline-block"
                animate={isHovered ? {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 0.5 }}
            >
                {card.icon}
                <motion.div
                    className="absolute inset-0 blur-xl opacity-50"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: card.glowColor }}
                />
            </motion.div>

            <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-2">
                {card.title}
            </h3>

            <p className={`font-rajdhani text-xl sm:text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}>
                {card.content}
            </p>

            <p className="font-rajdhani text-sm text-gray-400 mb-4">
                {card.subtitle}
            </p>

            <motion.div
                className="flex items-center gap-2 text-cyan-400 font-rajdhani font-bold"
                animate={isHovered ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
            >
                {getActionLabel()}
                <ChevronRight size={20} />
            </motion.div>

            <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-transparent"
                animate={isHovered ? {
                    borderColor: ['rgba(34,211,238,0)', 'rgba(34,211,238,0.5)', 'rgba(34,211,238,0)']
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
        </motion.a>
    );
};

const InteractiveMap = () => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative glass rounded-3xl border-2 border-cyan-400/30 overflow-hidden group"
    >
        <div className="aspect-video relative">
            <iframe
                src={MAP_URL}
                width="100%"
                height="100%"
                frameBorder="0"
                className="absolute inset-0 brightness-90 group-hover:brightness-100 transition-all duration-500"
                title="Яндекс Карта - Тверская 15"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            <motion.a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white p-3 sm:p-4 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] transition-all z-10 group/btn"
            >
                <Navigation size={24} className="group-hover/btn:rotate-45 transition-transform duration-300" />
            </motion.a>

            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-l-2 border-t-2 border-cyan-400/50 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 border-r-2 border-b-2 border-cyan-400/50 rounded-br-3xl pointer-events-none" />
        </div>

        <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm">
            <div className="flex items-start gap-3 sm:gap-4">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <MapPin className="text-cyan-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" size={28} />
                </motion.div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-orbitron font-bold text-white mb-2 sm:mb-3 text-base sm:text-lg">
                        Как добраться?
                    </h4>
                    <div className="space-y-2">
                        <p className="font-rajdhani text-sm sm:text-base text-gray-200 flex items-start gap-2">
                            <span className="text-cyan-400 text-xl flex-shrink-0">📍</span>
                            <span>
                                <span className="font-semibold">ул. Тверская, 15</span>
                                <span className="text-gray-400 text-xs sm:text-sm ml-1">(вход со двора)</span>
                            </span>
                        </p>
                        <p className="font-rajdhani text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-cyan-400 text-lg">🚇</span>
                            м. Маяковская - 3 минуты пешком
                        </p>
                        <p className="font-rajdhani text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-cyan-400 text-lg">🚗</span>
                            Бесплатная парковка для гостей
                        </p>
                        <p className="font-rajdhani text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-cyan-400 text-lg">🏢</span>
                            2 этаж, вывеска "RAVE BY CAYMAN"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const WorkingHoursCard = () => (
    <div className="glass rounded-3xl border-2 border-cyan-400/30 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Clock className="text-cyan-400 flex-shrink-0" size={32} />
            <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white">
                Режим работы
            </h3>
        </div>

        <div className="space-y-3 sm:space-y-4">
            {WORKING_HOURS.map((schedule, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                        schedule.highlight
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50'
                            : 'bg-gray-800/50 border border-gray-700'
                    }`}
                >
                    <span className="font-rajdhani font-bold text-white text-sm sm:text-base">
                        {schedule.day}
                    </span>
                    <span className={`font-rajdhani font-bold text-sm sm:text-base ${
                        schedule.highlight ? 'text-cyan-400' : 'text-gray-300'
                    }`}>
                        {schedule.hours}
                    </span>
                    {schedule.isOpen && (
                        <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-bold"
                        >
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            <span className="hidden sm:inline">ОТКРЫТО</span>
                        </motion.span>
                    )}
                </motion.div>
            ))}
        </div>

        <motion.div
            animate={{
                boxShadow: [
                    '0 0 20px rgba(16,185,129,0.3)',
                    '0 0 40px rgba(16,185,129,0.6)',
                    '0 0 20px rgba(16,185,129,0.3)'
                ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/50 text-center"
        >
            <p className="font-rajdhani font-bold text-emerald-400 text-base sm:text-lg">
                🎮 Сейчас открыто! Приходи играть!
            </p>
        </motion.div>
    </div>
);

const SocialLinksCard = () => (
    <div className="glass rounded-3xl border-2 border-cyan-400/30 p-6 sm:p-8">
        <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
            Мы в соцсетях
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {SOCIAL_LINKS.map((social, index) => (
                <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    viewport={{ once: true }}
                    className="relative glass p-4 sm:p-6 rounded-2xl border-2 border-gray-700 hover:border-cyan-400 transition-all group overflow-hidden"
                >
                    <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                    />

                    <div className="text-cyan-400 mb-2 sm:mb-3 inline-block">
                        {social.icon}
                    </div>

                    <p className="font-rajdhani font-bold text-white text-xs sm:text-sm">
                        {social.name}
                    </p>
                </motion.a>
            ))}
        </div>
    </div>
);

const QuickActionCTA = () => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative glass rounded-3xl border-2 border-cyan-400/30 p-8 sm:p-12 overflow-hidden"
    >
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"
            animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%' }}
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-4 sm:mb-6"
            >
                <Zap size={48} className="text-cyan-400 sm:w-16 sm:h-16" />
            </motion.div>

            <h3 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Остались вопросы?
                </span>
            </h3>

            <p className="font-rajdhani text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
                Наша команда ответит на все твои вопросы!<br />
                Звони или пиши - мы всегда на связи 24/7
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <motion.a
                    href="tel:+74951234567"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-rajdhani font-bold text-base sm:text-lg shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 sm:gap-3"
                >
                    <Phone size={20} className="sm:w-6 sm:h-6" />
                    Позвонить сейчас
                </motion.a>

                <motion.a
                    href="https://t.me/cyberclub_msk"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border-2 border-cyan-400 text-cyan-400 font-rajdhani font-bold text-base sm:text-lg hover:bg-cyan-400/10 transition-all flex items-center justify-center gap-2 sm:gap-3"
                >
                    <FaTelegramPlane size={20} className="sm:w-6 sm:h-6" />
                    Написать в Telegram
                </motion.a>
            </div>
        </div>
    </motion.div>
);

// Main Component
const Contacts = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <div id='contacts' className="relative bg-gradient-to-b from-black via-gray-900 to-black py-16 sm:py-20 px-4 overflow-hidden">
            <AnimatedParticles />

            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeader />

                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
                >
                    {CONTACT_CARDS.map((card, index) => (
                        <ContactCard
                            key={card.id}
                            card={card}
                            index={index}
                            isHovered={hoveredCard === card.id}
                            onHover={setHoveredCard}
                        />
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                    <InteractiveMap />

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-4 sm:space-y-6"
                    >
                        <WorkingHoursCard />
                        <SocialLinksCard />
                    </motion.div>
                </div>

                <QuickActionCTA />
            </div>
        </div>
    );
};

export default Contacts;