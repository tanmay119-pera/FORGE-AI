import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareEffect?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glareEffect = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);

    if (glareEffect) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.18 });
    }
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)'
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic 3D specular light glare reflection */}
      {glareEffect && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-30"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle 300px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.45), transparent 70%)`
          }}
        />
      )}
    </div>
  );
};
