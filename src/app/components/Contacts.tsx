'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Phone,
    MapPin,
    Clock,
    MessageCircle,
    Navigation,
    Zap,
    ChevronRight,
    Mail,
    Instagram,
    Youtube
} from 'lucide-react';

import { FaTelegramPlane, FaVk } from "react-icons/fa";

const Contacts = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const contactCards = [
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

    const workingHours = [
        { day: 'Пн - Чт', hours: '12:00 - 03:00', isOpen: true },
        { day: 'Пт - Вс', hours: 'Круглосуточно', isOpen: true, highlight: true },
        { day: 'Праздники', hours: 'Круглосуточно', isOpen: true, highlight: true }
    ];

    const socialLinks = [
        { icon: <FaTelegramPlane size={24} />, name: 'Telegram', url: 'https://t.me/cyberclub_msk', color: 'from-blue-400 to-cyan-400' },
        { icon: <Instagram size={24} />, name: 'Instagram', url: '#', color: 'from-pink-500 to-purple-500' },
        { icon: <Youtube size={24} />, name: 'YouTube', url: '#', color: 'from-red-500 to-rose-500' },
        { icon: <FaVk size={24} />, name: 'VK', url: '#', color: 'from-blue-600 to-blue-400' }
    ];

    return (
        <div className="relative bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4 overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
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

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header with animated gradient */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                        className="inline-block"
                    >
                        <h2 className="font-orbitron text-5xl md:text-7xl font-black mb-6">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] bg-[length:200%_auto]">
                                КОНТАКТЫ
                            </span>
                        </h2>
                    </motion.div>
                    <p className="font-rajdhani text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                        Свяжись с нами любым удобным способом.<br />
                        <span className="text-cyan-400 font-bold">Мы всегда на связи!</span>
                    </p>
                </motion.div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {contactCards.map((card, index) => (
                        <motion.a
                            key={card.id}
                            href={card.action}
                            target={card.id !== 'phone' ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            viewport={{ once: true }}
                            onMouseEnter={() => setHoveredCard(card.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="relative glass p-8 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 group overflow-hidden cursor-pointer"
                            style={{
                                boxShadow: hoveredCard === card.id ? `0 0 50px ${card.glowColor}` : 'none'
                            }}
                        >
                            {/* Animated gradient background */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                                animate={hoveredCard === card.id ? {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, 0]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {card.badge}
                            </div>

                            {/* Icon with glow */}
                            <motion.div
                                className={`mb-6 text-cyan-400 relative inline-block`}
                                animate={hoveredCard === card.id ? {
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

                            <h3 className="font-orbitron text-2xl font-bold text-white mb-2">
                                {card.title}
                            </h3>

                            <p className={`font-rajdhani text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}>
                                {card.content}
                            </p>

                            <p className="font-rajdhani text-sm text-gray-400 mb-4">
                                {card.subtitle}
                            </p>

                            <motion.div
                                className="flex items-center gap-2 text-cyan-400 font-rajdhani font-bold"
                                animate={hoveredCard === card.id ? { x: [0, 5, 0] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                {card.id === 'phone' ? 'Позвонить' : card.id === 'telegram' ? 'Написать' : 'Показать на карте'}
                                <ChevronRight size={20} />
                            </motion.div>

                            {/* Animated border */}
                            <motion.div
                                className={`absolute inset-0 rounded-3xl border-2 border-transparent`}
                                animate={hoveredCard === card.id ? {
                                    borderColor: ['rgba(34,211,238,0)', 'rgba(34,211,238,0.5)', 'rgba(34,211,238,0)']
                                } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                    background: `linear-gradient(90deg, ${card.gradient}) border-box`
                                }}
                            />
                        </motion.a>
                    ))}
                </div>

                {/* Map and Info Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Interactive Map */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative glass rounded-3xl border-2 border-cyan-400/30 overflow-hidden group"
                    >
                        <div className="aspect-video relative">
                            <iframe
                                src="https://yandex.ru/map-widget/v1/?ll=37.605000%2C55.768889&z=16&l=map&pt=37.605000,55.768889,pm2rdm"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                className="absolute inset-0 brightness-90 group-hover:brightness-100 transition-all duration-500"
                                title="Яндекс Карта - Тверская 15"
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                            {/* Floating navigation button */}
                            <motion.a
                                href="https://yandex.ru/maps/?ll=37.605000%2C55.768889&z=16&l=map&pt=37.605000,55.768889,pm2rdm"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute bottom-4 right-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] transition-all z-10 group/btn"
                            >
                                <Navigation size={24} className="group-hover/btn:rotate-45 transition-transform duration-300" />
                            </motion.a>

                            {/* Decorative corner accents */}
                            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-400/50 rounded-tl-3xl pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-400/50 rounded-br-3xl pointer-events-none" />
                        </div>

                        <div className="p-6 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <MapPin className="text-cyan-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" size={28} />
                                </motion.div>
                                <div className="flex-1">
                                    <h4 className="font-orbitron font-bold text-white mb-3 text-lg">
                                        Как добраться?
                                    </h4>
                                    <div className="space-y-2">
                                        <p className="font-rajdhani text-gray-200 flex items-center gap-2">
                                            <span className="text-cyan-400 text-xl">📍</span>
                                            <span className="font-semibold">ул. Тверская, 15</span>
                                            <span className="text-gray-400 text-sm">(вход со двора)</span>
                                        </p>
                                        <p className="font-rajdhani text-sm text-gray-300 flex items-center gap-2">
                                            <span className="text-cyan-400 text-lg">🚇</span>
                                            м. Маяковская - 3 минуты пешком
                                        </p>
                                        <p className="font-rajdhani text-sm text-gray-300 flex items-center gap-2">
                                            <span className="text-cyan-400 text-lg">🚗</span>
                                            Бесплатная парковка для гостей
                                        </p>
                                        <p className="font-rajdhani text-sm text-gray-300 flex items-center gap-2">
                                            <span className="text-cyan-400 text-lg">🏢</span>
                                            2 этаж, вывеска "RAVE BY CAYMAN"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Working Hours & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {/* Working Hours */}
                        <div className="glass rounded-3xl border-2 border-cyan-400/30 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-cyan-400" size={32} />
                                <h3 className="font-orbitron text-2xl font-bold text-white">
                                    Режим работы
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {workingHours.map((schedule, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className={`flex items-center justify-between p-4 rounded-xl ${schedule.highlight
                                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50'
                                            : 'bg-gray-800/50 border border-gray-700'
                                            }`}
                                    >
                                        <span className="font-rajdhani font-bold text-white">
                                            {schedule.day}
                                        </span>
                                        <span className={`font-rajdhani font-bold ${schedule.highlight ? 'text-cyan-400' : 'text-gray-300'
                                            }`}>
                                            {schedule.hours}
                                        </span>
                                        {schedule.isOpen && (
                                            <motion.span
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="flex items-center gap-2 text-emerald-400 text-sm font-bold"
                                            >
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                                ОТКРЫТО
                                            </motion.span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Current status */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(16,185,129,0.3)',
                                        '0 0 40px rgba(16,185,129,0.6)',
                                        '0 0 20px rgba(16,185,129,0.3)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/50 text-center"
                            >
                                <p className="font-rajdhani font-bold text-emerald-400 text-lg">
                                    🎮 Сейчас открыто! Приходи играть!
                                </p>
                            </motion.div>
                        </div>

                        {/* Social Links */}
                        <div className="glass rounded-3xl border-2 border-cyan-400/30 p-8">
                            <h3 className="font-orbitron text-2xl font-bold text-white mb-6 text-center">
                                Мы в соцсетях
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {socialLinks.map((social, index) => (
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
                                        className="relative glass p-6 rounded-2xl border-2 border-gray-700 hover:border-cyan-400 transition-all group overflow-hidden"
                                    >
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                                        />

                                        <div className={`text-cyan-400 mb-3 inline-block`}>
                                            {social.icon}
                                        </div>

                                        <p className="font-rajdhani font-bold text-white text-sm">
                                            {social.name}
                                        </p>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Action CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative glass rounded-3xl border-2 border-cyan-400/30 p-12 overflow-hidden"
                >
                    {/* Animated background */}
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
                            className="inline-block mb-6"
                        >
                            <Zap size={64} className="text-cyan-400" />
                        </motion.div>

                        <h3 className="font-orbitron text-4xl font-black mb-4">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Остались вопросы?
                            </span>
                        </h3>

                        <p className="font-rajdhani text-xl text-gray-300 mb-8">
                            Наша команда ответит на все твои вопросы!<br />
                            Звони или пиши - мы всегда на связи 24/7
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.a
                                href="tel:+74951234567"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-rajdhani font-bold text-lg shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-3"
                            >
                                <Phone size={24} />
                                Позвонить сейчас
                            </motion.a>

                            <motion.a
                                href="https://t.me/cyberclub_msk"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-2xl border-2 border-cyan-400 text-cyan-400 font-rajdhani font-bold text-lg hover:bg-cyan-400/10 transition-all flex items-center justify-center gap-3"
                            >
                                <FaTelegramPlane size={24} />
                                Написать в Telegram
                            </motion.a>
                        </div>
                    </div>
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

export default Contacts;