import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Motorista — Ganhe mais perto de casa',
  description: 'Rode com a BibCar e ganhe mais perto de casa. Cadastro simples, ganho melhor por corrida, flexibilidade total e suporte de verdade.',
  openGraph: {
    title: 'BibCar Motorista — Mais ganho, mais perto de casa',
    description: 'Cadastro simples e rápido, ganho melhor por corrida e flexibilidade total. Seja um motorista BibCar.',
    url: 'https://bibcarbrasil.com.br/motorista',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'BibCar Motorista' }],
  },
};

export default function MotoristaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
