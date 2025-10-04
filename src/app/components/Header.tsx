'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Gamepad2, Phone, Zap, Sparkles, TvMinimal } from 'lucide-react';

/**
 * ОПТИМИЗИРОВАННЫЙ EPIC Premium Header
 * Улучшения:
 * - Оптимизированная мемоизация и колбэки
 * - Улучшенный throttling с requestAnimationFrame
 * - Адаптивная верстка для всех экранов
 * - Оптимизированные анимации и переходы
 * - Якорная навигация с smooth scroll
 */

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Оптимизированный throttle с использованием RAF
const throttle = (func: Function, delay: number) => {
  let rafId: number | null = null;
  let lastExecTime = 0;
  
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime >= delay) {
      lastExecTime = currentTime;
      func(...args);
    } else {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (Date.now() - lastExecTime >= delay) {
          lastExecTime = Date.now();
          func(...args);
        }
      });
    }
  };
};

// Функция плавного скролла к секции
const scrollToSection = (href: string): void => {
  const id = href.replace('#', '');
  const element = document.getElementById(id);
  
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Мемоизированный компонент логотипа
const Logo = memo(() => (
  <motion.div
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="relative group"
  >
    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative h-12 w-16 sm:h-14 sm:w-18 lg:h-15 lg:w-20 group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300">
      <img 
        src="/cayman_logo.png" 
        alt="RAVE BY CAYMAN" 
        loading="lazy"
        className="w-full h-full object-contain"
      />
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
      onClick={() => scrollToSection(item.href)}
      className="relative px-4 lg:px-6 py-2.5 lg:py-3 font-rajdhani font-bold text-sm lg:text-base text-white hover:text-blue-400 transition-all duration-300 flex items-center space-x-2 group"
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
  <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-4 xl:px-6 py-2 xl:py-2.5 font-rajdhani font-bold text-sm xl:text-base text-white border-2 border-blue-400/50 rounded-xl overflow-hidden group hover:border-blue-400 transition-all duration-300 bg-blue-500/10 backdrop-blur-sm"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/40 to-blue-600/0"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative z-10 flex items-center space-x-2 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
        <LogIn size={16} className="xl:w-[18px] xl:h-[18px]" />
        <span>Вход</span>
      </span>
      <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-6 xl:px-8 py-2 xl:py-2.5 font-rajdhani font-black text-sm xl:text-base text-white rounded-xl overflow-hidden group"
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
        <Zap size={16} className="xl:w-[18px] xl:h-[18px] animate-pulse" />
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

// Мемоизированная кнопка мобильного меню
const MobileMenuButton = memo(({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean; 
  onClick: () => void;
}) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="lg:hidden relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-blue-500/20 border-2 border-blue-400/40 hover:border-blue-400 transition-all backdrop-blur-sm"
    style={{
      boxShadow: '0 0 20px rgba(59,130,246,0.3)',
    }}
    aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
  >
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="close"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <X className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,1)]" size={20} />
        </motion.div>
      ) : (
        <motion.div
          key="menu"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Menu className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,1)]" size={20} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
));

MobileMenuButton.displayName = 'MobileMenuButton';

// Мемоизированное мобильное меню
const MobileMenu = memo(({ 
  navItems, 
  onNavClick, 
  onClose 
}: { 
  navItems: NavItem[];
  onNavClick: (href: string) => void;
  onClose: () => void;
}) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden"
    />

    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-16 sm:top-20 right-0 bottom-0 w-full max-w-sm bg-black/80 backdrop-blur-2xl border-l-2 border-blue-500/30 z-40 lg:hidden overflow-y-auto"
      style={{
        boxShadow: '-10px 0 50px rgba(59,130,246,0.3)',
      }}
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => onNavClick(item.href)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center space-x-3 text-left font-rajdhani font-bold text-white hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/20 hover:border-blue-400/50 rounded-xl transition-all duration-300 group"
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

        <div className="space-y-3 sm:space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full px-5 sm:px-6 py-3 sm:py-4 font-rajdhani font-bold text-white border-2 border-blue-400/50 rounded-xl hover:border-blue-400 transition-all flex items-center justify-center space-x-2 bg-blue-500/10 backdrop-blur-sm"
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
            className="w-full px-5 sm:px-6 py-3 sm:py-4 font-rajdhani font-black text-white rounded-xl transition-all flex items-center justify-center space-x-2 relative overflow-hidden group"
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
          className="p-4 sm:p-5 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl backdrop-blur-sm"
          style={{
            boxShadow: '0 0 25px rgba(59,130,246,0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-300 font-rajdhani font-medium">
              Онлайн игроков
            </span>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full pulse-dot" />
              <span className="font-rajdhani font-black text-blue-400 text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(59,130,246,1)]">
                42
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </>
));

MobileMenu.displayName = 'MobileMenu';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = useMemo(() => [
    { label: 'Зоны', href: '#zones', icon: <TvMinimal size={18} /> },
    { label: 'Тарифы', href: '#tariffs', icon: <Gamepad2 size={18} /> },
    { label: 'Контакты', href: '#contacts', icon: <Phone size={18} /> },
  ], []);

  // Оптимизированный обработчик скролла
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
        setIsScrolled(false);
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
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }, 200);

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Блокировка скролла при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    scrollToSection(href);
    closeMobileMenu();
  }, [closeMobileMenu]);

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
              isScrolled
                ? 'bg-black/60 backdrop-blur-2xl border-b-2 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
                : 'bg-black/40 backdrop-blur-xl border-b border-blue-500/20'
            }`}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent glow-line"
            />

            <nav className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <div className="flex items-center justify-between h-16 sm:h-20">
                <Logo />

                <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                  {navItems.map((item) => (
                    <NavButton key={item.href} item={item} />
                  ))}
                </div>

                <CTAButtons />

                <MobileMenuButton 
                  isOpen={isMobileMenuOpen} 
                  onClick={toggleMobileMenu}
                />
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
          <MobileMenu 
            navItems={navItems}
            onNavClick={handleNavClick}
            onClose={closeMobileMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;