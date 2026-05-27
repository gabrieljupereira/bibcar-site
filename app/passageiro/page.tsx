'use client';

import Link from 'next/link';
import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingOrbs from '@/components/FloatingOrbs';

const steps = [
  { num: '01', icon: '📱', title: 'Baixe o app', desc: 'Disponível no iOS e Android. Grátis, rápido, sem complicação. Cadastre-se em menos de 2 minutos.' },
  { num: '02', icon: '📍', title: 'Informe o destino', desc: 'Digite pra onde vai. O app calcula a rota e mostra o preço antes de você confirmar a corrida.' },
  { num: '03', icon: '🚗', title: 'Seu motorista chega', desc: 'Um parceiro verificado aceita sua corrida. Você acompanha em tempo real até chegar ao seu destino.' },
];

const security = [
  { icon: '🛡️', title: 'Motorista verificado', desc: 'Todos passam por análise de cadastro, CNH, CRLV e antecedentes criminais. Zero clandestino.' },
  { icon: '📍', title: 'Corrida rastreada', desc: 'Rota registrada do início ao fim no app. Você e seus contatos sabem onde está.' },
  { icon: '💬', title: 'Suporte local', desc: 'Nossa equipe está na sua cidade pra resolver qualquer problema rapidinho.' },
  { icon: '💳', title: 'Pagamento seguro', desc: 'Cartão de crédito, débito ou Pix no app. Sem dinheiro em espécie obrigatório.' },
];

const faq = [
  {
    q: 'Como faço para pedir uma corrida?',
    a: 'Baixe o app BibCar, faça seu cadastro, informe seu ponto de partida e destino. Em segundos, um motorista verificado vai aceitar sua corrida e você acompanha tudo em tempo real.',
  },
  {
    q: 'Como posso pagar?',
    a: 'Aceitamos cartão de crédito, débito e Pix diretamente pelo app. Tudo é resolvido dentro do aplicativo, sem surpresas na hora de chegar.',
  },
  {
    q: 'Os motoristas são verificados?',
    a: 'Sim! Todos os parceiros passam por um processo de cadastro completo: verificação de CNH, CRLV, antecedentes criminais e foto pessoal. Nada de clandestino.',
  },
  {
    q: 'O que é o Bib Delas?',
    a: 'O Bib Delas é nosso programa especial com foco na segurança das passageiras mulheres, com recursos e atenção extras para garantir que toda mulher chegue tranquila.',
  },
  {
    q: 'Como entro em contato se tiver algum problema?',
    a: 'Nosso suporte está disponível pelo WhatsApp e dentro do próprio app. Nossa equipe é local — conhece a sua cidade e resolve rápido.',
  },
];

function FAQItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-purple-elec transition-colors"
        onClick={() => setOpen(!open)}
        style={{ color: open ? '#C13EFF' : '#F5F5F0' }}
      >
        <span className="font-semibold" style={{ fontSize: 16 }}>{item.q}</span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all"
          style={{
            background: open ? 'rgba(193,62,255,0.15)' : 'rgba(255,255,255,0.05)',
            color: open ? '#C13EFF' : '#A5B0BD',
            transform: open ? 'rotate(45deg)' : 'none',
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? '300px' : '0',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
        }}
      >
        <p className="text-silver pb-5 leading-relaxed" style={{ fontSize: 15 }}>{item.a}</p>
      </div>
    </div>
  );
}

