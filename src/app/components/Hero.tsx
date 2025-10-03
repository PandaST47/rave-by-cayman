'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Zap, Wifi, Cpu, Gamepad2, Shield, Users, Clock, Star } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [scrollY, setScrollY] = useState(0);

  // Countdown с оптимизацией
  useEffect(() => {
    const targetDate = new Date('2025-10-15T18:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Оптимизированный скролл с throttle
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ОПТИМИЗИРОВАННАЯ Three.js сцена
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: false, // Отключаем для производительности
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Ограничиваем pixel ratio
    renderer.shadowMap.enabled = false; // Отключаем тени для производительности
    
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    scene.fog = new THREE.Fog(0x000000, 8, 20);

    // ОПТИМИЗИРОВАННОЕ ОСВЕЩЕНИЕ - меньше источников
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x4488ff, 4);
    keyLight.position.set(0, 8, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00ccff, 2);
    rimLight.position.set(-8, 4, -2);
    scene.add(rimLight);

    // ОПТИМИЗИРОВАННАЯ СИСТЕМА ЧАСТИЦ - меньше частиц
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000; // Уменьшено с 3000
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 30;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 15;

      const blueIntensity = 0.5 + Math.random() * 0.5;
      colorArray[i] = 0;
      colorArray[i + 1] = blueIntensity * 0.7;
      colorArray[i + 2] = blueIntensity;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Упрощенная текстура частиц
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 16; // Уменьшено с 32
    canvas2d.height = 16;
    const ctx = canvas2d.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas2d);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: particleTexture,
      depthWrite: false // Оптимизация
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Загрузка модели
    const loader = new GLTFLoader();
    let actualModel: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let animationAction: THREE.AnimationAction | null = null;
    const clock = new THREE.Clock();

    const modelUrl = '/models/stormtrooper_captain_by_oscar_creativo.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        actualModel = gltf.scene;

        actualModel.scale.set(4.5, 4.5, 4.5);
        actualModel.position.set(2.7, -11.3, 0);
        actualModel.rotation.y = -0.7;

        // Оптимизация материалов
        actualModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = false;
            child.receiveShadow = false;

            if (child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.metalness = Math.min(mat.metalness + 0.3, 1);
              mat.roughness = Math.max(mat.roughness - 0.2, 0.2);
              mat.envMapIntensity = 2.5;

              if (mat.color) {
                mat.color.multiplyScalar(1.8);
              }
            }
          }
        });

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(actualModel);
          animationAction = mixer.clipAction(gltf.animations[0]);
          animationAction.setDuration(15);
          animationAction.setLoop(THREE.LoopRepeat, Infinity);
          animationAction.play();
        }

        scene.add(actualModel);
      },
      undefined,
      (error) => {
        console.error('Model load error:', error);
      }
    );

    // ОПТИМИЗИРОВАННАЯ АНИМАЦИЯ с adaptive frame rate
    let time = 0;
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      // Считаем FPS
      frameCount++;
      if (frameCount % 60 === 0) {
        fps = 1000 / (deltaTime || 16.67);
      }

      // Пропускаем кадры если FPS низкий
      if (deltaTime < 16.67) { // 60 FPS
        lastTime = currentTime;
        return;
      }

      lastTime = currentTime;
      time += 0.01;

      // Обновление анимации модели
      if (mixer && animationAction) {
        const delta = clock.getDelta();
        mixer.update(delta);

        if (animationAction.time >= 15) {
          animationAction.time = 0;
          animationAction.play();
        }
      }

      // Упрощенная анимация камеры
      camera.position.y = Math.sin(time * 0.5) * 0.1;

      // Оптимизированная анимация частиц - обновляем реже
      if (frameCount % 2 === 0) {
        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x += 0.0001;
        
        const positions = particlesGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 9) { // Обновляем каждую третью частицу
          positions[i + 1] += Math.sin(time + i) * 0.002;
        }
        particlesGeometry.attributes.position.needsUpdate = true;
      }

      // Упрощенная пульсация света
      if (frameCount % 3 === 0) {
        keyLight.intensity = 4 + Math.sin(time * 2) * 0.5;
        rimLight.intensity = 2 + Math.cos(time * 1.5) * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Оптимизированный resize с debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
      
      // Очистка ресурсов
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Мемоизированные данные
  const zones = useMemo(() => [
    {
      icon: <Gamepad2 size={48} />,
      title: 'VR Зона',
      desc: 'Виртуальная реальность нового поколения',
      color: 'cyan'
    },
    {
      icon: <Cpu size={48} />,
      title: 'PS5 Зона',
      desc: 'Эксклюзивные консольные игры',
      color: 'blue'
    },
    {
      icon: <Users size={48} />,
      title: '60 ПК',
      desc: 'Общая игровая зона премиум класса',
      color: 'cyan'
    },
    {
      icon: <Shield size={48} />,
      title: '2×5 VIP',
      desc: 'Приватные VIP комнаты',
      color: 'blue'
    },
  ], []);

  const features = useMemo(() => [
    {
      icon: <Cpu size={56} />,
      title: 'Топовое железо',
      desc: 'RTX 4090 Ti, i9-14900K - мощность без компромиссов',
    },
    {
      icon: <Wifi size={56} />,
      title: 'Молния',
      desc: '1000 Мбит/с - забудь о лагах навсегда',
    },
    {
      icon: <Zap size={56} />,
      title: 'Плавность',
      desc: '240 Hz мониторы - каждый кадр на счету',
    },
  ], []);

  const additionalInfo = useMemo(() => [
    { icon: <Clock size={32} />, text: '24/7 Работаем круглосуточно' },
    { icon: <Users size={32} />, text: 'Турниры каждую неделю' },
    { icon: <Star size={32} />, text: 'VIP программа лояльности' },
  ], []);

  return (
    <div className="relative bg-black">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* ЭПИЧНЫЙ ФОНОВЫЙ ТЕКСТ */}
        <div className="absolute inset-0 flex items-center justify-start pl-0 md:pl-2 lg:pl-4 pointer-events-none z-0 overflow-hidden" style={{ perspective: '1000px' }}>
          <div className="relative" style={{ transform: 'rotateY(35deg)', transformOrigin: 'left center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 blur-3xl opacity-60">
                <div className="text-[11vw] font-orbitron font-black text-left leading-[0.9] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  RAVE<br />BY<br />CAYMAN
                </div>
              </div>

              <motion.div
                animate={{
                  textShadow: [
                    '0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.6)',
                    '0 0 30px rgba(59,130,246,0.8), 0 0 50px rgba(59,130,246,0.6)',
                    '0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.6)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-[12vw] font-orbitron font-black text-left leading-[0.9] bg-gradient-to-br from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent relative z-10"
                style={{
                  WebkitTextStroke: '2px rgba(34,211,238,0.3)',
                }}
              >
                RAVE<br />BY<br />CAYMAN
              </motion.div>

              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 text-[12vw] font-orbitron font-black text-left leading-[0.9] bg-gradient-to-tr from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
                style={{
                  WebkitTextStroke: '1px rgba(59,130,246,0.5)',
                }}
              >
                RAVE<br />BY<br />CAYMAN
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Three.js Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10"
          style={{
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 40% 100%)'
          }}
        />

        {/* Scanline Effect */}
        <div className="absolute inset-0 scanline pointer-events-none opacity-10 z-20" />

        {/* ГРАДИЕНТНАЯ ОБРЕЗКА */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
          style={{
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)',
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-30"
          style={{
            height: '30%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-rajdhani text-cyan-400 text-sm uppercase tracking-widest">Узнать больше</span>
            <ChevronDown className="text-cyan-400" size={32} />
          </div>
        </motion.div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black pointer-events-none opacity-70 z-30" />
      </section>

      {/* ИНФОРМАЦИЯ И CTA */}
      <section className="relative z-10 bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                RAVE BY CAYMAN
              </span>
            </h2>
            <p className="font-rajdhani text-2xl md:text-3xl text-gray-300 mb-4">
              Премиальный киберспортивный клуб нового поколения
            </p>
            <p className="font-rajdhani text-xl text-cyan-400 font-bold">
              RTX 4090 • i9-14900K • 240Hz • PS5 • VR • 4K
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-8">
              <p className="font-rajdhani text-sm text-gray-400 uppercase tracking-wider mb-2">
                Открытие через
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              {[
                { value: countdown.days, label: 'Дней' },
                { value: countdown.hours, label: 'Часов' },
                { value: countdown.minutes, label: 'Минут' },
                { value: countdown.seconds, label: 'Секунд' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                >
                  <div className="font-orbitron text-4xl md:text-6xl font-black text-cyan-400 mb-2">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="font-rajdhani text-sm md:text-base text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Зоны клуба */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Зоны клуба
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {zones.map((zone, index) => (
                <motion.div
                  key={zone.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  viewport={{ once: true }}
                  className={`glass p-8 rounded-2xl border-2 ${zone.color === 'cyan'
                    ? 'border-cyan-400/30 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]'
                    : 'border-blue-400/30 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]'
                    } transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`${zone.color === 'cyan' ? 'text-cyan-400' : 'text-blue-400'
                    } mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {zone.icon}
                  </div>
                  <h4 className="font-orbitron text-2xl font-bold text-white mb-2">
                    {zone.title}
                  </h4>
                  <p className="font-rajdhani text-gray-400">
                    {zone.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Почему мы?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ scale: 1.08, y: -10 }}
                  viewport={{ once: true }}
                  className="glass p-8 rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 text-center group cursor-pointer hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]"
                >
                  <div className="text-cyan-400 mb-6 inline-block group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="font-orbitron text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="font-rajdhani text-lg text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="glass p-12 md:p-16 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 max-w-4xl mx-auto hover:shadow-[0_0_60px_rgba(34,211,238,0.4)]">
              <h3 className="font-orbitron text-4xl md:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Готов к игре?
                </span>
              </h3>
              <p className="font-rajdhani text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Забронируй место прямо сейчас и получи <span className="text-cyan-400 font-bold">2 часа в подарок</span> при первом посещении!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-12 py-5 font-rajdhani font-black text-2xl text-white bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:shadow-[0_0_70px_rgba(34,211,238,0.9)] transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Zap size={28} className="animate-pulse" />
                    Забронировать сейчас
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-12 py-5 font-rajdhani font-black text-2xl text-white border-3 border-cyan-400 rounded-2xl hover:bg-cyan-400/20 transition-all duration-300 group overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Clock size={28} />
                    Посмотреть тарифы
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
              </div>

              {/* Дополнительная информация */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {additionalInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="text-cyan-400">
                      {item.icon}
                    </div>
                    <p className="font-rajdhani text-sm text-gray-400">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Глобальные стили */}
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

.scanline {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(34, 211, 238, 0.05) 50%,
    transparent 100%
  );
  background-size: 100% 4px;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100vh;
  }
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}

* {
  scrollbar-width: thin;
  scrollbar-color: #22d3ee #000;
}

*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #000;
}

*::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #22d3ee, #3b82f6);
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #06b6d4, #2563eb);
}

/* Оптимизация для GPU */
canvas {
  transform: translateZ(0);
  will-change: transform;
}

/* Оптимизация анимаций */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
  `}</style>
    </div>
  );
};

export default Hero;