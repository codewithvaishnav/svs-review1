import React, { useEffect, useRef } from 'react';

/** Soft gold light that trails the cursor above the page background. */
export const CursorGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      node.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[520px] w-[520px] rounded-full opacity-60 mix-blend-screen"
      style={{
        background:
          'radial-gradient(circle, rgba(224,169,46,0.13) 0%, rgba(224,169,46,0.05) 38%, transparent 70%)',
      }}
    />
  );
};
