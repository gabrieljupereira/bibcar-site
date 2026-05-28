'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingOrbs from '@/components/FloatingOrbs';

const heroItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const differentials = [
  { icon: '💰', title: 'Ganho melhor', desc: 'Por corrida, você fica com mais. Nossa taxa é justa e transparente — sem surpresas no final do dia.' },
  { icon: '🤝', title: 'Suporte de verdade', desc: 'Equipe local que conhece a sua cidade. Sem call center genérico, sem robô. Gente real.' },
  { icon: '⏰', title: 'Flexibilidade total', desc: 'Você escolhe quando e quanto trabalhar. Ligou o app, tá disponível. Desligou, descansou.' },
  { icon: '📈', title: 'Crescimento real', desc: 'Programa de benefícios para os melhores parceiros. Quanto mais você roda, mais vantagens.' },
];

const registerSteps = [
  {
    title: 'Baixe o app motorista',
    desc: 'Disponível no Android (Google Play). Busque por "BibCar Motorista" ou use o link abaixo.',
    link: { label: 'Baixar app motorista →', href: 'https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.taxi.drivermachine' },
  },
  {
    title: 'Crie seu cadastro',
    desc: 'Preencha seus dados pessoais, informações do veículo e foto de perfil. Simples e rápido.',
    link: null,
  },
  {
    title: 'Envie os documentos',
    desc: 'CNH, CRLV, antecedentes criminais e mais. Tudo pelo app, sem precisar ir a lugar nenhum.',
    link: null,
  },
  {
    title: 'Aguarde a aprovação',
    desc: 'Nossa equipe analisa seu cadastro em até 48 horas úteis. Você recebe o resultado por notificação.',
    link: null,
  },
  {
    title: 'Comece a rodar!',
    desc: 'Aprovado? Ligue o app, aceite corridas e comece a ganhar. É isso — simples assim.',
    link: null,
  },
];

const documents = [
  'CNH válida e dentro do prazo de validade',
  'CRLV do veículo (fabricação a partir de 2017)',
  'Certidão de Antecedentes Criminais atualizada',
  'Foto do veículo (frente, traseira e laterais)',
  'Selfie segurando seu documento de identidade',
  'Comprovante de residência recente',
];

const supports = [
  { icon: '📍', title: 'Suporte local', desc: 'Nossa equipe está na sua cidade. Conhecemos as ruas e entendemos os desafios do dia a dia.' },
  { icon: '⚡', title: 'Resposta rápida', desc: 'Sem burocracia pra resolver problema de corrida. Chamou, resolvemos.' },
  { icon: '👥', title: 'Comunidade', desc: 'Grupo de motoristas parceiros onde você troca experiência, dica e informação.' },
];

function EarningsCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const avgPerHour = 28;
  const monthlyRaw = hoursPerDay * daysPerWeek * 4.33 * avgPerHour;
  const monthly = Math.round(monthlyRaw / 10) * 10;

  return (
    <div
      className="rounded-3xl p-8 md:p-12"
      style={{ background: '#ffffff', border: '1px solid rgba(255,210,63,0.3)', boxShadow: '0 4px 24px rgba(255,210,63,0.08)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-silver">Horas por dia</label>
            <span className="bebas text-2xl gold-text">{hoursPerDay}h</span>
          </div>
          <input
            type="range" min={1} max={12} value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
            className="w-full h-2 rounded-full outline-none cursor-pointer"
            style={{ accentColor: '#FFD23F' }}
          />
          <div className="flex justify-between text-xs mt-1 text-silver">
            <span>1h</span><span>12h</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-silver">Dias por semana</label>
            <span className="bebas text-2xl gold-text">{daysPerWeek} dias</span>
          </div>
          <input
            type="range" min={1} max={7} value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            className="w-full h-2 rounded-full outline-none cursor-pointer"
            style={{ accentColor: '#FFD23F' }}
          />
          <div className="flex justify-between text-xs mt-1 text-silver">
            <span>1 dia</span><span>7 dias</span>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: 'linear-gradient(135deg,rgba(255,210,63,0.1),rgba(255,150,0,0.06))', border: '1px solid rgba(255,210,63,0.25)' }}
      >
        <p className="text-silver text-sm mb-2">Estimativa mensal</p>
        <p className="bebas gold-text" style={{ fontSize: 'clamp(52px, 10vw, 88px)', lineHeight: 1 }}>
          R$ {monthly.toLocaleString('pt-BR')}
        </p>
        <p className="text-xs mt-3 text-silver">
          Baseado em ~R${avgPerHour}/h · {hoursPerDay}h/dia · {daysPerWeek} dias/semana · 4,3 semanas/mês
        </p>
      </div>

      <p className="text-center text-xs mt-6 text-silver">
        * Estimativa baseada na média da plataforma. Ganhos reais variam conforme cidade, horário e demanda.
      </p>
    </div>
  );
}

