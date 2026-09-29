import { useEffect } from 'react';

const REVEAL_SELECTOR = 'main section, main > div > div, footer > div';

/**
 * Applies the reveal transition to page-level blocks as they scroll into view.
 * Re-runs whenever `key` changes so newly mounted tabs animate in too.
 */
export function useScrollReveal(key: unknown): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    for (const node of nodes) {
      node.classList.add('reveal');
      observer.observe(node);
    }

    return () => {
      observer.disconnect();
      for (const node of nodes) node.classList.remove('reveal', 'is-visible');
    };
  }, [key]);
}
