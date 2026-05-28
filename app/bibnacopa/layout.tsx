import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BibNaCopa — 30% OFF na hora do jogo',
  description: '30% de desconto em todas as corridas durante os jogos do Brasil na Copa do Mundo 2026. Vai na torcida, a BibCar te leva.',
  openGraph: {
    title: 'BibNaCopa ⚽ — 30% OFF na hora do jogo do Brasil',
    description: '30% de desconto automático em todas as corridas durante os jogos do Brasil. Baixe o app e aproveite.',
    url: 'https://bibcarbrasil.com.br/bibnacopa',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'BibNaCopa - 30% OFF Copa 2026' }],
  },
};

export default function BibNaCopaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
