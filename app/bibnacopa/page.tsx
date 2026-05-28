'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingOrbs from '@/components/FloatingOrbs';
import PlayerTransformer from '@/components/PlayerTransformer';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const hi = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };

/* ─── Data ───────────────────────────────────────────────── */
const matches = [
  { id: 'm1', away: 'A definir', date: '14 Jun 2026', time: '15:00 BRT', venue: 'Los Angeles, EUA' },
  { id: 'm2', away: 'A definir', date: '19 Jun 2026', time: '21:00 BRT', venue: 'Dallas, EUA' },
  { id: 'm3', away: 'A definir', date: '24 Jun 2026', time: '18:00 BRT', venue: 'San Francisco, EUA' },
];

const ecosystem = [
  { icon: '🚗', title: 'Corrida Copa',   desc: '30% OFF automático durante todos os jogos do Brasil. Abre o app e pede.', tag: 'ATIVO',    color: '#00e054' },
  { icon: '🎰', title: 'Bolão BibCar',   desc: 'Chuta o placar, acumule Copa Points e concorra a corridas grátis.', tag: 'NOVO',     color: '#FFDF00' },
  { icon: '🃏', title: 'Figurinha IA',   desc: 'IA te transforma em craque Panini 2026. Compartilha no story.', tag: 'IA',       color: '#00c9ff' },
  { icon: '🏆', title: 'Copa Rewards',   desc: 'Pontos em cada corrida e palpite. Sobe no ranking, ganha prêmios.', tag: 'EM BREVE', color: '#ff9500' },
];

const prizesTiers = [
  { pts: 500,  prize: '1 corrida grátis',         icon: '🎟' },
  { pts: 1000, prize: '3 corridas grátis',         icon: '🎁' },
  { pts: 2000, prize: 'Mês inteiro com 50% OFF',  icon: '⭐' },
  { pts: 5000, prize: 'Experiência VIP Copa 2026', icon: '🏆' },
];

const pointsTable = [
  { action: '🚗 Corrida durante jogo do Brasil',   pts: '+50'  },
  { action: '🎰 Palpite correto (resultado)',       pts: '+100' },
  { action: '⚽ Palpite correto (placar exato)',    pts: '+250' },
  { action: '🃏 Compartilhar figurinha IA',         pts: '+30'  },
  { action: '👥 Indicar amigo que faz corrida',    pts: '+80'  },
];

const mockRanking = [
  { name: 'Thales M.', pts: 1420, rides: 18, correct: 9,  medal: '🥇' },
  { name: 'Ana C.',    pts: 1280, rides: 15, correct: 8,  medal: '🥈' },
  { name: 'Bruno K.',  pts: 1100, rides: 12, correct: 7,  medal: '🥉' },
  { name: 'Carol S.',  pts: 890,  rides: 10, correct: 5,  medal: '4' },
  { name: 'Diego P.',  pts: 750,  rides: 9,  correct: 4,  medal: '5' },
];

/* ─── Countdown ──────────────────────────────────────────── */
function CountdownTimer({ target }: { target: Date }) {
  const [diff, setDiff] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const ms = target.getTime() - Date.now();
      if (ms <= 0) { setDiff({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setDiff({ d: Math.floor(ms / 86400000), h: Math.floor((ms % 86400000) / 3600000), m: Math.floor((ms % 3600000) / 60000), s: Math.floor((ms % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [target]);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
      {[{ v: diff.d, l: 'dias' }, { v: diff.h, l: 'horas' }, { v: diff.m, l: 'min' }, { v: diff.s, l: 'seg' }].map(({ v, l }, i) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'center', minWidth: 64 }}>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(44px,8vw,76px)', lineHeight: 1, color: '#FFDF00', textShadow: '0 0 28px rgba(255,223,0,0.65)' }}>{pad(v)}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{l}</div>
          </div>
          {i < 3 && <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 44, color: 'rgba(255,223,0,0.35)', marginBottom: 18 }}>:</div>}
        </div>
      ))}
    </div>
  );
}

/* ─── Bolão ──────────────────────────────────────────────── */
type Resultado = 'home' | 'draw' | 'away';
interface Palpite { matchId: string; nome: string; celular: string; result: Resultado; scoreH: number; scoreA: number; code: string; }
const genCode = () => 'BIB-' + Math.random().toString(36).toUpperCase().slice(2, 7);
const LABEL: Record<Resultado, string> = { home: '🇧🇷 Brasil vence', draw: '➖ Empate', away: '🌍 Adversário vence' };
const fmtCel = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

