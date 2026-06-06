import type { Metadata } from 'next';
import '@/styles/globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ClientParticles from '@/components/ClientParticles';

export const metadata: Metadata = {
  title: {
    default: 'BibCar · Mobilidade Urbana — Vai de BibCar',
    template: '%s · BibCar',
  },
  description: 'A mobilidade urbana da sua cidade. Motoristas verificados, app rápido, tarifa transparente. Passageiro, motorista ou franqueado: comece agora.',
  metadataBase: new URL('https://bibcarbrasil.com.br'),
  alternates: { canonical: '/' },
  keywords: [
    'BibCar',
    'app de transporte',
    'mobilidade urbana',
    'motorista de aplicativo',
    'corrida segura',
    'franquia de mobilidade urbana',
    'franquia de transporte por aplicativo',
    'franquia de aplicativo de transporte',
    'como abrir uma franquia de transporte',
    'investir em franquia de mobilidade',
    'franquia de baixo investimento',
  ],
  openGraph: {
    title: 'BibCar · Mobilidade Urbana — Vai de BibCar',
    description: 'A mobilidade urbana da sua cidade. Motoristas verificados, tarifa transparente e suporte local.',
    url: 'https://bibcarbrasil.com.br',
    siteName: 'BibCar',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'BibCar - Mobilidade Urbana' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BibCar · Mobilidade Urbana',
    description: 'A mobilidade urbana da sua cidade. Vai de BibCar.',
    images: ['/logo.png'],
  },
  icons: { icon: '/favicon.png' },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BibCar',
  legalName: 'BibCar Brasil',
  url: 'https://bibcarbrasil.com.br',
  logo: 'https://bibcarbrasil.com.br/logo.png',
  description:
    'BibCar é uma plataforma de mobilidade urbana com modelo de franquia regional: corridas seguras com motoristas verificados e oportunidade de franquia para empreendedores em todo o Brasil.',
  areaServed: 'BR',
  slogan: 'Vai de BibCar',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+55-31-99967-3773',
    areaServed: 'BR',
    availableLanguage: 'Portuguese',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ClientParticles />
        <Nav />
        <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
