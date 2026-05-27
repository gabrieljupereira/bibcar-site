'use client';

import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingOrbs from '@/components/FloatingOrbs';
import ClientCarViewer from '@/components/ClientCarViewer';

const features = [
  { icon: '🛡️', title: 'Motorista verificado', desc: 'Todos passam por análise de CNH, CRLV e antecedentes criminais. Nada de clandestino.' },
  { icon: '💜', title: 'Bib Delas', desc: 'Programa especial com mais cuidado e atenção para as passageiras da BibCar.' },
  { icon: '📍', title: 'Da sua cidade', desc: 'Equipe e motoristas que conhecem as ruas onde você anda de verdade.' },
  { icon: '⚡', title: 'Tecnologia de ponta', desc: 'Plataforma robusta por trás da operação. Rápida, confiável, escalável.' },
];

const cities = [
  { name: 'Fernandópolis · SP', active: true },
  { name: 'Votuporanga · SP', active: true },
  { name: 'Muriaé · MG', active: false },
  { name: 'Manhuaçu · MG', active: false },
  { name: 'Viçosa · MG', active: false },
  { name: 'Sete Lagoas · MG', active: false },
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
      <section className="relative overflow-hidden" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <FloatingOrbs variant="home" className="absolute inset-0" style={{ zIndex: 0 }} />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(7,7,7,0.82) 0%, rgba(7,7,7,0.55) 60%, transparent 100%)',
            zIndex: 1,
          }}
        />
        <div className="container relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-28" style={{ zIndex: 2 }}>
          <div>
            <div className="tag mb-8 inline-flex">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C13EFF', boxShadow: '0 0 10px #C13EFF', animation: 'blink 1.5s infinite' }} />
              Mobilidade Urbana · Brasil
            </div>
            <h1 className="bebas mb-6" style={{ fontSize: 'clamp(64px, 10vw, 120px)', lineHeight: 0.92, letterSpacing: '-1px' }}>
              Vai de{' '}
              <span className="purple-text">BibCar.</span>
            </h1>
            <p className="text-silver mb-10 max-w-lg" style={{ fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.6 }}>
              Motoristas verificados, da sua cidade, app rápido. Mais segurança pra quem anda. Mais ganho pra quem dirige. Mais oportunidade pra quem empreende.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/passageiro" className="btn-gold">Pedir uma corrida</Link>
              <Link href="/motorista" className="btn-purple">Sou motorista</Link>
              <Link href="/franqueado" className="btn-ghost">Quero ser franqueado</Link>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center relative" style={{ height: 480 }}>
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 50% 60%, rgba(193,62,255,0.3), transparent 70%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />
            <ClientCarViewer
              modelPath="/car.glb"
              bodyColor="#5C0F8B"
              style={{ width: '100%', height: '100%' }}
            />
            <p
              className="absolute bottom-2 left-0 right-0 text-center"
              style={{ fontSize: 10, color: 'rgba(165,176,189,0.4)', letterSpacing: 2, textTransform: 'uppercase', pointerEvents: 'none' }}
            >
              Arraste para girar · Scroll para zoom
            </p>
          </div>
        </div>
      </section>

      {/* 3 PATHS */}
      <section className="section" style={{ background: 'linear-gradient(180deg,#070707 0%,#0c0814 100%)' }}>
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
                  style={{ background: '#141420', border: '1px solid #232336' }}
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
                      <li key={item} className="py-2.5 text-sm" style={{ color: '#cfcfdc', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="mr-2" style={{ color: '#FFD23F' }}>›</span>
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
      <section className="section" style={{ background: '#0F0F12' }}>
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
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid #1f1f2e' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(193,62,255,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(193,62,255,0.06)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1f1f2e';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <div
                    className="text-3xl mb-4 w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(255,210,63,.15),rgba(193,62,255,.15))', border: '1px solid rgba(255,210,63,.25)' }}
                  >
                    {feat.icon}
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
      <section id="delas" className="section relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1d0d28 0%,#0a0612 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%,rgba(255,45,142,.18),transparent 50%)' }} />
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
      <section className="section" style={{ background: '#070707' }}>
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
              <div className="p-12" style={{ background: 'linear-gradient(160deg,rgba(169,48,240,.18),rgba(193,62,255,.05) 50%,#141420)' }}>
                <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: 'linear-gradient(135deg,#FFD23F,#FF9500)', color: '#1a0f00' }}>
                  Com a BibCar
                </span>
                <h3 className="bebas text-4xl mb-6">Você sabe <span style={{ color: '#FFD23F' }}>com quem está</span></h3>
                <ul className="space-y-4">
                  {['Motorista com cadastro verificado', 'Corrida registrada e rastreada no app', 'Suporte pra resolver qualquer problema', 'Tarifa combinada antes de embarcar'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px]">
                      <span style={{ color: '#FFD23F', fontWeight: 900, fontSize: 18, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-12" style={{ background: '#0e0e16' }}>
                <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: '#3a1f1f', color: '#e0a0a0' }}>
                  No clandestino
                </span>
                <h3 className="bebas text-4xl mb-6">Você embarca no escuro</h3>
                <ul className="space-y-4">
                  {['Sem cadastro, sem verificação', 'Sem registro da corrida', 'Sem suporte se acontecer algo', 'Preço incerto, combinado na hora'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-silver/70">
                      <span style={{ color: '#c0654f', fontWeight: 900, fontSize: 18, flexShrink: 0 }}>✕</span>
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
      <section className="section text-center" style={{ background: 'linear-gradient(180deg,#070707 0%,#0c0814 100%)' }}>
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
            <blockquote className="text-lg leading-relaxed italic max-w-xl mx-auto" style={{ color: '#F5F5F0', position: 'relative' }}>
              <span className="absolute -top-8 -left-2 text-7xl opacity-40" style={{ color: '#C13EFF', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
              A BibCar nasceu pra ser diferente. Mais perto da cidade, mais perto do motorista, mais perto de quem precisa chegar bem. Mobilidade de verdade, feita por gente de verdade.
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* CIDADES */}
      <section className="section" style={{ background: '#0F0F12' }}>
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
                    color: city.active ? '#FFD23F' : '#A5B0BD',
                    background: city.active ? 'rgba(255,210,63,0.08)' : 'rgba(255,255,255,0.02)',
                    boxShadow: city.active ? '0 0 20px rgba(255,210,63,0.15)' : 'none',
                  }}
                >
                  {city.name}
                </div>
              ))}
              <div className="px-6 py-3 rounded-full font-bold text-sm text-silver/60" style={{ border: '1.5px dashed #2a2a40' }}>
                + em expansão
              </div>
            </div>
            <p className="text-center text-silver text-sm mt-4">
              Sua cidade não tá no mapa?{' '}
              <Link href="/franqueado" className="font-bold underline" style={{ color: '#FFD23F' }}>
                Vire franqueado e leve a BibCar até ela →
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="section text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(193,62,255,.3),transparent 70%),radial-gradient(ellipse at 50% 0%,rgba(255,210,63,.15),transparent 60%),#070707' }}
      >
        <div className="container max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(52px, 9vw, 108px)', lineHeight: 0.95 }}>
              Vai de <span className="gold-text">BibCar.</span>
            </h2>
            <p className="text-silver mb-10" style={{ fontSize: 18 }}>Baixe o app e peça sua primeira corrida agora.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { icon: '🍎', small: 'Baixe na', strong: 'App Store', href: 'https://apps.apple.com/br/app/bib-car-brasil/id6444271115' },
                { icon: '▶', small: 'Baixe no', strong: 'Google Play', href: 'https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.passenger.drivermachine' },
              ].map((store) => (
                <a
                  key={store.strong}
                  href={store.href}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-4 rounded-2xl transition-all hover:-translate-y-1"
                  style={{ background: '#0f0f18', border: '1.5px solid #2a2a40', padding: '14px 28px', minWidth: 210 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#FFD23F';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(255,180,55,.2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#2a2a40';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: 28 }}>{store.icon}</span>
                  <span>
                    <small className="block text-silver text-[11px] uppercase tracking-wider">{store.small}</small>
                    <strong className="text-white font-bold text-base">{store.strong}</strong>
                  </span>
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
