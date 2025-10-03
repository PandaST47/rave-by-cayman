'use client';

import { useEffect, useRef } from 'react';

// Количество частиц в хвосте курсора.
// Мы создаем их один раз и переиспользуем.
const TRAIL_PARTICLE_COUNT = 20;

/**
 * Гипер-оптимизированный компонент кастомного курсора.
 * * - **Zero Re-renders**: Компонент не использует useState и не перерисовывается после монтирования.
 * - **Direct DOM Manipulation**: Все обновления стилей (позиция, размер, прозрачность) 
 * происходят напрямую через refs для максимальной производительности.
 * - **Object Pooling**: Создается фиксированный пул DOM-элементов для хвоста, 
 * чтобы избежать постоянного создания/удаления элементов.
 * - **requestAnimationFrame**: Вся анимация синхронизирована с браузером для плавности.
 * - **Throttling**: Движение мыши обрабатывается с ограничением для экономии ресурсов.
 */
const CursorTrail = () => {
  // Refs для прямого доступа к DOM-элементам
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  // Refs для хранения состояния без вызова ререндеров
  const mousePos = useRef({ x: -100, y: -100 });
  const lastMousePos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const lastUpdateTime = useRef(0);
  const trailIndexRef = useRef(0);

  useEffect(() => {
    // Не запускаем на мобильных устройствах
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      return;
    }
    
    const cursorEl = cursorRef.current;
    const trailContainerEl = trailContainerRef.current;
    if (!cursorEl || !trailContainerEl) return;
    
    // Получаем созданные в JSX элементы хвоста
    const trails = Array.from(trailContainerEl.children) as HTMLDivElement[];
    trailRefs.current = trails;

    // Скрываем нативный курсор
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      // Ограничиваем частоту обновлений (~120fps) для производительности
      const now = performance.now();
      if (now - lastUpdateTime.current < 8) return;
      lastUpdateTime.current = now;
      
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Проверяем, является ли элемент интерактивным
      const isInteractive = !!target.closest('a, button, [role="button"], .cursor-pointer');
      isHovering.current = isInteractive;
    };

    const animate = () => {
      const { x, y } = mousePos.current;
      const { x: lastX, y: lastY } = lastMousePos.current;

      // Интерполяция для плавного движения курсора (lerp)
      const lerpFactor = 0.2;
      const newX = lastX + (x - lastX) * lerpFactor;
      const newY = lastY + (y - lastY) * lerpFactor;
      
      lastMousePos.current = { x: newX, y: newY };
      
      // 1. Обновляем главный курсор
      const scale = isHovering.current ? 1.5 : 1;
      cursorEl.style.transform = `translate(${newX}px, ${newY}px) scale(${scale})`;

      // 2. Создаем новую частицу хвоста
      const trailIndex = trailIndexRef.current;
      const trailEl = trailRefs.current[trailIndex];
      
      if (trailEl) {
        trailEl.style.left = `${newX}px`;
        trailEl.style.top = `${newY}px`;
        trailEl.style.opacity = '1';
        trailEl.style.transform = 'translate(-50%, -50%) scale(1)';
        trailEl.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
      }
      
      // Обновляем "старые" частицы
      const prevTrailIndex = (trailIndex + trailRefs.current.length - 1) % trailRefs.current.length;
      const prevTrailEl = trailRefs.current[prevTrailIndex];
      if (prevTrailEl) {
          prevTrailEl.style.opacity = '0';
          prevTrailEl.style.transform = 'translate(-50%, -50%) scale(0.3)';
      }
      
      // Двигаем указатель для следующего кадра
      trailIndexRef.current = (trailIndex + 1) % trailRefs.current.length;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    const rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* Контейнер для частиц хвоста (создаются один раз) */}
      <div ref={trailContainerRef}>
        {Array.from({ length: TRAIL_PARTICLE_COUNT }).map((_, index) => (
          <div
            key={index}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              width: '8px',
              height: '8px',
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.8) 0%, rgba(59, 130, 246, 0.5) 50%, transparent 70%)',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
              opacity: 0,
              willChange: 'transform, opacity',
              top: 0, // Начальная позиция вне экрана
              left: 0,
            }}
          />
        ))}
      </div>

      {/* Основной элемент курсора */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{ transform: 'translate(-100px, -100px)' /* Начальная позиция вне экрана */ }}
      >
        {/* Внешнее кольцо */}
        <div
          className="absolute w-8 h-8 rounded-full border-2 transition-transform duration-200"
          style={{
            transform: 'translate(-50%, -50%)',
            borderColor: '#22d3ee',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)',
          }}
        />
        {/* Внутренняя точка */}
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#22d3ee',
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
          }}
        />
      </div>

      {/* Глобальный стиль, чтобы скрыть курсор на всех элементах */}
      <style jsx global>{`
        body, html, a, button, [role="button"] {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CursorTrail;