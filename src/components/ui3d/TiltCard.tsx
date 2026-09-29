import React, { useRef } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  children: React.ReactNode;
}

/**
 * Wraps content in a perspective-tilting surface. Pointer position is written
 * to CSS variables consumed by `.tilt-3d` and `.sheen`.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  maxTilt = 8,
  className = '',
  children,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    node.style.setProperty('--tilt-y', `${(px - 0.5) * 2 * maxTilt}deg`);
    node.style.setProperty('--tilt-x', `${(0.5 - py) * 2 * maxTilt}deg`);
    node.style.setProperty('--pointer-x', `${px * 100}%`);
    node.style.setProperty('--pointer-y', `${py * 100}%`);
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`tilt-3d sheen relative ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
