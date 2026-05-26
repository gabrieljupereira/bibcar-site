'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0)';
          observer.unobserve(el);
        }
      },
      { rootMargin: '-50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const y = direction === 'up' ? '36px' : '0px';
  const x = direction === 'left' ? '-36px' : direction === 'right' ? '36px' : '0px';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: `translateY(${y}) translateX(${x})`,
        transition: `opacity 0.72s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.72s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
