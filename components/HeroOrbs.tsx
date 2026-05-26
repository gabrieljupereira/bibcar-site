'use client';

import dynamic from 'next/dynamic';
import type { OrbVariant } from './FloatingOrbs';

const FloatingOrbs = dynamic(() => import('./FloatingOrbs'), { ssr: false });

interface Props {
  variant?: OrbVariant;
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroOrbs({ variant = 'home', className = '', style }: Props) {
  return <FloatingOrbs variant={variant} className={className} style={style} />;
}