export default function Passageiro() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <FloatingOrbs variant="passageiro" className="absolute inset-0" style={{ zIndex: 0 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 25% 50%,rgba(7,7,7,0.88) 0%,rgba(7,7,7,0.6) 60%,transparent 100%)', zIndex: 1 }} />
        <div className="container relative py-28" style={{ zIndex: 2 }}>
          <div className="max-w-2xl">
            <div className="tag mb-8 inline-flex">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C13EFF', boxShadow: '0 0 10px #C13EFF', animation: 'blink 1.5s infinite' }} />
              Para quem quer chegar com segurança
            </div>
            <h1 className="bebas mb-6" style={{ fontSize: 'clamp(56px, 9vw, 110px)', lineHeight: 0.92 }}>
              Sua corrida chega{' '}
              <span className="purple-text">em minutos.</span>
            </h1>
            <p className="text-silver mb-10" style={{ fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.65, maxWidth: 540 }}>
              Peça agora, acompanhe em tempo real, chegue tranquilo. Motoristas verificados, perto de você.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115" target="_blank" rel="noopener" className="btn-purple">
                Baixar para iOS →
              </a>
              <a href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.passenger.drivermachine" target="_blank" rel="noopener" className="btn-ghost">
                Baixar para Android
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="section" style={{ background: 'linear-gradient(180deg,#070707 0%,#0c0814 100%)' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-16 max-w-xl mx-auto">
            <div className="tag mb-5 inline-flex">Como funciona</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Simples assim.{' '}
              <span className="purple-text">Em 3 passos.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C13EFF, #A930F0, #C13EFF, transparent)' }} />
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.15} className="text-center">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-6 relative"
                  style={{ background: 'linear-gradient(135deg,rgba(193,62,255,0.25),rgba(169,48,240,0.1))', border: '1px solid rgba(193,62,255,0.4)' }}
                >
                  {step.icon}
                  <span
                    className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: 'linear-gradient(135deg,#C13EFF,#A930F0)', color: '#fff' }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="text-silver/40 text-6xl font-black mb-2 bebas">{step.num}</div>
                <h3 className="bebas text-3xl mb-3">{step.title}</h3>
                <p className="text-silver text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEGURANÇA */}
      <section className="section" style={{ background: '#0F0F12' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-xl mx-auto">
            <div className="tag mb-5 inline-flex">Segurança em primeiro lugar</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}>
              Você não embarca{' '}
              <span className="purple-text">no escuro.</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              Cada detalhe foi pensado para que você chegue — e volte — com tranquilidade.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {security.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-8 flex gap-5 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid #1f1f2e' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(193,62,255,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(193,62,255,0.06)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1f1f2e';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <div
                    className="text-3xl w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(193,62,255,0.2),rgba(169,48,240,0.1))', border: '1px solid rgba(193,62,255,0.3)' }}
                  >
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="bebas text-2xl mb-2">{feat.title}</h3>
                    <p className="text-silver text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BIB DELAS */}
      <section id="delas" className="section relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1d0d28 0%,#0a0612 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%,rgba(255,45,142,.2),transparent 50%)' }} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <div
              className="rounded-3xl p-12 md:p-16 text-center max-w-3xl mx-auto"
              style={{ background: 'rgba(255,45,142,0.06)', border: '1px solid rgba(255,45,142,0.2)' }}
            >
              <div className="tag tag-pink mb-6 inline-flex">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF2D8E', boxShadow: '0 0 10px #FF2D8E', animation: 'blink 1.5s infinite' }} />
                Bib Delas
              </div>
              <h2 className="bebas mb-5" style={{ fontSize: 'clamp(40px, 6vw, 76px)' }}>
                Pensado com cuidado{' '}
                <span className="pink-text">para as mulheres.</span>
              </h2>
              <p className="text-silver mb-8 mx-auto" style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 520 }}>
                O Bib Delas é o jeito da BibCar olhar com mais atenção para a segurança das passageiras. Porque toda mulher merece chegar tranquila — de dia ou de noite.
              </p>
              <a href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115" target="_blank" rel="noopener" className="btn-rose">
                Conhecer o Bib Delas
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section
        className="section text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(193,62,255,.2),transparent 60%),#070707' }}
      >
        <div className="container max-w-xl mx-auto">
          <ScrollReveal>
            <div className="tag mb-6 inline-flex">Baixe agora</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.95 }}>
              Sua próxima corrida{' '}
              <span className="purple-text">começa aqui.</span>
            </h2>
            <p className="text-silver mb-10" style={{ fontSize: 17 }}>
              Disponível no iOS e Android. Grátis pra baixar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 rounded-2xl transition-all hover:-translate-y-1"
                style={{ background: '#0f0f18', border: '1.5px solid rgba(193,62,255,0.3)', padding: '14px 28px' }}
              >
                <span style={{ fontSize: 28 }}>🍎</span>
                <span className="text-left">
                  <small className="block text-silver text-[11px] uppercase tracking-wider">Baixe na</small>
                  <strong className="text-white font-bold text-base">App Store</strong>
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.passenger.drivermachine"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 rounded-2xl transition-all hover:-translate-y-1"
                style={{ background: '#0f0f18', border: '1.5px solid rgba(193,62,255,0.3)', padding: '14px 28px' }}
              >
                <span style={{ fontSize: 28 }}>▶</span>
                <span className="text-left">
                  <small className="block text-silver text-[11px] uppercase tracking-wider">Baixe no</small>
                  <strong className="text-white font-bold text-base">Google Play</strong>
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: '#0F0F12' }}>
        <div className="container max-w-2xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <div className="tag mb-5 inline-flex">Dúvidas frequentes</div>
            <h2 className="bebas" style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}>
              Perguntas &{' '}
              <span className="purple-text">respostas</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid #1f1f2e' }}>
              {faq.map((item, i) => (
                <FAQItem key={i} item={item} index={i} />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="text-center mt-10">
            <p className="text-silver mb-4">Ainda tem dúvida?</p>
            <a href="https://wa.me/551151924005" target="_blank" rel="noopener" className="btn-purple">
              Falar no WhatsApp
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
