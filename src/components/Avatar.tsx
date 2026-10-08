import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Generate deterministic vibrant gradients from name string
function getGradientFromName(name: string): { bg: string; text: string } {
  const palettes = [
    { bg: 'from-violet-600 via-purple-600 to-indigo-600', text: 'text-white' },
    { bg: 'from-fuchsia-600 via-purple-600 to-violet-600', text: 'text-white' },
    { bg: 'from-indigo-600 via-violet-600 to-cyan-500', text: 'text-white' },
    { bg: 'from-violet-700 via-indigo-800 to-purple-950', text: 'text-violet-200' },
    { bg: 'from-purple-600 via-pink-600 to-violet-500', text: 'text-white' },
    { bg: 'from-violet-500 via-indigo-600 to-blue-600', text: 'text-white' }
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || 'FG').toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
  const initials = getInitials(name);
  const palette = getGradientFromName(name);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 text-base'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-tr ${palette.bg} ${palette.text} font-bold select-none shadow-sm flex-shrink-0 ${sizeClasses} ${className}`}
    >
      <span>{initials}</span>
      {/* Subtle top inner reflection */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};