function BolaoSection() {
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [result, setResult] = useState<Resultado | null>(null);
  const [scoreH, setScoreH] = useState('');
  const [scoreA, setScoreA] = useState('');
  const [done, setDone] = useState(false);
  const [code, setCode] = useState('');
  const [confirmedResult, setConfirmedResult] = useState<Resultado | null>(null);
  const [palpites, setPalpites] = useState<Palpite[]>([]);
  const match = matches[0];

  useEffect(() => {
    try { setPalpites(JSON.parse(localStorage.getItem('bib_palpites') || '[]')); } catch { /* */ }
  }, []);

  const celDigits = celular.replace(/\D/g, '');
  const canSubmit = nome.trim().length >= 2 && celDigits.length >= 10 && !!result;

  const submit = () => {
    if (!canSubmit) return;
    const c = genCode();
    const p: Palpite = { matchId: match.id, nome: nome.trim(), celular, result: result!, scoreH: Number(scoreH) || 0, scoreA: Number(scoreA) || 0, code: c };
    const upd = [p, ...palpites];
    localStorage.setItem('bib_palpites', JSON.stringify(upd));
    setPalpites(upd); setCode(c); setConfirmedResult(result); setDone(true);
  };

  const reset = () => { setNome(''); setCelular(''); setResult(null); setScoreH(''); setScoreA(''); setDone(false); setCode(''); setConfirmedResult(null); };

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 24px' };
  const inp: React.CSSProperties = { width: 64, height: 58, borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: 28, fontWeight: 900, textAlign: 'center', outline: 'none' };
  const textInp = (ok: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 16px', borderRadius: 14, outline: 'none',
    background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 15, fontWeight: 600,
    border: `1.5px solid ${ok ? 'rgba(0,224,84,0.5)' : 'rgba(255,255,255,0.14)'}`,
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* ── Identificação ── */}
            <div style={{ ...card, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>👤 Seus dados para participar</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Nome completo *</label>
                  <input
                    type="text" placeholder="Seu nome" value={nome}
                    onChange={e => setNome(e.target.value)} maxLength={50}
                    style={textInp(nome.trim().length >= 2)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Celular (WhatsApp) *</label>
                  <input
                    type="tel" placeholder="(11) 99999-9999" value={celular}
                    onChange={e => setCelular(fmtCel(e.target.value))}
                    style={textInp(celDigits.length >= 10)}
                  />
                </div>
              </div>
            </div>

            {/* ── Jogo ── */}
            <div style={{ ...card, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 42 }}>🇧🇷</div>
                  <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, color: '#fff', marginTop: 4 }}>BRASIL</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 34, color: 'rgba(255,255,255,0.25)' }}>VS</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{match.date}</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 42 }}>❓</div>
                  <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, color: '#fff', marginTop: 4 }}>A DEFINIR</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>📍 {match.venue} · {match.time}</div>
            </div>

            {/* ── Resultado ── */}
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 10 }}>Qual o resultado?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
              {(['home', 'draw', 'away'] as Resultado[]).map(opt => (
                <button key={opt} onClick={() => setResult(opt)} style={{
                  padding: '13px 6px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s',
                  border: `2px solid ${result === opt ? '#FFDF00' : 'rgba(255,255,255,0.1)'}`,
                  background: result === opt ? 'rgba(255,223,0,0.14)' : 'rgba(255,255,255,0.03)',
                  color: result === opt ? '#FFDF00' : 'rgba(255,255,255,0.55)',
                  fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {opt === 'home' ? '🇧🇷 Brasil' : opt === 'draw' ? '➖ Empate' : '🌍 Adversário'}
                </button>
              ))}
            </div>

            {/* ── Placar ── */}
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 10 }}>Placar exato — opcional (vale +250 pts!)</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 24 }}>
              <input type="number" min={0} max={20} value={scoreH} onChange={e => setScoreH(e.target.value)} placeholder="0" style={inp} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 26, fontWeight: 900 }}>×</span>
              <input type="number" min={0} max={20} value={scoreA} onChange={e => setScoreA(e.target.value)} placeholder="0" style={inp} />
            </div>

            <button onClick={submit} disabled={!canSubmit} style={{
              width: '100%', padding: '16px', borderRadius: 999, border: 'none', fontSize: 16, fontWeight: 900,
              cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              background: canSubmit ? 'linear-gradient(135deg,#009C3B,#FFDF00)' : 'rgba(255,255,255,0.08)',
              color: canSubmit ? '#051505' : 'rgba(255,255,255,0.3)',
              boxShadow: canSubmit ? '0 8px 28px rgba(0,156,59,0.35)' : 'none',
            }}>
              {!nome.trim() || !result ? 'Preencha nome, celular e resultado' : '⚽ Registrar Palpite'}
            </button>
          </motion.div>
        ) : (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', ...card }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 34, color: '#fff', marginBottom: 4 }}>Palpite Registrado!</h3>
            <p style={{ color: '#4dff88', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{nome}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>{confirmedResult ? LABEL[confirmedResult] : ''}</p>
            <div style={{ display: 'inline-block', background: 'rgba(255,223,0,0.1)', border: '2px solid rgba(255,223,0,0.35)', borderRadius: 16, padding: '14px 36px', marginBottom: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Código do Palpite</p>
              <p style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 38, color: '#FFDF00', letterSpacing: '0.08em' }}>#{code}</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 22 }}>Guarda este código — você vai precisar para resgatar seus pontos.</p>
            <button onClick={reset} style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 700, padding: '11px 28px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: 14 }}>+ Fazer outro palpite</button>
          </motion.div>
        )}
      </AnimatePresence>

      {palpites.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>Seus palpites ({palpites.length})</p>
          {palpites.slice(0, 3).map(p => (
            <div key={p.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700 }}>{p.nome}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{LABEL[p.result]}</div>
              </div>
              <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 13, color: 'rgba(255,223,0,0.65)' }}>#{p.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function BibNaCopa() {
  const firstMatch = new Date('2026-06-14T15:00:00-07:00');

  const darkBg = 'linear-gradient(150deg,#020A02 0%,#050F05 55%,#02080F 100%)';
  const glass: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20 };

  return (
    <>
      {/* ════ HERO ════ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: darkBg, position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs variant="copa" className="absolute inset-0" style={{ zIndex: 0 }} />

        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '56px 56px', zIndex: 1, pointerEvents: 'none' }} />
        {/* Radial glows */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 75% 25%,rgba(255,223,0,0.09),transparent 45%),radial-gradient(ellipse at 15% 75%,rgba(0,156,59,0.14),transparent 50%)', zIndex: 2, pointerEvents: 'none' }} />

        <div className="container relative" style={{ zIndex: 3, paddingTop: 128, paddingBottom: 80 }}>
          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }} initial="hidden" animate="show" style={{ maxWidth: 780 }}>

            <motion.div variants={hi} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, border: '1.5px solid rgba(0,156,59,0.5)', background: 'rgba(0,156,59,0.1)', padding: '7px 18px', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00FF44', boxShadow: '0 0 10px #00FF44', display: 'inline-block', animation: 'blink 1s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em', color: '#4dff88' }}>⚽ Copa 2026 · Ecossistema BibCar</span>
            </motion.div>

            <motion.h1 variants={hi} style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(80px,14vw,176px)', lineHeight: 0.86, marginBottom: 6 }}>
              <span style={{ background: 'linear-gradient(135deg,#009C3B 0%,#00e054 40%,#FFDF00 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bib</span><br />
              <span style={{ color: '#ffffff' }}>na Copa</span>
            </motion.h1>

            <motion.p variants={hi} style={{ fontSize: 'clamp(15px,1.7vw,19px)', color: 'rgba(255,255,255,0.58)', lineHeight: 1.65, maxWidth: 530, marginBottom: 28 }}>
              Corrida com 30% OFF · Bolão de palpites · Figurinha IA · Ranking dos craques — tudo dentro do app BibCar, o ecossistema completo da Copa 2026.
            </motion.p>

            {/* Ecosystem pills */}
            <motion.div variants={hi} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
              {ecosystem.map(f => (
                <span key={f.title} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, border: `1px solid ${f.color}40`, background: `${f.color}12`, fontSize: 12, fontWeight: 700, color: f.color }}>
                  {f.icon} {f.title}
                </span>
              ))}
            </motion.div>

            <motion.div variants={hi} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115" target="_blank" rel="noopener"
                style={{ display: 'inline-block', padding: '15px 30px', borderRadius: 999, background: 'linear-gradient(135deg,#FFDF00,#FFB800)', color: '#1a0f00', fontWeight: 900, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 32px rgba(255,223,0,0.38)' }}>
                Baixar o app →
              </a>
              <a href="#bolao"
                style={{ display: 'inline-block', padding: '15px 30px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' }}>
                🎰 Entrar no Bolão
              </a>
            </motion.div>

          </motion.div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top,#020A02,transparent)', zIndex: 4 }} />
      </section>

      {/* ════ COUNTDOWN ════ */}
      <section style={{ background: '#020A02', padding: '52px 0' }}>
        <div className="container" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.28)', marginBottom: 18 }}>⚽ 1º jogo do Brasil na Copa em</p>
          <CountdownTimer target={firstMatch} />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 14 }}>14 Jun 2026 · Los Angeles, EUA · Data sujeita a confirmação oficial</p>
        </div>
      </section>

      {/* ════ ECOSSISTEMA ════ */}
      <section style={{ background: '#020A02', padding: '88px 0' }}>
        <div className="container">
          <ScrollReveal className="text-center" style={{ marginBottom: 52 }}>
            <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, border: '1px solid rgba(255,223,0,0.3)', background: 'rgba(255,223,0,0.07)', color: '#FFDF00', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>O Ecossistema</div>
            <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(40px,6vw,78px)', color: '#fff', lineHeight: 1, marginBottom: 10 }}>
              Quatro produtos.{' '}
              <span style={{ background: 'linear-gradient(135deg,#009C3B,#FFDF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Um app.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>Tudo pensado juntos para o maior evento do planeta em 2026.</p>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(232px,1fr))', gap: 14, maxWidth: 1080, margin: '0 auto' }}>
            {ecosystem.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.09}>
                <div {...{ style: { ...glass, padding: 28, height: '100%', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s,transform 0.2s' } as React.CSSProperties }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${f.color}44`; el.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.09)'; el.style.transform = 'none'; }}>
                  <div style={{ position: 'absolute', top: -32, right: -32, width: 100, height: 100, borderRadius: '50%', background: `${f.color}0e`, pointerEvents: 'none' }} />
                  <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, border: `1px solid ${f.color}50`, background: `${f.color}14`, color: f.color, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', marginBottom: 18 }}>{f.tag}</div>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 28, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ BOLÃO ════ */}
      <section id="bolao" style={{ background: 'linear-gradient(150deg,#070E07 0%,#0c1a0a 50%,#070E07 100%)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(255,223,0,0.07),transparent 50%)', pointerEvents: 'none' }} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, border: '1px solid rgba(255,223,0,0.35)', background: 'rgba(255,223,0,0.08)', color: '#FFDF00', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>🎰 Bolão BibCar</div>
            <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(40px,6vw,76px)', color: '#fff', marginBottom: 10 }}>
              Chuta o{' '}
              <span style={{ background: 'linear-gradient(135deg,#FFDF00,#FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>resultado.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>Acumule Copa Points com cada palpite certo e concorra a corridas grátis e prêmios exclusivos.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.12}><BolaoSection /></ScrollReveal>
        </div>
      </section>

      {/* ════ FIGURINHA IA ════ */}
      <section style={{ background: darkBg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%,rgba(0,156,59,0.12),transparent 55%)', pointerEvents: 'none' }} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <PlayerTransformer />
        </div>
      </section>

      {/* ════ JOGOS & 30% OFF ════ */}
      <section style={{ background: '#020A02', padding: '88px 0' }}>
        <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 44 }}>
            <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, border: '1px solid rgba(0,156,59,0.4)', background: 'rgba(0,156,59,0.08)', color: '#4dff88', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>🇧🇷 Jogos do Brasil · Copa 2026</div>
            <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(40px,6vw,74px)', color: '#fff', marginBottom: 10 }}>
              30% OFF em{' '}
              <span style={{ background: 'linear-gradient(135deg,#009C3B,#FFDF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>todos os jogos.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15 }}>Desconto automático, sem cupom, sem enrolação.</p>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {matches.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 0.1}>
                <div style={{ ...glass, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(0,156,59,0.15)', border: '1px solid rgba(0,156,59,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🇧🇷</div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>Fase de Grupos · Jogo {i + 1}</div>
                      <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 20, color: '#fff' }}>Brasil vs. {m.away}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>📍 {m.venue}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 20, color: '#FFDF00' }}>{m.date}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>{m.time}</div>
                    </div>
                    <div style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(0,156,59,0.15)', border: '1px solid rgba(0,156,59,0.4)', textAlign: 'center', minWidth: 64 }}>
                      <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 28, color: '#4dff88', lineHeight: 1 }}>30%</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>OFF</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ COPA REWARDS ════ */}
      <section style={{ background: 'linear-gradient(150deg,#0a0600 0%,#160d00 50%,#0a0600 100%)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(255,149,0,0.07),transparent 50%)', pointerEvents: 'none' }} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 52 }}>
            <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, border: '1px solid rgba(255,149,0,0.4)', background: 'rgba(255,149,0,0.08)', color: '#ff9500', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>🏆 Copa Rewards · Em Breve</div>
            <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(40px,6vw,74px)', color: '#fff', marginBottom: 10 }}>
              Cada corrida,{' '}
              <span style={{ background: 'linear-gradient(135deg,#ff9500,#FFDF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>mais pontos.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>Use BibCar durante a Copa, acerte palpites e suba no ranking para ganhar corridas grátis e prêmios.</p>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, maxWidth: 860, margin: '0 auto 44px' }}>
            {pointsTable.map((r, i) => (
              <ScrollReveal key={i} delay={i * 0.07}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,149,0,0.14)', borderRadius: 14, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.45 }}>{r.action}</span>
                  <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 26, color: '#ff9500', flexShrink: 0 }}>{r.pts}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {prizesTiers.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px' }}>
                  <span style={{ fontSize: 24 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{t.prize}</div>
                  </div>
                  <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, color: '#ff9500' }}>{t.pts.toLocaleString()} pts</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════ RANKING ════ */}
      <section style={{ background: '#020A02', padding: '88px 0' }}>
        <div className="container" style={{ maxWidth: 580, margin: '0 auto' }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 36 }}>
            <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 999, border: '1px solid rgba(201,162,39,0.4)', background: 'rgba(201,162,39,0.08)', color: '#C9A227', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>🏅 Ranking dos Craques</div>
            <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(36px,5vw,64px)', color: '#fff', marginBottom: 6 }}>Quem acerta mais?</h2>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Preview — ranking oficial abre no primeiro jogo do Brasil</p>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockRanking.map((u, i) => (
              <ScrollReveal key={u.name} delay={i * 0.07}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: i === 0 ? 'rgba(201,162,39,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i === 0 ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '14px 18px' }}>
                  <span style={{ fontSize: i < 3 ? 22 : 15, width: 30, textAlign: 'center', fontFamily: 'Bebas Neue,sans-serif', color: 'rgba(255,255,255,0.4)' }}>{u.medal}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{u.rides} corridas · {u.correct} palpites certos</div>
                  </div>
                  <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 26, color: i === 0 ? '#C9A227' : 'rgba(255,255,255,0.45)' }}>{u.pts.toLocaleString()}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>pts</div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4} style={{ textAlign: 'center', marginTop: 22 }}>
            <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>Você entra no ranking hoje mesmo — baixe o app e comece a usar a BibCar.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section style={{ background: darkBg, padding: '96px 0', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%,rgba(0,156,59,0.18),transparent 55%)', pointerEvents: 'none' }} />
        <div className="container relative" style={{ maxWidth: 620, margin: '0 auto', zIndex: 2 }}>
          <ScrollReveal>
            <div style={{ fontSize: 64, marginBottom: 14, filter: 'drop-shadow(0 0 24px rgba(0,156,59,0.55))' }}>🇧🇷</div>
            <h2 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(56px,10vw,116px)', color: '#fff', lineHeight: 0.9, marginBottom: 18 }}>
              Bora{' '}
              <span style={{ background: 'linear-gradient(135deg,#FFDF00,#FF9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>torcer!</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: 17, marginBottom: 8, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 32px' }}>
              Baixe o app, entre no bolão, vira figurinha e ganhe <strong style={{ color: '#FFDF00' }}>30% OFF</strong> durante todos os jogos do Brasil.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <a href="https://apps.apple.com/br/app/bib-car-brasil/id6444271115" target="_blank" rel="noopener"
                style={{ display: 'inline-block', padding: '16px 32px', borderRadius: 999, background: 'linear-gradient(135deg,#FFDF00,#FFB800)', color: '#1a0f00', fontWeight: 900, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 32px rgba(255,223,0,0.38)' }}>
                Baixar para iOS
              </a>
              <a href="https://play.google.com/store/apps/details?id=br.com.bibcarbrasil.passenger.drivermachine" target="_blank" rel="noopener"
                style={{ display: 'inline-block', padding: '16px 32px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                Baixar para Android
              </a>
            </div>
            <div style={{ marginTop: 28 }}>
              <a href="https://wa.me/551151924005" target="_blank" rel="noopener"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                💬 Dúvidas? Fala com a gente no WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