export default function Motorista() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', background: '#F7F5FF' }}>
        <FloatingOrbs variant="motorista" className="absolute inset-0" style={{ zIndex: 0 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 25% 50%,rgba(241,235,255,0.85) 0%,transparent 70%)', zIndex: 1 }} />
        <div className="container relative py-28" style={{ zIndex: 2 }}>
          <motion.div className="max-w-2xl" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }} initial="hidden" animate="show">
            <motion.div variants={heroItem} className="tag tag-gold mb-8 inline-flex">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFD23F', boxShadow: '0 0 10px #FFD23F', animation: 'blink 1.5s infinite' }} />
              Seja um parceiro BibCar
            </motion.div>
            <motion.h1 variants={heroItem} className="bebas mb-6" style={{ fontSize: 'clamp(56px, 9vw, 110px)', lineHeight: 0.92 }}>
              Dirija.{' '}
              <span className="gold-text">Ganhe.</span>{' '}
              Cresça.
            </motion.h1>
            <motion.p variants={heroItem} className="text-silver mb-10" style={{ fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.65, maxWidth: 540 }}>
              Trabalhe no seu tempo, ganhe mais perto de casa. A BibCar é a plataforma que respeita quem dirige.
            </motion.p>
            <motion.div variants={heroItem} className="flex flex-wrap gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.taxi.drivermachine"
                target="_blank"
                rel="noopener"
                className="btn-gold"
              >
                Quero ser motorista →
              </a>
              <a href="https://wa.me/551151924005" target="_blank" rel="noopener" className="btn-ghost">
                Falar com a equipe
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* POR QUE BIBCAR */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-xl mx-auto">
            <div className="tag tag-gold mb-5 inline-flex">Por que a BibCar</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Mais do que um app.{' '}
              <span className="gold-text">Uma parceria.</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              A BibCar foi feita pensando em quem dirige. Não só em quem pede corrida.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {differentials.map((d, i) => (
              <ScrollReveal key={d.title} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-8 text-center transition-all duration-300 h-full"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,210,63,0.45)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,210,63,0.04)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(255,210,63,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.09)';
                    (e.currentTarget as HTMLElement).style.background = '#ffffff';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                  }}
                >
                  <div
                    className="text-3xl mb-4 w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(255,210,63,.15),rgba(255,150,0,.08))', border: '1px solid rgba(255,210,63,.25)' }}
                  >
                    {d.icon}
                  </div>
                  <h3 className="bebas text-2xl mb-2">{d.title}</h3>
                  <p className="text-silver text-sm leading-relaxed">{d.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMO SE CADASTRAR */}
      <section className="section" style={{ background: '#F7F5FF' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <div className="tag tag-gold mb-6 inline-flex">Passo a passo</div>
              <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                Como se{' '}
                <span className="gold-text">cadastrar</span>
              </h2>
              <p className="text-silver mb-10" style={{ fontSize: 17, lineHeight: 1.6 }}>
                Do download ao primeiro "vai de BibCar!" — tudo em menos de 48 horas.
              </p>

              <div className="relative">
                <div
                  className="absolute left-6 top-0 bottom-0 w-px"
                  style={{ background: 'linear-gradient(180deg,#FFD23F,#FF9500,rgba(255,210,63,0))' }}
                />
                {registerSteps.map((step, i) => (
                  <div key={i} className="flex gap-6 mb-10 relative">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base flex-shrink-0 relative z-10"
                      style={{ background: 'linear-gradient(135deg,#FFD23F,#FF9500)', color: '#1a0f00' }}
                    >
                      {i + 1}
                    </div>
                    <div className="pt-1">
                      <h3 className="bebas text-2xl mb-1">{step.title}</h3>
                      <p className="text-silver text-sm leading-relaxed mb-2">{step.desc}</p>
                      {step.link && (
                        <a href={step.link.href} target="_blank" rel="noopener" className="text-gold font-semibold text-sm hover:underline">
                          {step.link.label}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* DOCUMENTOS */}
            <ScrollReveal delay={0.2}>
              <div className="tag tag-gold mb-6 inline-flex">Documentos necessários</div>
              <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                O que você{' '}
                <span className="gold-text">precisa ter</span>
              </h2>
              <p className="text-silver mb-8" style={{ fontSize: 17, lineHeight: 1.6 }}>
                Separe esses documentos antes de começar o cadastro. Tudo é enviado pelo app.
              </p>

              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,210,63,0.25)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                {documents.map((doc, i) => (
                  <div
                    key={doc}
                    className="flex items-center gap-4 px-6 py-4"
                    style={{
                      borderBottom: i < documents.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                      background: i % 2 === 0 ? 'rgba(255,210,63,0.04)' : '#ffffff',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                      style={{ background: 'rgba(255,210,63,0.15)', color: '#FF9500' }}
                    >
                      ✓
                    </div>
                    <span className="text-sm text-silver">{doc}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CALCULADORA DE GANHOS */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <div className="tag tag-gold mb-6 inline-flex">Calculadora de ganhos</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(44px, 7vw, 84px)', lineHeight: 0.95 }}>
              Quanto você pode{' '}
              <span className="gold-text">ganhar?</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 18, lineHeight: 1.7 }}>
              Simule sua renda mensal. Ajuste as horas e veja a estimativa.
            </p>
          </ScrollReveal>
          <EarningsCalculator />
        </div>
      </section>

      {/* SUPORTE */}
      <section className="section" style={{ background: '#F7F5FF' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-xl mx-auto">
            <div className="tag tag-gold mb-5 inline-flex">Suporte BibCar</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}>
              Você não{' '}
              <span className="gold-text">fica sozinho.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supports.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 0.12}>
                <div
                  className="rounded-2xl p-8 text-center h-full transition-all duration-300"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,210,63,0.45)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(255,210,63,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.09)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                  }}
                >
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="bebas text-2xl mb-3">{s.title}</h3>
                  <p className="text-silver text-sm leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section text-center" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(255,210,63,.15),transparent 70%),#F7F5FF' }}>
        <div className="container max-w-xl mx-auto">
          <ScrollReveal>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.95 }}>
              Pronto pra{' '}
              <span className="gold-text">rodar?</span>
            </h2>
            <p className="text-silver mb-10" style={{ fontSize: 18 }}>
              Baixe o app do motorista e comece seu cadastro agora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.taxi.drivermachine"
                target="_blank"
                rel="noopener"
                className="btn-gold justify-center"
              >
                Baixar app motorista (Android)
              </a>
              <a href="https://wa.me/551151924005" target="_blank" rel="noopener" className="btn-ghost">
                Dúvidas? WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
