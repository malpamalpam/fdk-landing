'use client';

import { useState, type ReactNode } from 'react';
import { GRAD_BORDER_DIM, GRAD_BORDER_HOV } from '../_lib/tokens';

export default function GlowCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 ${className}`}
      style={{
        padding: '1px',
        background: hovered ? GRAD_BORDER_HOV : GRAD_BORDER_DIM,
        boxShadow: hovered ? '0 0 28px rgba(37,99,235,0.14), 0 0 56px rgba(139,92,246,0.08)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-white rounded-2xl h-full">{children}</div>
    </div>
  );
}
