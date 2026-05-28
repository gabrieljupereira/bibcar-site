'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingOrbs from '@/components/FloatingOrbs';
import ClientCarViewer from '@/components/ClientCarViewer';

const heroVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: '#FFFFFF', border: `1.5px solid ${open ? 'rgba(193,62,255,0.35)' : 'rgba(0,0,0,0.08)'}` }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-7 py-5">
        <span className="font-bold text-sm md:text-base" style={{ color: '#111' }}>{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex-shrink-0"
          style={{ color: '#C13EFF', fontSize: 22, fontWeight: 300, display: 'inline-block' }}
        >+</motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-7 pb-5 text-sm leading-relaxed" style={{ color: '#555', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <p className="pt-4">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const featureIcons: Record<string, React.ReactNode> = {
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  heart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  pin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  bolt: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

const features = [
  { iconKey: 'shield', color: '#FFD23F', title: 'Motorista verificado', desc: 'Todos passam por análise de CNH, CRLV e antecedentes criminais. Nada de clandestino.' },
  { iconKey: 'heart', color: '#FF2D8E', title: 'Bib Delas', desc: 'Programa especial com mais cuidado e atenção para as passageiras da BibCar.' },
  { iconKey: 'pin', color: '#C13EFF', title: 'Da sua cidade', desc: 'Equipe e motoristas que conhecem as ruas onde você anda de verdade.' },
  { iconKey: 'bolt', color: '#FF9500', title: 'Tecnologia de ponta', desc: 'Plataforma robusta por trás da operação. Rápida, confiável, escalável.' },
];

const cities = [
  { name: 'Fernandópolis · SP', active: true },
  { name: 'Votuporanga · SP', active: true },
  { name: 'Muriaé · MG', active: true },
  { name: 'Manhuaçu · MG', active: true },
  { name: 'Viçosa · MG', active: true },
  { name: 'Sete Lagoas · MG', active: true },
];

export default function Home() {
  return (
    <>
      {/* Campaign Banner */}
      <div
        className="relative text-center font-bold text-sm py-3 px-4 tracking-wide"
        style={{
          background: 'linear-gradient(90deg,#FFB627,#FFD23F,#FF9500,#FFD23F)',
          backgroundSize: '300% 100%',
          animation: 'campaign-slide 8s linear infinite',
          color: '#1a0f00',
          zIndex: 10,
        }}
      >
        <a href="https://www.bibcarbrasil.com.br/chamou-a-bibcar-chamou-a-sorte" target="_blank" rel="noopener" style={{ color: 'inherit' }}>
          🍀 <strong>CHAMOU A BIBCAR, CHAMOU A SORTE</strong> — 4 MOTOS ZERO KM · 3 IPHONES · R$ 12 MIL NO PIX · <u>SAIBA MAIS →</u>
        </a>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden flex items-start md:items-center" style={{ minHeight: '92vh' }}>
        <FloatingOrbs variant="home" className="absolute inset-0" style={{ zIndex: 0 }} />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(247,245,255,0.88) 0%, rgba(247,245,255,0.55) 60%, transparent 100%)',
            zIndex: 1,
          }}
        />
        <div className="container relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center pt-20 pb-10 md:py-28" style={{ zIndex: 2 }}>
          <motion.div variants={heroVariants} initial="hidden" animate="show">
            <motion.div variants={heroItem} className="tag mb-6 inline-flex" style={{ fontSize: "clamp(8.5px, 2.5vw, 11px)", letterSpacing: "clamp(0.2px, 0.1vw, 2px)", padding: "clamp(5px, 1.5vw, 7px) clamp(10px, 4vw, 18px)" }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C13EFF', boxShadow: '0 0 10px #C13EFF', animation: 'blink 1.5s infinite', flexShrink: 0 }} />
              <span className="sm:hidden">Mobilidade Urbana</span>
              <span className="hidden sm:inline">Mobilidade Urbana · Brasil</span>
            </motion.div>
            <motion.h1 variants={heroItem} className="bebas mb-6" style={{ fontSize: 'clamp(64px, 10vw, 120px)', lineHeight: 0.92, letterSpacing: '-1px' }}>
              Vai de{' '}
              <span className="purple-text">BibCar.</span>
            </motion.h1>
            <motion.p variants={heroItem} className="text-silver mb-10 max-w-lg" style={{ fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.6 }}>
              Motoristas verificados, da sua cidade, app rápido. Mais segurança pra quem anda. Mais ganho pra quem dirige. Mais oportunidade pra quem empreende.
            </motion.p>
            <motion.div variants={heroItem} className="flex flex-col md:flex-row md:flex-wrap gap-4">
              <Link href="/passageiro" className="btn-gold">Pedir uma corrida</Link>
              <Link href="/motorista" className="btn-purple">Sou motorista</Link>
              <Link href="/franqueado" className="btn-ghost">Quero ser franqueado</Link>
            </motion.div>
          </motion.div>

          <div className="flex justify-center items-center relative h-[320px] md:h-[480px]">
            <ClientCarViewer
              modelPath="/car.glb"
              bodyColor="#7F00FF"
              style={{ width: '100%', height: '100%' }}
            />
            <p
              className="absolute bottom-2 left-0 right-0 text-center"
              style={{ fontSize: 10, color: 'rgba(165,176,189,0.4)', letterSpacing: 2, textTransform: 'uppercase', pointerEvents: 'none' }}
            >
              <span className="md:hidden">Toque para girar</span>
              <span className="hidden md:inline">Arraste para girar · Scroll para zoom</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3 PATHS */}
      <section className="section" style={{ background: 'linear-gradient(180deg,#F7F5FF 0%,#EDE9FF 100%)' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-16 max-w-2xl mx-auto">
            <div className="tag tag-gold mb-5 inline-flex">Escolha o seu caminho</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(40px, 5.5vw, 68px)' }}>
              Três jeitos de andar{' '}
              <span className="gold-text">com a BibCar</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              Seja pra se locomover, gerar renda ou montar seu negócio — a BibCar é da sua cidade.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🚗',
                title: 'Passageiro',
                lead: 'Peça sua corrida em segundos, com motorista verificado, da sua cidade.',
                items: ['Motoristas verificados', 'Corrida rastreada ao vivo', 'Tarifa transparente', 'Suporte local'],
                href: '/passageiro',
                btnClass: 'btn-gold',
                btnLabel: 'Quero pedir corridas',
                borderTop: 'linear-gradient(90deg,#FFD23F,#FF9500)',
                hoverShadow: '0 20px 60px rgba(255,180,55,.28)',
              },
              {
                icon: '🤝',
                title: 'Motorista',
                lead: 'Rode com a BibCar e ganhe mais perto de casa, com parceria de verdade.',
                items: ['Cadastro simples e rápido', 'Ganho melhor por corrida', 'Flexibilidade total', 'Suporte falando de igual'],
                href: '/motorista',
                btnClass: 'btn-purple',
                btnLabel: 'Quero ser motorista',
                borderTop: 'linear-gradient(90deg,#C13EFF,#A930F0)',
                hoverShadow: '0 20px 60px rgba(169,48,240,.32)',
              },
              {
                icon: '💎',
                title: 'Franqueado',
                lead: 'Leve a BibCar pra sua cidade. Modelo provado, suporte completo, marca forte.',
                items: ['Modelo de negócio validado', 'Suporte de marketing', 'Tecnologia inclusa', 'Exclusividade de praça'],
                href: '/franqueado',
                btnClass: 'btn-gold',
                btnLabel: 'Quero ser franqueado',
                borderTop: 'linear-gradient(90deg,#FFD23F,#C13EFF)',
                hoverShadow: '0 20px 60px rgba(255,180,55,.2)',
              },
            ].map((path, i) => (
              <ScrollReveal key={path.title} delay={i * 0.12}>
                <div
                  className="rounded-3xl p-10 relative overflow-hidden transition-all duration-300 h-full flex flex-col"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = path.hoverShadow;
                    (e.currentTarget as HTMLElement).style.borderColor = '#3a3a52';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.borderColor = '#232336';
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{ background: path.borderTop }} />
                  <div className="text-4xl mb-6 mt-2">{path.icon}</div>
                  <h3 className="bebas text-4xl mb-3">{path.title}</h3>
                  <p className="text-silver text-sm mb-6 leading-relaxed">{path.lead}</p>
                  <ul className="mb-8 flex-1">
                    {path.items.map((item) => (
                      <li key={item} className="py-2.5 text-sm" style={{ color: '#374151', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                        <span className="mr-2" style={{ color: '#FF9500' }}>›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={path.href} className={`${path.btnClass} justify-center text-center`}>
                    {path.btnLabel}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE BIBCAR */}
      <section className="section" style={{ background: '#EDE9FF' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-2xl mx-auto">
            <div className="tag mb-5 inline-flex">Por que BibCar</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(38px, 5vw, 64px)' }}>
              Segurança não é detalhe.{' '}
              <span className="purple-text">É o ponto de partida.</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              Tudo na BibCar foi pensado pra você chegar bem — e voltar também.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-8 text-center transition-all duration-300 cursor-default"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(193,62,255,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(168,48,232,0.07)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1f1f2e';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <div
                    className="mb-4 w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}44`, color: feat.color }}
                  >
                    {featureIcons[feat.iconKey]}
                  </div>
                  <h3 className="bebas text-2xl mb-2">{feat.title}</h3>
                  <p className="text-silver text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BIB DELAS */}
      <section id="delas" className="section relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#F0EAFF 0%,#EDE9FF 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%,rgba(232,38,122,.12),transparent 50%)' }} />
        <div className="container relative text-center max-w-3xl mx-auto" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <div className="tag tag-pink mb-6 inline-flex">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF2D8E', boxShadow: '0 0 10px #FF2D8E', animation: 'blink 1.5s infinite' }} />
              Bib Delas
            </div>
            <h2 className="bebas mb-5" style={{ fontSize: 'clamp(44px, 6vw, 80px)' }}>
              Feito com <span className="pink-text">cuidado</span> para elas.
            </h2>
            <p className="text-silver mb-8 mx-auto" style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 580 }}>
              O Bib Delas é o jeito da BibCar olhar com mais atenção para a segurança das passageiras. Porque toda mulher merece chegar tranquila — de dia ou de noite.
            </p>
            <a href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115" target="_blank" rel="noopener" className="btn-rose">
              Conhecer o Bib Delas
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* VS CLANDESTINO */}
      <section className="section" style={{ background: '#F7F5FF' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-2xl mx-auto">
            <div className="tag tag-gold mb-5 inline-flex">A diferença que importa</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}>
              BibCar ou clandestino?{' '}
              <span className="gold-text">A diferença aparece quando algo dá errado.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden" style={{ border: '1px solid #232336' }}>
              <div className="p-12" style={{ background: 'linear-gradient(160deg,rgba(155,39,216,.1),rgba(168,48,232,.04) 50%,#FFFFFF)' }}>
                <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: 'linear-gradient(135deg,#FFD23F,#FF9500)', color: '#1a0f00' }}>
                  Com a BibCar
                </span>
                <h3 className="bebas text-4xl mb-6">Você sabe <span style={{ color: '#FF9500' }}>com quem está</span></h3>
                <ul className="space-y-4">
                  {['Motorista com cadastro verificado', 'Corrida registrada e rastreada no app', 'Suporte pra resolver qualquer problema', 'Tarifa combinada antes de embarcar'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px]">
                      <span style={{ color: '#FFD23F', fontWeight: 900, fontSize: 18, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-12" style={{ background: '#F5F3FF' }}>
                <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: '#FFE8E8', color: '#C0392B' }}>
                  No clandestino
                </span>
                <h3 className="bebas text-4xl mb-6">Você embarca no escuro</h3>
                <ul className="space-y-4">
                  {['Sem cadastro, sem verificação', 'Sem registro da corrida', 'Sem suporte se acontecer algo', 'Preço incerto, combinado na hora'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-silver/70">
                      <span style={{ color: '#C0392B', fontWeight: 900, fontSize: 18, flexShrink: 0 }}>✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* LIDERANÇA */}
      <section className="section text-center" style={{ background: 'linear-gradient(180deg,#F7F5FF 0%,#EDE9FF 100%)' }}>
        <div className="container max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="tag tag-gold mb-8 inline-flex">Liderança</div>
            <div
              className="mx-auto mb-7 overflow-hidden"
              style={{ width: 180, height: 180, borderRadius: '50%', border: '3px solid #FFD23F', boxShadow: '0 0 0 6px rgba(255,210,63,.14), 0 20px 40px rgba(193,62,255,.3)' }}
            >
              <Image src="/thales.jpg" alt="Thales Alexandre" width={180} height={180} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            <h3 className="bebas text-4xl mb-1">Thales Alexandre</h3>
            <p className="text-gold text-xs font-black uppercase tracking-widest mb-7">C.O. BibCar Brasil</p>
            <blockquote className="text-lg leading-relaxed italic max-w-xl mx-auto" style={{ color: '#100D24', position: 'relative' }}>
              <span className="absolute -top-8 -left-2 text-7xl opacity-40" style={{ color: '#A830E8', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
              A BibCar nasceu pra ser diferente. Mais perto da cidade, mais perto do motorista, mais perto de quem precisa chegar bem. Mobilidade de verdade, feita por gente de verdade.
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* CIDADES */}
      <section className="section" style={{ background: '#EDE9FF' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-12 max-w-xl mx-auto">
            <div className="tag mb-5 inline-flex">Onde a BibCar opera</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(38px, 5vw, 62px)' }}>
              A gente <span className="gold-text">tá expandindo</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              Cidades que já andam de BibCar. Sua cidade ainda não tá aqui? Vire franqueado.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all"
                  style={{
                    border: city.active ? '1.5px solid #FFD23F' : '1.5px solid #2a2a40',
                    color: city.active ? '#FF9500' : '#94A3B8',
                    background: city.active ? 'rgba(255,184,0,0.1)' : 'rgba(0,0,0,0.04)',
                    boxShadow: city.active ? '0 0 20px rgba(255,210,63,0.15)' : 'none',
                  }}
                >
                  {city.name}
                </div>
              ))}
              <div className="px-6 py-3 rounded-full font-bold text-sm text-silver/60" style={{ border: '1.5px dashed rgba(0,0,0,0.2)' }}>
                + em expansão
              </div>
            </div>
            <p className="text-center text-silver text-sm mt-4">
              Sua cidade não tá no mapa?{' '}
              <Link href="/franqueado" className="font-bold underline" style={{ color: '#FF9500' }}>
                Vire franqueado e leve a BibCar até ela →
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="section" style={{ background: '#EDE9FF' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-xl mx-auto">
            <div className="tag mb-5 inline-flex">Quem já usou aprovou</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}>
              O que dizem os <span className="purple-text">nossos usuários</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ana Paula S.',
                city: 'Fernandópolis · SP',
                role: 'Passageira',
                stars: 5,
                text: 'Uso todo dia pra ir ao trabalho. O motorista sempre é pontual e educado. Me sinto muito mais segura do que no clandestino.',
                color: '#C13EFF',
              },
              {
                name: 'Carlos Eduardo M.',
                city: 'Votuporanga · SP',
                role: 'Motorista parceiro',
                stars: 5,
                text: 'Comecei há 4 meses e já consigo uma renda muito melhor. O suporte da BibCar é diferente — eles realmente falam de igual pra igual.',
                color: '#FFB800',
              },
              {
                name: 'Fernanda L.',
                city: 'Muriaé · MG',
                role: 'Passageira',
                stars: 5,
                text: 'Ótimo app, corrida rastreada e tarifa combinada antes. Nunca tive surpresa no valor. Recomendo pra todo mundo!',
                color: '#FF2D8E',
              },
            ].map((dep, i) => (
              <ScrollReveal key={dep.name} delay={i * 0.12}>
                <div className="rounded-3xl p-8 h-full flex flex-col" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: dep.stars }).map((_, s) => (
                      <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#FFB800">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: '#374151' }}>&ldquo;{dep.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: dep.color }}>
                      {dep.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#111' }}>{dep.name}</p>
                      <p className="text-xs" style={{ color: '#888' }}>{dep.role} · {dep.city}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: '#F7F5FF' }}>
        <div className="container max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <div className="tag mb-5 inline-flex">Dúvidas frequentes</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}>
              Perguntas <span className="gold-text">frequentes</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-col gap-3">
              {[
                { q: 'Como faço para pedir uma corrida?', a: 'Baixe o app BibCar, crie sua conta, informe o destino e confirme. Em segundos um motorista verificado aceitará a sua corrida.' },
                { q: 'Como me cadastro como motorista?', a: 'Acesse a página "Motorista", preencha o formulário ou fale pelo WhatsApp. Você precisará de CNH, CRLV e documento com foto. A aprovação é rápida.' },
                { q: 'Como funciona o pagamento?', a: 'A tarifa é calculada e mostrada antes de você confirmar a corrida — sem surpresas. Aceitamos PIX, cartão de crédito/débito e dinheiro.' },
                { q: 'O que é o Bib Delas?', a: 'Programa especial para passageiras com foco em segurança e conforto. Conta com motoristas selecionados e suporte dedicado para as usuárias.' },
                { q: 'Posso ser franqueado na minha cidade?', a: 'Sim! Se sua cidade ainda não tem BibCar, você pode levar a marca pra lá. Acesse a página "Franqueado" e entre em contato com nossa equipe.' },
                { q: 'Como funciona a verificação dos motoristas?', a: 'Todo motorista passa por análise de CNH, CRLV, certidão de antecedentes criminais e entrevista antes de começar a operar.' },
              ].map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="section text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(193,62,255,.3),transparent 70%),radial-gradient(ellipse at 50% 0%,rgba(255,184,0,.15),transparent 60%),#F7F5FF' }}
      >
        <div className="container max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(52px, 9vw, 108px)', lineHeight: 0.95 }}>
              Vai de <span className="gold-text">BibCar.</span>
            </h2>
            <p className="text-silver mb-10" style={{ fontSize: 18 }}>Baixe o app e peça sua primeira corrida agora.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {/* App Store */}
              <a
                href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115"
                target="_blank" rel="noopener"
                className="flex items-center gap-4 rounded-2xl transition-all hover:-translate-y-1"
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.1)', padding: '14px 28px', minWidth: 210 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#FFD23F'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(255,180,55,.2)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#111111">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>
                  <small className="block text-[11px] uppercase tracking-wider" style={{ color: '#888' }}>Baixe na</small>
                  <strong className="font-bold text-base" style={{ color: '#111' }}>App Store</strong>
                </span>
              </a>
              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.passenger.drivermachine"
                target="_blank" rel="noopener"
                className="flex items-center gap-4 rounded-2xl transition-all hover:-translate-y-1"
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.1)', padding: '14px 28px', minWidth: 210 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#FFD23F'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(255,180,55,.2)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M3.5 23.5a2 2 0 01-1.5-2V2.5A2 2 0 013.5.5L14 12z"/>
                  <path fill="#FBBC05" d="M20.5 10.27L17.2 8.4 14 12l3.2 3.6 3.3-1.87A2 2 0 0021.5 12a2 2 0 00-1-1.73z"/>
                  <path fill="#4285F4" d="M14 12L3.5 23.5c.15.1.34.5.5.5.42 0 .82-.11 1.16-.31L17.2 15.6z"/>
                  <path fill="#34A853" d="M14 12L5.16.31A2.08 2.08 0 004 0c-.16 0-.35.4-.5.5L14 12z"/>
                </svg>
                <span>
                  <small className="block text-[11px] uppercase tracking-wider" style={{ color: '#888' }}>Baixe no</small>
                  <strong className="font-bold text-base" style={{ color: '#111' }}>Google Play</strong>
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}