// components/Header.tsx

'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Gamepad2, Phone, Zap, User, TvMinimal } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AuthModal } from './AuthModals';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import Profile from './Profile';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface UserProfile {
  id: string;
  login: string;
  email: string;
  balance: number;
}

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

const Logo = memo(() => (
  <motion.div
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="relative group cursor-pointer"
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
  </motion.div>
));

Logo.displayName = 'Logo';

const NavButton = memo(({ item }: { item: NavItem }) => (
  <motion.div className="relative">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => scrollToSection(item.href)}
      className="relative px-4 lg:px-6 py-2.5 lg:py-3 font-rajdhani font-bold text-sm lg:text-base text-white hover:text-blue-400 transition-all duration-300 flex items-center space-x-2 group"
    >
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-lg transition-all duration-300" />
      <span className="relative z-10">{item.icon}</span>
      <span className="relative z-10">{item.label}</span>
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

const CTAButtons = memo(({
  user,
  onProfileClick,
  onLoginClick,
  onRegisterClick
}: {
  user: UserProfile | null;
  onProfileClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}) => {
  if (user) {
    return (
      <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onProfileClick}
          className="px-6 py-2.5 font-rajdhani font-bold text-sm xl:text-base text-white border-2 border-blue-400/50 rounded-xl hover:border-blue-400 transition-all bg-blue-500/10 backdrop-blur-sm flex items-center gap-2"
        >
          <User size={18} />
          <span>{user.login}</span>
          <span className="text-blue-400 ml-2">{user.balance}₽</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
      <motion.button
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLoginClick}
        className="relative px-4 xl:px-6 py-2 xl:py-2.5 font-rajdhani font-bold text-sm xl:text-base text-white border-2 border-blue-400/50 rounded-xl overflow-hidden group hover:border-blue-400 transition-all duration-300 bg-blue-500/10 backdrop-blur-sm"
      >
        <span className="relative z-10 flex items-center space-x-2">
          <LogIn size={16} />
          <span>Вход</span>
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRegisterClick}
        className="relative px-6 xl:px-8 py-2 xl:py-2.5 font-rajdhani font-black text-sm xl:text-base text-white rounded-xl overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%)',
          boxShadow: '0 0 30px rgba(59,130,246,0.5)',
        }}
      >
        <span className="relative z-10 flex items-center space-x-2">
          <Zap size={16} className="animate-pulse" />
          <span>Регистрация</span>
        </span>
      </motion.button>
    </div>
  );
});

CTAButtons.displayName = 'CTAButtons';

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
  >
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
          <X className="text-blue-400" size={20} />
        </motion.div>
      ) : (
        <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
          <Menu className="text-blue-400" size={20} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
));

MobileMenuButton.displayName = 'MobileMenuButton';

const MobileMenu = memo(({
  navItems,
  user,
  onNavClick,
  onClose,
  onProfileClick,
  onLoginClick,
  onRegisterClick
}: {
  navItems: NavItem[];
  user: UserProfile | null;
  onNavClick: (href: string) => void;
  onClose: () => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden"
    />

    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-16 sm:top-20 right-0 bottom-0 w-full max-w-sm bg-black/80 backdrop-blur-2xl border-l-2 border-blue-500/30 z-40 lg:hidden overflow-y-auto"
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 rounded-xl border border-blue-400/30"
          >
            <p className="text-sm text-gray-400 mb-1">Добро пожаловать</p>
            <p className="font-orbitron font-bold text-white">{user.login}</p>
            <p className="text-blue-400 font-bold mt-2">Баланс: {user.balance}₽</p>
            <motion.button
              onClick={() => {
                onClose();
                onProfileClick();
              }}
              className="w-full mt-3 px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-lg text-white font-rajdhani font-bold hover:bg-blue-500/30 transition-all"
            >
              Личный кабинет
            </motion.button>
          </motion.div>
        )}

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
                className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center space-x-3 text-left font-rajdhani font-bold text-white hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/20 hover:border-blue-400/50 rounded-xl transition-all"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </motion.div>
          ))}
        </div>

        {!user && (
          <>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            />

            <div className="space-y-3 sm:space-y-4">
              <motion.button
                onClick={onLoginClick}
                className="w-full px-5 py-3 font-rajdhani font-bold text-white border-2 border-blue-400/50 rounded-xl hover:border-blue-400 transition-all flex items-center justify-center space-x-2 bg-blue-500/10"
              >
                <LogIn size={20} />
                <span>Вход</span>
              </motion.button>

              <motion.button
                onClick={onRegisterClick}
                className="w-full px-5 py-3 font-rajdhani font-black text-white rounded-xl flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #2563eb 100%)',
                  boxShadow: '0 0 35px rgba(59,130,246,0.6)',
                }}
              >
                <Zap size={20} className="animate-pulse" />
                <span>Регистрация</span>
              </motion.button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  </>
));

