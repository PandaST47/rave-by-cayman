'use client';

import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Zap, Wifi, Cpu } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const HeroText = memo(() => (
  <div className="absolute inset-0 flex items-center justify-start pl-0 md:pl-2 lg:pl-4 pointer-events-none z-5 overflow-hidden" style={{ perspective: '1000px' }}>
    <div className="relative w-full max-w-[85vw]" style={{ transform: 'rotateY(35deg)', transformOrigin: 'left center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="font-orbitron font-black text-left leading-[0.85] hero-text-gradient relative z-10"
          style={{
            fontSize: 'clamp(8rem, 15vw, 28rem)',
            WebkitTextStroke: '2px rgba(34,211,238,0.3)',
          }}
        >
          RAVE<br />BY<br />CAYMAN
        </div>
      </motion.div>
    </div>
  </div>
));

HeroText.displayName = 'HeroText';

const CountdownTimer = memo(({ countdown }: { countdown: CountdownTime }) => (
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
      ].map((item) => (
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
));

CountdownTimer.displayName = 'CountdownTimer';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    animationId?: number;
  }>({});
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2025-10-15T18:00:00').getTime();

    const updateCountdown = () => {
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
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;

    camera.position.set(0, 0, 8);
    scene.fog = new THREE.Fog(0x000000, 8, 20);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x4488ff, 8);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00ccff, 4);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    const glowLight = new THREE.PointLight(0x3b82f6, 8, 30);
    glowLight.position.set(3, -13.3, -3);
    scene.add(glowLight);

    const glowLight2 = new THREE.PointLight(0x22d3ee, 6, 25);
    glowLight2.position.set(3, -13.3, -2);
    scene.add(glowLight2);

    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    let animationAction: THREE.AnimationAction | null = null;
    const clock = new THREE.Clock();

    loader.load('/models/spider/spiderman.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.x = -center.x;
      model.position.y = -center.y;
      model.position.z = -center.z;

      const scale = 16 / Math.max(size.x, size.y, size.z);
      model.scale.set(scale, scale, scale);

      model.position.set(3, -13.3, 0);
      model.rotation.y = -0.3;

      scene.add(model);

      if (gltf.animations?.length) {
        mixer = new THREE.AnimationMixer(model);
        animationAction = mixer.clipAction(gltf.animations[0]);
        animationAction.play();
      }
    });

    let lastTime = performance.now();
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime < frameInterval) return;

      lastTime = currentTime - (deltaTime % frameInterval);

      if (mixer && animationAction) {
        const delta = clock.getDelta();
        mixer.update(delta);

        if (animationAction.time >= 15) {
          animationAction.time = 0;
          animationAction.play();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

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
    sceneRef.current.renderer = renderer;

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (sceneRef.current.animationId) cancelAnimationFrame(sceneRef.current.animationId);
      renderer.dispose();
      scene.clear();
    };
  }, [isVisible]);

  const features = useMemo(() => [
    {
      icon: <Cpu size={56} />,
      title: 'Топовое железо',
      desc: 'RTX 4090 Ti, i9-14900K - мощность без компромиссов',
    },
    {
      icon: <Wifi size={56} />,
      title: 'Реактивный интернет',
      desc: '1000 Мбит/с - забудь о лагах навсегда',
    },
    {
      icon: <Zap size={56} />,
      title: 'Плавность',
      desc: '240 Hz мониторы - каждый кадр на счету',
    },
  ], []);

  return (
    <div className="relative bg-black">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: 'url(/background_hero.png)',
            filter: 'brightness(0.6) blur(2.3px)',
          }}
        />

        <HeroText />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10"
          style={{
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 40% 100%)',
            willChange: isVisible ? 'auto' : 'transform',
          }}
        />

        <div className="absolute inset-0 scanline-static pointer-events-none opacity-10 z-20" />

        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
          style={{
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)',
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-30"
          style={{
            height: '25%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          }}
        />

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

        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black pointer-events-none opacity-70 z-30" />
      </section>

      <section className="relative z-10 bg-gradient-to-b from-black via-gray-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
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

          <CountdownTimer countdown={countdown} />

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
                  className="glass p-8 rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 text-center group hover:shadow-[0_0_50px_rgba(34,211,238,0.6)]"
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
        </div>
      </section>
    </div>
  );
};

export default Hero;