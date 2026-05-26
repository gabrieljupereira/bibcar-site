'use client';

import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ScrollReveal';
import { motion } from 'framer-motion/client';
import { useState } from 'react';

const FloatingOrbs = dynamic(() => import('@/components/FloatingOrbs'), { ssr: false });

const pillars = [
  {
    icon: '⚡',
    title: 'Tecnologia',
    desc: 'Plataforma de ponta. App para passageiro e motorista, backend robusto e painel de gestão completo. Tudo incluso, sem custo adicional.',
    color: '#FFD23F',
  },
  {
    icon: '🏗️',
    title: 'Operação',
    desc: 'Treinamento completo, manual de operação e suporte contínuo da matriz. Você não começa do zero — começa na frente.',
    color: '#C13EFF',
  },
  {
    icon: '📣',
    title: 'Marketing',
    desc: 'Marca consolidada, identidade visual forte e materiais de divulgação prontos. A BibCar chega na sua cidade já conhecida.',
    color: '#FF9500',
  },
];

const included = [
  'Plataforma tecnológica completa (app + painel de gestão)',
  'App do passageiro e do motorista configurados para sua cidade',
  'Suporte operacional contínuo da matriz BibCar',
  'Material de marketing e divulgação (digital e físico)',
  'Treinamento completo para você e sua equipe',
  'Exclusividade de praça na sua região',
  'Participação em campanhas e promoções nacionais',
  'Acesso ao grupo de suporte de franqueados',
];

const cities = [
  { name: 'Fernandópolis · SP', status: 'ativa' },
  { name: 'Votuporanga · SP', status: 'ativa' },
  { name: 'Muriaé · MG', status: 'em breve' },
  { name: 'Manhuaçu · MG', status: 'em breve' },
  { name: 'Viçosa · MG', status: 'em breve' },
  { name: 'Sete Lagoas · MG', status: 'em breve' },
];

const onboardingSteps = [
  {
    title: 'Entre em contato',
    desc: 'Fale com nossa equipe pelo WhatsApp ou preencha o formulário abaixo. Sem compromisso, sem pressão.',
  },
  {
    title: 'Análise de praça',
    desc: 'Avaliamos juntos o potencial da sua cidade: mercado, população, concorrência e oportunidades.',
  },
  {
    title: 'Contrato e onboarding',
    desc: 'Assinamos o contrato de franquia e iniciamos o treinamento completo para você e sua equipe.',
  },
  {
    title: 'Lançamento!',
    desc: 'Sua cidade entra no mapa da BibCar. Apoiamos o lançamento com marketing, operação e suporte total.',
  },
];

interface FormState {
  nome: string;
  cidade: string;
  telefone: string;
}