MobileMenu.displayName = 'MobileMenu';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navItems: NavItem[] = useMemo(() => [
    { label: 'Зоны', href: '#zones', icon: <TvMinimal size={18} /> },
    { label: 'Тарифы', href: '#tariffs', icon: <Gamepad2 size={18} /> },
    { label: 'Контакты', href: '#contacts', icon: <Phone size={18} /> },
  ], []);

  const handleLogin = async (data: { login: string; password: string }) => {
    try {
      await apiClient.login(data.login, data.password);
      await checkAuth();
      setIsAuthModalOpen(false);
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка входа');
    }
  };

  const handleRegister = async (data: { login: string; email: string; password: string }) => {
    try {
      await apiClient.register(data.login, data.email, data.password);
      await checkAuth();
      setIsAuthModalOpen(false);
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка регистрации');
    }
  };

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
    checkAuth();

    const handleOpenLogin = () => {
      setAuthModalType('login');
      setIsAuthModalOpen(true);
    };

    const handleOpenRegister = () => {
      setAuthModalType('register');
      setIsAuthModalOpen(true);
    };

    const handleOpenForgotPassword = () => {
      setIsForgotPasswordOpen(true);
    };

    window.addEventListener('openLogin', handleOpenLogin);
    window.addEventListener('openRegister', handleOpenRegister);
    window.addEventListener('openForgotPassword', handleOpenForgotPassword);

    return () => {
      window.removeEventListener('openLogin', handleOpenLogin);
      window.removeEventListener('openRegister', handleOpenRegister);
      window.removeEventListener('openForgotPassword', handleOpenForgotPassword);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const data = await apiClient.getProfile();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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

  const handleNavClick = useCallback((href: string) => {
    scrollToSection(href);
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
              ? 'bg-black/60 backdrop-blur-2xl border-b-2 border-blue-500/30'
              : 'bg-black/40 backdrop-blur-xl border-b border-blue-500/20'
              }`}
          >
            <nav className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <div className="flex items-center justify-between h-16 sm:h-20">
                <Logo />

                <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                  {navItems.map((item) => (
                    <NavButton key={item.href} item={item} />
                  ))}
                </div>

                <CTAButtons
                  user={user}
                  onProfileClick={() => setIsProfileOpen(true)}
                  onLoginClick={() => {
                    setAuthModalType('login');
                    setIsAuthModalOpen(true);
                  }}
                  onRegisterClick={() => {
                    setAuthModalType('register');
                    setIsAuthModalOpen(true);
                  }}
                />

                <MobileMenuButton
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </div>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && isVisible && (
          <MobileMenu
            navItems={navItems}
            user={user}
            onNavClick={handleNavClick}
            onClose={() => setIsMobileMenuOpen(false)}
            onProfileClick={() => {
              setIsMobileMenuOpen(false);
              setIsProfileOpen(true);
            }}
            onLoginClick={() => {
              setIsMobileMenuOpen(false);
              setAuthModalType('login');
              setIsAuthModalOpen(true);
            }}
            onRegisterClick={() => {
              setIsMobileMenuOpen(false);
              setAuthModalType('register');
              setIsAuthModalOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={authModalType === 'login' ? handleLogin : handleRegister}
        type={authModalType}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      {isProfileOpen && (
        <Profile onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
};

export default Header;