import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Franquia de Mobilidade Urbana — Seja um Franqueado BibCar',
  description:
    'Quer abrir uma franquia de mobilidade urbana? A BibCar oferece modelo de negócio validado, tecnologia inclusa, exclusividade de praça e suporte completo. Leve o app de transporte para a sua cidade.',
  keywords: [
    'franquia de mobilidade urbana',
    'franquia de transporte por aplicativo',
    'franquia de aplicativo de transporte',
    'como abrir uma franquia de transporte',
    'investir em franquia',
    'franquia de baixo investimento',
    'franquia BibCar',
    'ser franqueado BibCar',
    'oportunidade de negócio mobilidade urbana',
  ],
  alternates: { canonical: '/franqueado' },
  openGraph: {
    title: 'Franquia de Mobilidade Urbana — Seja um Franqueado BibCar',
    description:
      'Modelo de negócio validado, tecnologia inclusa, exclusividade de praça e suporte completo. Abra uma franquia de mobilidade urbana BibCar na sua cidade.',
    url: 'https://bibcarbrasil.com.br/franqueado',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Franquia de Mobilidade Urbana BibCar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Franquia de Mobilidade Urbana — Franqueado BibCar',
    description:
      'Modelo validado, tecnologia inclusa e exclusividade de praça. Leve a BibCar para a sua cidade.',
    images: ['/logo.png'],
  },
};

const franchiseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Franquia de mobilidade urbana',
  name: 'Franquia BibCar — Mobilidade Urbana',
  description:
    'Oportunidade de franquia de mobilidade urbana com modelo de negócio validado, plataforma tecnológica completa (app de passageiro e motorista + painel de gestão), exclusividade de praça, treinamento e suporte operacional e de marketing.',
  url: 'https://bibcarbrasil.com.br/franqueado',
  areaServed: 'BR',
  provider: {
    '@type': 'Organization',
    name: 'BibCar',
    url: 'https://bibcarbrasil.com.br',
    logo: 'https://bibcarbrasil.com.br/logo.png',
  },
  audience: {
    '@type': 'BusinessAudience',
    name: 'Empreendedores e investidores',
  },
  offers: {
    '@type': 'Offer',
    category: 'Franquia',
    availability: 'https://schema.org/InStock',
    areaServed: 'BR',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quanto preciso investir para abrir uma franquia da BibCar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O investimento varia conforme o tamanho da praça e o pacote escolhido. A BibCar trabalha com um modelo enxuto e de baixo custo de estrutura, já que toda a tecnologia está inclusa. Fale com nossa equipe pelo formulário para receber os valores atualizados para a sua cidade.',
      },
    },
    {
      '@type': 'Question',
      name: 'O que está incluído na franquia de mobilidade urbana da BibCar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Você recebe a plataforma tecnológica completa (app de passageiro, app de motorista e painel de gestão), treinamento completo, material de marketing, suporte operacional contínuo da matriz e exclusividade de praça na sua região.',
      },
    },
    {
      '@type': 'Question',
      name: 'Preciso ter experiência com transporte ou tecnologia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. O modelo da BibCar foi desenhado para quem está começando do zero. Você recebe treinamento completo, manual de operação e suporte contínuo da matriz para operar com segurança desde o primeiro dia.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quanto tempo leva para lançar a BibCar na minha cidade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Após a análise de praça e a assinatura do contrato, o onboarding e o treinamento começam rapidamente. O prazo até o lançamento depende da preparação da operação local, e a matriz acompanha cada etapa até a sua cidade entrar no mapa.',
      },
    },
    {
      '@type': 'Question',
      name: 'A franquia tem exclusividade de praça?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Cada franqueado opera com exclusividade na sua região, sem concorrência de outro franqueado BibCar na mesma praça.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como funciona o suporte da matriz BibCar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Você conta com suporte operacional contínuo, acesso ao grupo de franqueados, participação em campanhas nacionais e apoio de marketing e tecnologia durante toda a operação.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: 'https://bibcarbrasil.com.br',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Franquia de Mobilidade Urbana',
      item: 'https://bibcarbrasil.com.br/franqueado',
    },
  ],
};

export default function FranqueadoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(franchiseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
