import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passageiro — Peça sua corrida com segurança',
  description: 'Peça sua corrida com motoristas verificados da sua cidade. Rastreamento ao vivo, tarifa transparente e suporte local. Baixe o app BibCar.',
  openGraph: {
    title: 'BibCar Passageiro — Corridas seguras na sua cidade',
    description: 'Motoristas verificados, corrida rastreada e tarifa combinada antes de embarcar. Vai de BibCar.',
    url: 'https://bibcarbrasil.com.br/passageiro',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'BibCar Passageiro' }],
  },
};

export default function PassageiroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
