import React, { useRef } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  children: React.ReactNode;
}

/** Button whose body drifts toward the cursor while hovered. */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  strength = 0.25,
  className = '',
  children,
  ...rest
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    node.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const handleLeave = () => {
    const node = ref.current;
    if (node) node.style.transform = '';
  };

  return (
    <button
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`btn-3d ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
