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
  description: 'A mobilidade urbana da sua cidade. Motoristas verificados, app rápido. Passageiro, motorista ou franqueado: comece agora.',
  metadataBase: new URL('https://bibcarbrasil.com.br'),
  openGraph: {
    title: 'BibCar · Mobilidade Urbana',
    description: 'A mobilidade urbana da sua cidade. Vai de BibCar.',
    url: 'https://bibcarbrasil.com.br',
    siteName: 'BibCar',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark text-white overflow-x-hidden">
        <ClientParticles />
        <Nav />
        <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
