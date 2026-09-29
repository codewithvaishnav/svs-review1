import { useEffect } from 'react';

const CARD_SELECTOR = [
  '.rounded-xl.border.cursor-pointer',
  '.rounded-2xl.border.cursor-pointer',
  '.rounded-3xl.border.cursor-pointer',
  '.rounded-xl.border.group',
  '.rounded-2xl.border.group',
  '.rounded-3xl.border.group',
].join(',');

const MAX_TILT = 7;

/**
 * Delegated pointer tracking that gives every card-shaped surface in the app a
 * perspective tilt and a specular highlight without touching each component.
 * Values are published as CSS variables and consumed by the card rules in
 * index.css.
 */
export function usePointerTilt(): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let active: HTMLElement | null = null;

    const reset = (node: HTMLElement) => {
      node.style.removeProperty('--tilt-x');
      node.style.removeProperty('--tilt-y');
      node.style.removeProperty('--pointer-x');
      node.style.removeProperty('--pointer-y');
    };

    const handleMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(CARD_SELECTOR) ?? null;

      if (active && active !== card) reset(active);
      active = card;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--tilt-y', `${(px - 0.5) * 2 * MAX_TILT}deg`);
      card.style.setProperty('--tilt-x', `${(0.5 - py) * 2 * MAX_TILT}deg`);
      card.style.setProperty('--pointer-x', `${px * 100}%`);
      card.style.setProperty('--pointer-y', `${py * 100}%`);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (active) reset(active);
    };
  }, []);
}
