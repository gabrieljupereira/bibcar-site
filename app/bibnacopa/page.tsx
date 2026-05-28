'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingOrbs from '@/components/FloatingOrbs';
import PlayerTransformer from '@/components/PlayerTransformer';

const heroItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ─── floating football SVGs ─────────────────────────── */
const balls = [
  { size: 90,  left: '6%',  top: '12%', dur: 6.5, delay: 0,  opacity: 0.22 },
  { size: 52,  left: '91%', top: '20%', dur: 8,   delay: -2, opacity: 0.16 },
  { size: 68,  left: '14%', top: '75%', dur: 7,   delay: -4, opacity: 0.18 },
  { size: 38,  left: '84%', top: '62%', dur: 9,   delay: -1, opacity: 0.13 },
  { size: 60,  left: '48%', top: '6%',  dur: 7.5, delay: -3, opacity: 0.14 },
  { size: 28,  left: '22%', top: '48%', dur: 10,  delay: -5, opacity: 0.09 },
  { size: 44,  left: '75%', top: '90%', dur: 8.5, delay: -2, opacity: 0.12 },
];

function FootballSVG({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <div style={{ width: size, height: size, position: 'absolute', pointerEvents: 'none', ...style }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <circle cx="24" cy="24" r="22" stroke="rgba(255,223,0,0.5)" strokeWidth="2" />
        <polygon points="24,5 30,14 40,14 34,22 37,33 24,27 11,33 14,22 8,14 18,14"
          fill="none" stroke="rgba(255,223,0,0.35)" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="4" fill="rgba(0,156,59,0.4)" />
      </svg>
    </div>
  );
}

/* ─── match schedule ─────────────────────────────────── */
const matches = [
  { label: 'Jogo 1 · Fase de Grupos', flag: '🇧🇷', opponent: 'A definir', date: '14 Jun 2026', time: '15:00 BRT', venue: 'Los Angeles, EUA' },
  { label: 'Jogo 2 · Fase de Grupos', flag: '🇧🇷', opponent: 'A definir', date: '19 Jun 2026', time: '21:00 BRT', venue: 'Dallas, EUA' },
  { label: 'Jogo 3 · Fase de Grupos', flag: '🇧🇷', opponent: 'A definir', date: '24 Jun 2026', time: '18:00 BRT', venue: 'San Francisco, EUA' },
];

/* ─── benefits ───────────────────────────────────────── */
const benefits = [
  { icon: '🍺', title: 'Bebe e torce à vontade', desc: 'Comemora cada gol sem preocupação com volante. A BibCar te leva e te traz com segurança total.' },
  { icon: '💚', title: '30% automático', desc: 'O desconto ativa sozinho durante os jogos do Brasil. Abre o app, pede a corrida — simples assim.' },
  { icon: '🛡️', title: 'Motoristas verificados', desc: 'CNH, antecedentes e veículo — tudo checado. Você vai na festa seguro desde o primeiro toque na tela.' },
  { icon: '⚡', title: 'Motorista perto de você', desc: 'Sem esperar sozinho na calçada quando o jogo acabar. Pediu, chegou.' },
];

/* ─── CountdownTimer ─────────────────────────────────── */
function CountdownTimer({ target }: { target: Date }) {
  const [diff, setDiff] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const ms = target.getTime() - Date.now();
      if (ms <= 0) { setDiff({ d: 0, h: 0, m: 0, s: 0 }); return; }
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setDiff({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {[
        { val: diff.d, label: 'dias' },
        { val: diff.h, label: 'horas' },
        { val: diff.m, label: 'min' },
        { val: diff.s, label: 'seg' },
      ].map(({ val, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="text-center">
            <div
              className="bebas text-5xl md:text-6xl tabular-nums"
              style={{ color: '#FFDF00', textShadow: '0 0 20px rgba(255,223,0,0.6)', lineHeight: 1 }}
            >
              {pad(val)}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
          </div>
          {i < 3 && <span className="bebas text-4xl" style={{ color: 'rgba(255,223,0,0.5)', marginBottom: 18 }}>:</span>}
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function BibNaCopa() {
  const firstMatch = new Date('2026-06-14T15:00:00-07:00');

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(150deg,#020d02 0%,#051505 45%,#020810 100%)' }}
      >
        <FloatingOrbs variant="copa" className="absolute inset-0" style={{ zIndex: 0 }} />

        {/* floating footballs */}
        {balls.map((b, i) => (
          <FootballSVG
            key={i}
            size={b.size}
            style={{
              left: b.left,
              top: b.top,
              opacity: b.opacity,
              animation: `float ${b.dur}s ease-in-out infinite`,
              animationDelay: `${b.delay}s`,
              zIndex: 1,
            }}
          />
        ))}

        {/* stadium light sweep */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%,rgba(0,156,59,0.18) 0%,transparent 55%),radial-gradient(ellipse at 80% 30%,rgba(255,223,0,0.1) 0%,transparent 50%)', zIndex: 2 }} />

        <div className="container relative py-28" style={{ zIndex: 3 }}>
          <motion.div className="max-w-3xl" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }} initial="hidden" animate="show">
            {/* promo badge */}
            <motion.div variants={heroItem} className="inline-flex items-center gap-3 rounded-full mb-8 px-5 py-2.5"
              style={{ background: 'rgba(0,156,59,0.2)', border: '1.5px solid rgba(0,156,59,0.5)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF44', boxShadow: '0 0 10px #00FF44', animation: 'blink 1s infinite', display: 'inline-block' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#4dff88' }}>⚽ Promoção Copa 2026 · Ativa</span>
            </motion.div>

            <motion.h1 variants={heroItem} className="bebas mb-3" style={{ fontSize: 'clamp(72px, 13vw, 160px)', lineHeight: 0.88 }}>
              <span style={{ background: 'linear-gradient(135deg,#009C3B 0%,#00c94a 40%,#FFDF00 80%,#FFB800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Bib
              </span>
              <br />
              <span style={{ color: '#ffffff' }}>
                na Copa
              </span>
            </motion.h1>

            {/* scoreboard 30% */}
            <motion.div variants={heroItem} className="inline-flex flex-col items-start mb-8">
              <div
                className="rounded-2xl px-8 py-5 flex items-center gap-5"
                style={{ background: 'linear-gradient(135deg,rgba(255,223,0,0.12),rgba(0,156,59,0.08))', border: '2px solid rgba(255,223,0,0.4)', backdropFilter: 'blur(10px)' }}
              >
                <span className="bebas" style={{ fontSize: 'clamp(48px, 8vw, 88px)', lineHeight: 1, color: '#FFDF00', textShadow: '0 0 30px rgba(255,223,0,0.7)' }}>30%</span>
                <div>
                  <div className="font-black text-white uppercase tracking-wider" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>de desconto</div>
                  <div className="font-semibold" style={{ fontSize: 'clamp(12px, 1.5vw, 15px)', color: 'rgba(255,255,255,0.6)' }}>em todas as corridas</div>
                  <div className="font-bold" style={{ fontSize: 'clamp(11px, 1.3vw, 13px)', color: '#4dff88', marginTop: 2 }}>⚡ na hora do jogo do Brasil</div>
                </div>
              </div>
            </motion.div>

            <motion.p variants={heroItem} style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 520, marginBottom: 40 }}>
              Vai na torcida sem preocupação. A BibCar te leva, te traz e ainda te dá 30% de desconto enquanto o Brasil joga.
            </motion.p>

            <motion.div variants={heroItem} className="flex flex-wrap gap-4">
              <a
                href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115"
                target="_blank"
                rel="noopener"
                className="btn-gold"
                style={{ background: 'linear-gradient(135deg,#FFDF00,#FFB800)', color: '#1a0f00', boxShadow: '0 8px 32px rgba(255,223,0,0.4)' }}
              >
                Baixar para iOS →
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.passenger.drivermachine"
                target="_blank"
                rel="noopener"
                className="btn-ghost"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}
              >
                Baixar para Android
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top,#020d02,transparent)', zIndex: 4 }} />
      </section>

      {/* ══ COUNTDOWN ═════════════════════════════════════════════════════ */}
      <section style={{ background: '#020d02', paddingTop: 56, paddingBottom: 64 }}>
        <div className="container max-w-2xl mx-auto text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            ⚽ 1º jogo do Brasil começa em
          </p>
          <CountdownTimer target={firstMatch} />
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
            14 Jun 2026 · Los Angeles, EUA · Data sujeita a confirmação oficial
          </p>
        </div>
      </section>

      {/* ══ COMO FUNCIONA ═════════════════════════════════════════════════ */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-xl mx-auto">
            <div className="tag mb-5 inline-flex" style={{ borderColor: '#009C3B', color: '#009C3B', background: 'rgba(0,156,59,0.07)' }}>Como funciona</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Desconto{' '}
              <span style={{ background: 'linear-gradient(135deg,#009C3B,#FFDF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>automático.</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>Sem cupom, sem cadastro extra, sem enrolação.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: '01', icon: '📱', title: 'Baixe o app', desc: 'BibCar disponível no iOS e Android. Faça o cadastro em menos de 2 minutos.' },
              { num: '02', icon: '⚽', title: 'Hora do jogo', desc: 'Quando o Brasil entrar em campo, abra o app e peça sua corrida normalmente.' },
              { num: '03', icon: '💰', title: '30% menos', desc: 'O desconto é aplicado automaticamente no preço da corrida. Sem código, sem complicação.' },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.15} className="text-center">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-6 relative"
                  style={{ background: 'linear-gradient(135deg,rgba(0,156,59,0.12),rgba(255,223,0,0.08))', border: '1px solid rgba(0,156,59,0.25)' }}
                >
                  {step.icon}
                  <span
                    className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: 'linear-gradient(135deg,#009C3B,#007a2e)', color: '#fff' }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="bebas text-5xl font-black mb-2" style={{ color: 'rgba(0,156,59,0.15)' }}>{step.num}</div>
                <h3 className="bebas text-3xl mb-3">{step.title}</h3>
                <p className="text-silver text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JOGOS ═════════════════════════════════════════════════════════ */}
      <section
        className="section"
        style={{ background: 'linear-gradient(150deg,#020d02 0%,#051505 60%,#020810 100%)' }}
      >
        <div className="container max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6"
              style={{ background: 'rgba(0,156,59,0.15)', border: '1px solid rgba(0,156,59,0.4)' }}>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#4dff88' }}>🇧🇷 Jogos do Brasil · Copa 2026</span>
            </div>
            <h2 className="bebas mb-4 text-white" style={{ fontSize: 'clamp(40px, 6vw, 76px)' }}>
              Marque na{' '}
              <span style={{ background: 'linear-gradient(135deg,#FFDF00,#FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>agenda.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17 }}>
              Em todos esses jogos, o desconto de 30% está ativo no app BibCar.
            </p>
          </ScrollReveal>

          <div className="flex flex-col gap-4">
            {matches.map((match, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div
                  className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,223,0,0.2)', backdropFilter: 'blur(8px)' }}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,rgba(0,156,59,0.25),rgba(255,223,0,0.1))', border: '1px solid rgba(255,223,0,0.25)' }}
                    >
                      🇧🇷
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{match.label}</div>
                      <div className="bebas text-xl text-white">Brasil vs. {match.opponent}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>📍 {match.venue}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <div className="bebas text-2xl" style={{ color: '#FFDF00' }}>{match.date}</div>
                    <div
                      className="rounded-xl px-4 py-2 text-center"
                      style={{ background: 'rgba(255,223,0,0.1)', border: '1px solid rgba(255,223,0,0.3)' }}
                    >
                      <div className="text-xs font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>horário</div>
                      <div className="bebas text-lg" style={{ color: '#FFDF00' }}>{match.time}</div>
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 rounded-xl px-5 py-3 text-center"
                    style={{ background: 'linear-gradient(135deg,rgba(0,156,59,0.3),rgba(0,156,59,0.15))', border: '1px solid rgba(0,156,59,0.5)' }}
                  >
                    <div className="bebas text-3xl" style={{ color: '#4dff88', textShadow: '0 0 15px rgba(77,255,136,0.5)' }}>30%</div>
                    <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>OFF ativo</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3} className="text-center mt-8">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              * Datas e horários sujeitos a confirmação oficial pela FIFA. Adversários definidos após sorteio dos grupos.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ POR QUE BIBNACOPA ════════════════════════════════════════════ */}
      <section className="section" style={{ background: '#F7FFF9' }}>
        <div className="container">
          <ScrollReveal className="text-center mb-14 max-w-xl mx-auto">
            <div className="tag mb-5 inline-flex" style={{ borderColor: '#009C3B', color: '#009C3B', background: 'rgba(0,156,59,0.07)' }}>Por que usar</div>
            <h2 className="bebas mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Torce sem{' '}
              <span style={{ background: 'linear-gradient(135deg,#009C3B,#FFDF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>preocupação.</span>
            </h2>
            <p className="text-silver" style={{ fontSize: 17 }}>
              A BibCar cuida do trajeto. Você cuida da torcida.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map((b, i) => (
              <ScrollReveal key={b.title} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-8 flex gap-5 transition-all duration-300 h-full"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,156,59,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,156,59,0.4)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,156,59,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,156,59,0.15)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                  }}
                >
                  <div
                    className="text-3xl w-14 h-14 flex-shrink-0 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(0,156,59,0.12),rgba(255,223,0,0.08))', border: '1px solid rgba(0,156,59,0.2)' }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="bebas text-2xl mb-2">{b.title}</h3>
                    <p className="text-silver text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ IA JOGADOR ═══════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(150deg,#020d02 0%,#051505 60%,#020810 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%,rgba(0,156,59,0.15),transparent 60%),radial-gradient(ellipse at 20% 30%,rgba(255,223,0,0.08),transparent 50%)', pointerEvents: 'none' }} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <PlayerTransformer />
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════════════════ */}
      <section
        className="section text-center"
        style={{ background: 'linear-gradient(150deg,#020d02 0%,#051505 50%,#020810 100%)', position: 'relative', overflow: 'hidden' }}
      >
        {/* glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 80%,rgba(0,156,59,0.25),transparent 65%),radial-gradient(ellipse at 50% 0%,rgba(255,223,0,0.12),transparent 55%)', pointerEvents: 'none' }} />

        <div className="container max-w-2xl mx-auto relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            {/* flag */}
            <div className="text-7xl mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(0,156,59,0.6))' }}>🇧🇷</div>

            <h2 className="bebas mb-4 text-white" style={{ fontSize: 'clamp(56px, 10vw, 112px)', lineHeight: 0.92 }}>
              Bora{' '}
              <span style={{ background: 'linear-gradient(135deg,#FFDF00,#FF9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>torcer!</span>
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginBottom: 12, lineHeight: 1.6 }}>
              Baixe o app, peça sua corrida na hora do jogo e aproveite{' '}
              <strong style={{ color: '#FFDF00' }}>30% de desconto automático</strong>.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 40 }}>
              Promoção válida durante todos os jogos oficiais do Brasil na Copa do Mundo 2026.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115"
                target="_blank"
                rel="noopener"
                className="btn-gold justify-center"
                style={{ background: 'linear-gradient(135deg,#FFDF00,#FFB800)', color: '#1a0f00', boxShadow: '0 8px 32px rgba(255,223,0,0.35)' }}
              >
                Baixar para iOS (App Store)
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.passenger.drivermachine"
                target="_blank"
                rel="noopener"
                className="btn-ghost justify-center"
                style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
              >
                Baixar para Android
              </a>
            </div>

            <div className="mt-10">
              <a
                href="https://wa.me/551151924005"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                <span>💬</span> Dúvidas? Fala com a gente no WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
