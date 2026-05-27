import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Franqueado — Leve a BibCar para sua cidade',
  description: 'Modelo de negócio validado, suporte completo, tecnologia inclusa e exclusividade de praça. Empreenda com a BibCar na sua cidade.',
  openGraph: {
    title: 'BibCar Franqueado — Empreenda. Expanda. Lidere.',
    description: 'Leve a BibCar pra sua cidade. Modelo de negócio validado, suporte completo e tecnologia de ponta.',
    url: 'https://bibcarbrasil.com.br/franqueado',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'BibCar Franqueado' }],
  },
};

export default function FranqueadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
