'use client';

import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ScrollReveal';
import { motion } from 'framer-motion';

const FloatingOrbs = dynamic(() => import('@/components/FloatingOrbs'), { ssr: false });

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

export default function Motorista() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <FloatingOrbs variant="motorista" className="absolute inset-0" style={{ zIndex: 0 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 25% 50%,rgba(7,7,7,0.88) 0%,rgba(7,7,7,0.6) 60%,transparent 100%)', zIndex: 1 }} />
        <div className="container relative py-28" style={{ zIndex: 2 }}>
          <div className="max-w-2xl">
            <div className="tag tag-gold mb-8 inline-flex">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFD23F', boxShadow: '0 0 10px #FFD23F', animation: 'blink 1.5s infinite' }} />
              Seja um parceiro BibCar
            </div>
            <h1 className="bebas mb-6" style={{ fontSize: 'clamp(56px, 9vw, 110px)', lineHeight: 0.92 }}>
              Dirija.{' '}
              <span className="gold-text">Ganhe.</span>{' '}
              Cresça.
            </h1>
            <p className="text-silver mb-10" style={{ fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.65, maxWidth: 540 }}>
              Trabalhe no seu tempo, ganhe mais perto de casa. A BibCar é a plataforma que respeita quem dirige.
            </p>
            <div className="flex flex-wrap gap-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE BIBCAR */}
      <section className="section" style={{ background: 'linear-gradient(180deg,#070707 0%,#0c0814 100%)' }}>
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
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid #1f1f2e' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,210,63,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,210,63,0.05)';
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
                    style={{ background: 'linear-gradient(135deg,rgba(255,210,63,.2),rgba(255,150,0,.1))', border: '1px solid rgba(255,210,63,.3)' }}
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
      <section className="section" style={{ background: '#0F0F12' }}>
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
                  <motion.div
                    key={i}
                    className="flex gap-6 mb-10 relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    viewport={{ once: true }}
                  >
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
                  </motion.div>
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

              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,210,63,0.2)' }}>
                {documents.map((doc, i) => (
                  <motion.div
                    key={doc}
                    className="flex items-center gap-4 px-6 py-4"
                    style={{ borderBottom: i < documents.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: i % 2 === 0 ? 'rgba(255,210,63,0.03)' : 'transparent' }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                      style={{ background: 'rgba(255,210,63,0.15)', color: '#FFD23F' }}
                    >
                      ✓
                    </div>
                    <span className="text-sm" style={{ color: '#cfcfdc' }}>{doc}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* GANHOS */}
      <section
        className="section"
        style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(255,210,63,.12),transparent 70%),#070707' }}
      >
        <div className="container max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="tag tag-gold mb-6 inline-flex">Seus ganhos</div>
            <h2 className="bebas mb-6" style={{ fontSize: 'clamp(44px, 7vw, 84px)', lineHeight: 0.95 }}>
              Você decide quando trabalha.{' '}
              <span className="gold-text">Nós garantimos que vale.</span>
            </h2>
            <p className="text-silver mb-10 mx-auto" style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 600 }}>
              Sem meta obrigatória. Sem penalidade por não aceitar corrida. Sem taxa escondida. Quanto mais você roda, mais você ganha — e o dinheiro é seu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center mb-10">
              {[
                { num: '100%', label: 'Transparência na taxa' },
                { num: '48h', label: 'Para aprovação do cadastro' },
                { num: '0', label: 'Taxa de clandestino aqui' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl py-8 px-6" style={{ background: 'rgba(255,210,63,0.06)', border: '1px solid rgba(255,210,63,0.2)' }}>
                  <div className="bebas text-gold mb-2" style={{ fontSize: 52, lineHeight: 1 }}>{stat.num}</div>
                  <div className="text-silver text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SUPORTE */}
      <section className="section" style={{ background: '#0F0F12' }}>
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
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid #1f1f2e' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,210,63,0.35)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1f1f2e';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
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
      <section
        className="section text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(255,210,63,.25),transparent 70%),#070707' }}
      >
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
