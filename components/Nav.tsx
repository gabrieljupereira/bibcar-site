'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/passageiro', label: 'Passageiro' },
  { href: '/motorista', label: 'Motorista' },
  { href: '/franqueado', label: 'Franqueado' },
  { href: '/#delas', label: 'Bib Delas' },
];

const accentColor: Record<string, string> = {
  '/passageiro': '#A830E8',
  '/motorista': '#FFB800',
  '/franqueado': '#FFB800',
};

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const accent = accentColor[pathname] || '#A830E8';

  return (
    <nav className="sticky top-0 z-50" style={{ backdropFilter: 'blur(16px)', background: 'linear-gradient(135deg, rgba(224,112,255,0.92) 0%, rgba(160,32,240,0.95) 50%, rgba(91,15,168,0.97) 100%)', borderBottom: '1px solid rgba(224,112,255,0.2)' }}>
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="BibCar"
            width={180}
            height={66}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide transition-colors duration-200"
                style={{ color: isActive ? accent : 'rgba(255,255,255,0.75)' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = accent; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = isActive ? accent : 'rgba(255,255,255,0.75)'; }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <a
          href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115"
          target="_blank"
          rel="noopener"
          className="hidden md:inline-flex items-center font-black text-sm px-6 py-3 rounded-full uppercase tracking-wide transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#FFB800,#FF9500,#FF7A00)', color: '#1a0f00', boxShadow: '0 8px 24px rgba(255,149,0,.3)' }}
        >
          Baixar o app
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2"
          aria-label="Menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className="block h-0.5 rounded transition-all duration-300" style={{ background: 'rgba(255,255,255,0.85)', transform: open ? 'rotate(45deg) translateY(8px)' : 'none' }} />
            <span className="block h-0.5 rounded transition-all duration-300" style={{ background: 'rgba(255,255,255,0.85)', opacity: open ? 0 : 1 }} />
            <span className="block h-0.5 rounded transition-all duration-300" style={{ background: 'rgba(255,255,255,0.85)', transform: open ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
          </div>
        </button>
      </div>

      {open && (
        <div
          className="md:hidden overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(224,112,255,0.97) 0%, rgba(160,32,240,0.98) 50%, rgba(91,15,168,1) 100%)',
            borderTop: '1px solid rgba(224,112,255,0.2)',
            animation: 'navSlideDown 0.25s ease forwards',
          }}
        >
          <div className="container py-6 flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-semibold transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115"
              target="_blank"
              rel="noopener"
              className="btn-gold text-center justify-center mt-2"
            >
              Baixar o app
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
