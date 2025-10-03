'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Gamepad2, Clock, Trophy, Zap, Sparkles } from 'lucide-react';

/**
 * ОПТИМИЗИРОВАННЫЙ EPIC Premium Header
 * Улучшения производительности:
 * - Мемоизация компонентов и колбэков
 * - Throttling для scroll и mousemove событий
 * - Оптимизированные анимации
 * - Удаление неиспользуемых переменных
 */

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Throttle функция для оптимизации событий
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime < delay) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecTime = currentTime;
        func(...args);
      }, delay - (currentTime - lastExecTime));
    } else {
      lastExecTime = currentTime;
      func(...args);
    }
  };
};

// Мемоизированный компонент логотипа
const Logo = memo(() => (
  <motion.div
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="relative cursor-pointer group"
  >
    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative h-15 w-18 group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300">
      <img src="/cayman_logo.png" alt="RAVE BY CAYMAN" loading="lazy" />
    </div>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Sparkles className="absolute -top-2 -right-2 text-blue-400" size={16} />
    </motion.div>
  </motion.div>
));

Logo.displayName = 'Logo';

// Мемоизированная навигационная кнопка
const NavButton = memo(({ item }: { item: NavItem }) => (
  <motion.div className="relative">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-6 py-3 font-rajdhani font-bold text-white hover:text-blue-400 transition-all duration-300 flex items-center space-x-2 group"
    >
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-lg transition-all duration-300" />
      <span className="relative z-10 transition-all duration-300">
        {item.icon}
      </span>
      <span className="relative z-10">
        {item.label}
      </span>
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-blue-400 rounded-full"
        initial={{ width: 0 }}
        whileHover={{ width: '80%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  </motion.div>
));

NavButton.displayName = 'NavButton';

// Мемоизированные CTA кнопки
const CTAButtons = memo(() => (
  <div className="hidden md:flex items-center space-x-4">
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-6 py-2.5 font-rajdhani font-bold text-white border-2 border-blue-400/50 rounded-xl overflow-hidden group hover:border-blue-400 transition-all duration-300 bg-blue-500/10 backdrop-blur-sm"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/40 to-blue-600/0"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative z-10 flex items-center space-x-2 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
        <LogIn size={18} />
        <span>Вход</span>
      </span>
      <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-8 py-2.5 font-rajdhani font-black text-white rounded-xl overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%)',
        boxShadow: '0 0 30px rgba(59,130,246,0.5), inset 0 0 20px rgba(255,255,255,0.1)',
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        animate={{
          boxShadow: [
            '0 0 30px rgba(59,130,246,0.6)',
            '0 0 50px rgba(59,130,246,0.9)',
            '0 0 30px rgba(59,130,246,0.6)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-xl"
      />
      <span className="relative z-10 flex items-center space-x-2">
        <Zap size={18} className="animate-pulse" />
        <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Регистрация</span>
      </span>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>
    </motion.button>
  </div>
));

CTAButtons.displayName = 'CTAButtons';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = useMemo(() => [
    { label: 'Зоны клуба', href: '/', icon: <Gamepad2 size={18} /> },
    { label: 'Тарифы', href: '/tariffs', icon: <Clock size={18} /> },
    { label: 'Компьютеры', href: '/computers', icon: <Trophy size={18} /> },
  ], []);

  // Оптимизированный обработчик скролла с throttling
  const handleScroll = useCallback(
    throttle(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.8;

      if (scrollPosition > threshold) {
        setIsVisible(true);
        setIsScrolled(scrollPosition > windowHeight * 0.85);
      } else {
        setIsVisible(false);
      }
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Закрытие мобильного меню при resize
  useEffect(() => {
    const handleResize = throttle(() => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    }, 200);

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
              opacity: { duration: 0.3 }
            }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
              ? 'bg-black/60 backdrop-blur-2xl border-b-2 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
              : 'bg-black/40 backdrop-blur-xl border-b border-blue-500/20'
              }`}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent glow-line"
            />

            <nav className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <Logo />

                <div className="hidden md:flex items-center space-x-2">
                  {navItems.map((item) => (
                    <NavButton key={item.href} item={item} />
                  ))}
                </div>

                <CTAButtons />

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMobileMenu}
                  className="md:hidden relative w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/20 border-2 border-blue-400/40 hover:border-blue-400 transition-all backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 20px rgba(59,130,246,0.3)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,1)]" size={24} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,1)]" size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </nav>

            {isScrolled && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative h-[1px] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 scan-line" />
              </motion.div>
            )}
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-20 right-0 bottom-0 w-80 bg-black/80 backdrop-blur-2xl border-l-2 border-blue-500/30 z-40 md:hidden overflow-y-auto"
              style={{
                boxShadow: '-10px 0 50px rgba(59,130,246,0.3)',
              }}
            >
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={closeMobileMenu}
                        className="w-full px-5 py-4 flex items-center space-x-3 text-left font-rajdhani font-bold text-white hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/20 hover:border-blue-400/50 rounded-xl transition-all duration-300 group"
                        style={{
                          boxShadow: '0 0 20px rgba(59,130,246,0.2)',
                        }}
                      >
                        <span className="group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,1)] transition-all">
                          {item.icon}
                        </span>
                        <span className="group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">
                          {item.label}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 }}
                  className="h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                />

                <div className="space-y-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full px-6 py-4 font-rajdhani font-bold text-white border-2 border-blue-400/50 rounded-xl hover:border-blue-400 transition-all flex items-center justify-center space-x-2 bg-blue-500/10 backdrop-blur-sm"
                    style={{
                      boxShadow: '0 0 25px rgba(59,130,246,0.3)',
                    }}
                  >
                    <LogIn size={20} />
                    <span>Вход</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full px-6 py-4 font-rajdhani font-black text-white rounded-xl transition-all flex items-center justify-center space-x-2 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%)',
                      boxShadow: '0 0 35px rgba(59,130,246,0.6)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Zap size={20} className="relative z-10 animate-pulse" />
                    <span className="relative z-10">Регистрация</span>
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-5 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl backdrop-blur-sm"
                  style={{
                    boxShadow: '0 0 25px rgba(59,130,246,0.2)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-rajdhani font-medium">Онлайн игроков</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full pulse-dot" />
                      <span className="font-rajdhani font-black text-blue-400 text-2xl drop-shadow-[0_0_10px_rgba(59,130,246,1)]">
                        42
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700;800&display=swap');

        .font-rajdhani {
          font-family: 'Rajdhani', sans-serif;
        }

        /* Оптимизированные CSS анимации */
        @keyframes glowPulse {
          0%, 100% { 
            opacity: 0.3;
            box-shadow: 0 0 20px rgba(59,130,246,0.3);
          }
          50% { 
            opacity: 0.8;
            box-shadow: 0 0 40px rgba(59,130,246,0.6);
          }
        }

        @keyframes scanLine {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }

        @keyframes pulseDot {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(34,197,94,0.5);
          }
          50% {
            transform: scale(1.3);
            box-shadow: 0 0 20px rgba(34,197,94,0.8);
          }
        }

        .glow-line {
          animation: glowPulse 3s ease-in-out infinite;
        }

        .scan-line {
          animation: scanLine 2s linear infinite;
        }

        .pulse-dot {
          animation: pulseDot 2s ease-in-out infinite;
        }

        /* Оптимизированный скроллбар */
        * {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #000;
        }

        *::-webkit-scrollbar {
          width: 8px;
        }

        *::-webkit-scrollbar-track {
          background: #000;
        }

        *::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
          border-radius: 10px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #60a5fa, #2563eb);
        }

        /* Оптимизация для производительности */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* GPU ускорение для анимаций */
        .group, [class*="motion-"] {
          transform: translateZ(0);
          will-change: transform;
        }
      `}</style>
    </>
  );
};

export default Header;