export default function Franqueado() {
  const [form, setForm] = useState<FormState>({ nome: '', cidade: '', telefone: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Olá! Tenho interesse em ser franqueado da BibCar.\n\nNome: ${form.nome}\nCidade: ${form.cidade}\nTelefone: ${form.telefone}`
    );
    window.open(`https://wa.me/551151924005?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <FloatingOrbs variant="franqueado" className="absolute inset-0" style={{ zIndex: 0 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 25% 50%,rgba(7,7,7,0.88) 0%,rgba(7,7,7,0.6) 60%,transparent 100%)', zIndex: 1 }} />
        <div className="container relative py-28" style={{ zIndex: 2 }}>
          <div className="max-w-2xl">
            <div className="tag tag-gold mb-8 inline-flex">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFD23F', boxShadow: '0 0 10px #FFD23F', animation: 'blink 1.5s infinite' }} />
              Seja um franqueado BibCar
            </div>
            <h1 className="bebas mb-6" style={{ fontSize: 'clamp(52px, 8.5vw, 104px)', lineHeight: 0.92 }}>
              Empreenda.{' '}
              <span className="gold-text">Expanda.</span>{' '}
              <span className="purple-text">Lidere.</span>
            </h1>
            <p className="text-silver mb-10" style={{ fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.65, maxWidth: 540 }}>
              Leve a BibCar pra sua cidade. Modelo de negócio validado, suporte completo, tecnologia de ponta — e uma marca que já chegou pra ficar.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contato"
                className="btn-gold"
              >
                Quero ser franqueado →
              </a>
              <a href="https://wa.me/551151924005" target="_blank" rel="noopener" className="btn-ghost">
                Falar com a equipe
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PILARES */}
      <section className="section" style={{ background: 'linear-gradient(180deg,#070707 0%,#0c0814 100%)' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-xl mx-auto">
            <div className="tag tag-gold mb-5 inline-flex">O modelo BibCar</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Três pilares que{' '}
              <span className="gradient-text">sustentam o negócio.</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              Você não está sozinho. A BibCar te entrega estrutura completa para operar com excelência.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.13}>
                <div
                  className="rounded-3xl p-10 relative overflow-hidden h-full flex flex-col"
                  style={{ background: '#141420', border: '1px solid #232336' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = p.color + '55';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px ${p.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#232336';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{ background: p.color }} />
                  <div
                    className="text-4xl mb-6 mt-2 w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: p.color + '20', border: `1px solid ${p.color}40` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="bebas text-4xl mb-4">{p.title}</h3>
                  <p className="text-silver text-sm leading-relaxed flex-1">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section className="section" style={{ background: '#0F0F12' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="tag tag-gold mb-6 inline-flex">O que você recebe</div>
              <h2 className="bebas mb-6" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                Tudo que você precisa{' '}
                <span className="gold-text">para decolar.</span>
              </h2>
              <p className="text-silver" style={{ fontSize: 17, lineHeight: 1.6 }}>
                Não vendemos só um nome. Entregamos estrutura, tecnologia, suporte e uma marca que o público já conhece.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,210,63,0.2)' }}>
                {included.map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-4 px-6 py-4"
                    style={{ borderBottom: i < included.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: i % 2 === 0 ? 'rgba(255,210,63,0.03)' : 'transparent' }}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                      style={{ background: 'rgba(255,210,63,0.15)', color: '#FFD23F' }}
                    >
                      ✓
                    </div>
                    <span className="text-sm" style={{ color: '#cfcfdc' }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CIDADES */}
      <section className="section" style={{ background: '#070707' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-12 max-w-xl mx-auto">
            <div className="tag tag-gold mb-5 inline-flex">Cidades disponíveis</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}>
              O mapa está{' '}
              <span className="gold-text">crescendo.</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              Cidades ativas e as próximas em expansão. Sua cidade pode entrar agora.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="rounded-2xl p-5 flex flex-col gap-2"
                  style={{
                    border: city.status === 'ativa' ? '1px solid rgba(255,210,63,0.35)' : '1px solid #232336',
                    background: city.status === 'ativa' ? 'rgba(255,210,63,0.06)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: city.status === 'ativa' ? '#FFD23F' : '#3a3a52',
                        boxShadow: city.status === 'ativa' ? '0 0 8px #FFD23F' : 'none',
                      }}
                    />
                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: city.status === 'ativa' ? '#FFD23F' : '#5a5a6a' }}>
                      {city.status}
                    </span>
                  </div>
                  <span className="font-semibold text-sm" style={{ color: city.status === 'ativa' ? '#F5F5F0' : '#A5B0BD' }}>
                    {city.name}
                  </span>
                </div>
              ))}
              <div className="rounded-2xl p-5 flex flex-col gap-2" style={{ border: '1.5px dashed #2a2a40' }}>
                <span className="text-[11px] font-black uppercase tracking-widest text-silver/50">em breve</span>
                <span className="font-semibold text-sm text-silver/50">Sua cidade aqui?</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ETAPAS */}
      <section className="section" style={{ background: '#0F0F12' }}>
        <div className="container max-w-2xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <div className="tag tag-gold mb-5 inline-flex">Como se tornar franqueado</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              4 passos até{' '}
              <span className="gradient-text">o lançamento.</span>
            </h2>
          </ScrollReveal>

          <div className="relative">
            <div
              className="absolute left-6 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg,#FFD23F,#C13EFF,rgba(193,62,255,0))' }}
            />
            {onboardingSteps.map((step, i) => (
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
                  style={{
                    background: i < 2
                      ? 'linear-gradient(135deg,#FFD23F,#FF9500)'
                      : 'linear-gradient(135deg,#C13EFF,#A930F0)',
                    color: '#fff',
                  }}
                >
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="bebas text-2xl mb-1">{step.title}</h3>
                  <p className="text-silver text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO + CTA */}
      <section
        id="contato"
        className="section"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(255,210,63,.15),transparent 60%),radial-gradient(ellipse at 50% 100%,rgba(193,62,255,.2),transparent 60%),#070707' }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="tag tag-gold mb-6 inline-flex">Vamos conversar</div>
              <h2 className="bebas mb-4" style={{ fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 0.95 }}>
                Sua cidade merece{' '}
                <span className="gradient-text">a BibCar.</span>
              </h2>
              <p className="text-silver mb-8" style={{ fontSize: 17, lineHeight: 1.7 }}>
                Preencha o formulário ou fale diretamente com nossa equipe. Sem compromisso — só uma conversa sobre oportunidade.
              </p>
              <a href="https://wa.me/551151924005" target="_blank" rel="noopener" className="btn-gold">
                Falar no WhatsApp agora →
              </a>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              {sent ? (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: 'rgba(255,210,63,0.06)', border: '1px solid rgba(255,210,63,0.3)' }}
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="bebas text-3xl mb-3 gold-text">Mensagem enviada!</h3>
                  <p className="text-silver text-sm">Nossa equipe vai entrar em contato em breve pelo WhatsApp.</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl p-8 flex flex-col gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #232336' }}
                >
                  <h3 className="bebas text-2xl mb-2">Formulário de interesse</h3>
                  {[
                    { name: 'nome', placeholder: 'Seu nome completo', type: 'text' },
                    { name: 'cidade', placeholder: 'Sua cidade e estado', type: 'text' },
                    { name: 'telefone', placeholder: 'Seu WhatsApp', type: 'tel' },
                  ].map((field) => (
                    <input
                      key={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={form[field.name as keyof FormState]}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#F5F5F0',
                      }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#FFD23F'; }}
                      onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    />
                  ))}
                  <button type="submit" className="btn-gold justify-center mt-2">
                    Enviar pelo WhatsApp →
                  </button>
                  <p className="text-silver/50 text-xs text-center">
                    Ao enviar, você será redirecionado ao WhatsApp com a mensagem preenchida.
                  </p>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
