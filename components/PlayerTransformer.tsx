'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ─── Teams ──────────────────────────────────────────────── */
const TEAMS = [
  { name: 'Brasil',    flag: '🇧🇷', abbr: 'BRA', c1: '#009C3B', c2: '#FFDF00', dark: '#003d16', jersey: 'yellow and green Brazil Seleção Brasileira soccer jersey, number 10 on back' },
  { name: 'Argentina', flag: '🇦🇷', abbr: 'ARG', c1: '#6DC0F5', c2: '#FFFFFF', dark: '#0e3a60', jersey: 'light blue and white Argentina Albiceleste soccer jersey, number 10 on back' },
  { name: 'França',    flag: '🇫🇷', abbr: 'FRA', c1: '#1034A6', c2: '#EF4135', dark: '#060f38', jersey: 'dark blue France Les Bleus soccer jersey, number 10 on back' },
  { name: 'Alemanha',  flag: '🇩🇪', abbr: 'GER', c1: '#CCCCCC', c2: '#000000', dark: '#111111', jersey: 'white Germany Die Mannschaft soccer jersey, number 8 on back' },
  { name: 'Portugal',  flag: '🇵🇹', abbr: 'POR', c1: '#C8102E', c2: '#006600', dark: '#4a0010', jersey: 'red Portugal national soccer jersey, number 7 on back' },
  { name: 'Espanha',   flag: '🇪🇸', abbr: 'ESP', c1: '#AA151B', c2: '#F1BF00', dark: '#420008', jersey: 'red Spain La Roja soccer jersey, number 10 on back' },
  { name: 'Holanda',   flag: '🇳🇱', abbr: 'NED', c1: '#FF6200', c2: '#FFFFFF', dark: '#5a2200', jersey: 'orange Netherlands Oranje soccer jersey, number 10 on back' },
  { name: 'Itália',    flag: '🇮🇹', abbr: 'ITA', c1: '#0057A8', c2: '#FFFFFF', dark: '#001f3d', jersey: 'blue Italy Azzurri soccer jersey, number 9 on back' },
  { name: 'Inglaterra',flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG', c1: '#CF091D', c2: '#FFFFFF', dark: '#3d0006', jersey: 'white England Three Lions soccer jersey, number 10 on back' },
  { name: 'Marrocos',  flag: '🇲🇦', abbr: 'MAR', c1: '#C1272D', c2: '#006233', dark: '#3d0008', jersey: 'red Morocco national soccer jersey, number 9 on back' },
  { name: 'Japão',     flag: '🇯🇵', abbr: 'JPN', c1: '#003087', c2: '#BC002D', dark: '#00103a', jersey: 'dark blue Japan Samurai Blue soccer jersey, number 10 on back' },
  { name: 'Uruguai',   flag: '🇺🇾', abbr: 'URU', c1: '#4B9CD3', c2: '#FFFFFF', dark: '#00163a', jersey: 'light blue Uruguay Celeste soccer jersey, number 10 on back' },
];
type Team = typeof TEAMS[0];

const POSITIONS = ['ATACANTE', 'MEIA', 'PONTA DIREITA', 'CENTROAVANTE', 'CAMISA 10'];
const CARD_NUMS = Array.from({ length: 200 }, (_, i) => i + 50);

function rnd(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomStats() { return { VEL: rnd(88,99), DRI: rnd(87,99), FIN: rnd(86,99), PAS: rnd(88,99), FIS: rnd(85,97) }; }

type Stats = ReturnType<typeof randomStats>;

/* ─── Image helpers ──────────────────────────────────────── */
function resizeImage(file: File, maxSize = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, maxSize / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, 3 * Math.PI / 2);
  ctx.closePath();
}

/* ─── Canvas story generator 1080×1920 ──────────────────── */
async function generateStoryBlob(
  resultUrl: string,
  team: Team,
  name: string,
  position: string,
  stats: Stats,
  cardNum: number,
): Promise<Blob> {
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // proxied player image (CORS-safe)
  const proxyUrl = `/api/fal/proxy-image?url=${encodeURIComponent(resultUrl)}`;
  const [playerImg, logoImg] = await Promise.all([loadImg(proxyUrl), loadImg('/logo.png')]);

  // ── Background ──
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, team.dark);
  bg.addColorStop(0.6, '#080808');
  bg.addColorStop(1, '#040404');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // diagonal stripes
  ctx.save();
  ctx.strokeStyle = team.c1 + '22';
  ctx.lineWidth = 5;
  for (let i = -H; i < W + H; i += 44) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
  }
  ctx.restore();

  // top glow
  const tg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 900);
  tg.addColorStop(0, team.c1 + '66'); tg.addColorStop(1, 'transparent');
  ctx.fillStyle = tg; ctx.fillRect(0, 0, W, H);

  // bottom glow
  const bg2 = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, 700);
  bg2.addColorStop(0, team.c1 + '44'); bg2.addColorStop(1, 'transparent');
  ctx.fillStyle = bg2; ctx.fillRect(0, 0, W, H);

  // ── Top headline ──
  ctx.textAlign = 'center';
  ctx.fillStyle = team.c2 === '#000000' ? '#ffffff' : team.c2;
  ctx.font = 'bold 68px Arial';
  ctx.fillText('FUI CONVOCADO!', W / 2, 220);
  ctx.font = '40px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(`${team.flag}  Seleção de ${team.name}  ·  Copa 2026`, W / 2, 285);

  // ── Card ──
  const cW = 560, cH = 784, cX = (W - cW) / 2, cY = 360, cR = 20;

  ctx.save();
  rrect(ctx, cX, cY, cW, cH, cR); ctx.clip();

  // card bg
  const cbg = ctx.createLinearGradient(cX, cY, cX + cW, cY + cH);
  cbg.addColorStop(0, team.dark); cbg.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = cbg; ctx.fillRect(cX, cY, cW, cH);

  // card stripes
  ctx.strokeStyle = team.c1 + '20'; ctx.lineWidth = 3;
  for (let i = -cH; i < cW + cH; i += 30) {
    ctx.beginPath(); ctx.moveTo(cX + i, cY); ctx.lineTo(cX + i + cH, cY + cH); ctx.stroke();
  }

  // card header
  const hH = 80;
  const hg = ctx.createLinearGradient(cX, cY, cX + cW, cY + hH);
  hg.addColorStop(0, team.c1); hg.addColorStop(1, team.dark);
  ctx.fillStyle = hg; ctx.fillRect(cX, cY, cW, hH);

  // header text
  ctx.font = 'bold 32px Arial'; ctx.fillStyle = '#fff';
  ctx.textAlign = 'left'; ctx.fillText(team.flag + '  ' + team.abbr, cX + 20, cY + 50);
  ctx.font = 'bold 24px Arial'; ctx.textAlign = 'center';
  ctx.fillStyle = team.c2 === '#000000' ? '#fff' : team.c2;
  ctx.fillText('COPA MUNDO 2026', cX + cW / 2, cY + 50);
  ctx.font = '22px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.textAlign = 'right'; ctx.fillText(`#${cardNum}`, cX + cW - 18, cY + 50);

  // player photo
  const pY = cY + hH;
  ctx.drawImage(playerImg, cX, pY, cW, cH - hH);

  // bottom fade
  const fade = ctx.createLinearGradient(0, cY + cH - 320, 0, cY + cH);
  fade.addColorStop(0, 'transparent');
  fade.addColorStop(0.4, team.dark + 'cc');
  fade.addColorStop(1, '#0a0a0aff');
  ctx.fillStyle = fade; ctx.fillRect(cX, cY + cH - 320, cW, 320);

  // OVR badge
  const ovr = Math.round((stats.VEL + stats.DRI + stats.FIN + stats.PAS + stats.FIS) / 5);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  rrect(ctx, cX + 14, cY + hH + 14, 76, 84, 10); ctx.fill();
  ctx.font = 'bold 46px Arial'; ctx.fillStyle = team.c2 === '#000000' ? '#fff' : team.c2;
  ctx.textAlign = 'center'; ctx.fillText(String(ovr), cX + 52, cY + hH + 64);
  ctx.font = 'bold 18px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('OVR', cX + 52, cY + hH + 84);

  // player name
  const nameY = cY + cH - 200;
  ctx.save();
  ctx.shadowColor = team.c1; ctx.shadowBlur = 24;
  ctx.font = `bold ${name.length > 10 ? 46 : 56}px Arial`;
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left';
  ctx.fillText(name.toUpperCase(), cX + 18, nameY);
  ctx.restore();

  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = team.c2 === '#000000' ? '#ddd' : team.c2;
  ctx.textAlign = 'left'; ctx.fillText(position, cX + 18, nameY + 32);

  // stats
  const sKeys = Object.keys(stats) as (keyof Stats)[];
  const sW = (cW - 36) / 5;
  sKeys.forEach((k, i) => {
    const sx = cX + 18 + i * sW, sy = nameY + 50;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    rrect(ctx, sx, sy, sW - 6, 58, 8); ctx.fill();
    ctx.font = 'bold 28px Arial'; ctx.textAlign = 'center';
    ctx.fillStyle = team.c2 === '#000000' ? '#fff' : team.c2;
    ctx.fillText(String(stats[k]), sx + (sW - 6) / 2, sy + 36);
    ctx.font = '16px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(k, sx + (sW - 6) / 2, sy + 52);
  });

  // bibcar logo
  const lS = 40;
  ctx.drawImage(logoImg, cX + cW - lS - 12, cY + cH - lS - 12, lS, lS);
  ctx.font = 'bold 22px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.textAlign = 'right'; ctx.fillText('BIBCAR', cX + cW - lS - 18, cY + cH - 18);

  ctx.restore(); // end card clip

  // card border (outer glow rings)
  ctx.save();
  rrect(ctx, cX - 4, cY - 4, cW + 8, cH + 8, cR + 4);
  ctx.strokeStyle = team.c1; ctx.lineWidth = 6; ctx.stroke();
  rrect(ctx, cX - 10, cY - 10, cW + 20, cH + 20, cR + 8);
  ctx.strokeStyle = team.c2 === '#000000' ? '#fff' : team.c2;
  ctx.lineWidth = 3; ctx.globalAlpha = 0.5; ctx.stroke();
  ctx.restore();

  // ── Bottom hashtags ──
  const botY = cY + cH + 80;
  ctx.font = 'bold 38px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.textAlign = 'center'; ctx.fillText('#Copa2026  #BibCar  #FigurinhaIA', W / 2, botY);
  ctx.font = '28px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('bibcarbrasil.com.br', W / 2, botY + 48);

  // big BibCar logo bottom center
  const bLS = 72;
  ctx.drawImage(logoImg, W / 2 - bLS / 2, botY + 70, bLS, bLS);

  return new Promise(res => canvas.toBlob(b => res(b!), 'image/png'));
}

/* ─── Team Roulette ──────────────────────────────────────── */
function TeamRoulette({ onDone }: { onDone: (t: Team) => void }) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const winner = useRef(pick(TEAMS));

  useEffect(() => {
    let i = 0, delay = 60, stopped = false;
    function step() {
      if (stopped) return;
      setIdx(c => (c + 1) % TEAMS.length);
      i++;
      if (i > 22) delay = Math.min(delay + 35, 500);
      if (delay >= 500) {
        stopped = true; setDone(true);
        setIdx(TEAMS.indexOf(winner.current));
        setTimeout(() => onDone(winner.current), 700);
        return;
      }
      setTimeout(step, delay);
    }
    setTimeout(step, delay);
    return () => { stopped = true; };
  }, []); // eslint-disable-line

  const t = done ? winner.current : TEAMS[idx];
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
        Sorteando seu time…
      </p>
      <motion.div
        key={t.abbr}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.06 }}
        style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          background: `linear-gradient(135deg,${t.c1}33,${t.c2 === '#FFFFFF' ? '#ffffff11' : t.c2 + '22'})`,
          border: `2px solid ${t.c1}88`,
          borderRadius: 20, padding: '22px 44px', minWidth: 220,
        }}
      >
        <span style={{ fontSize: 60 }}>{t.flag}</span>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 24, letterSpacing: '0.04em' }}>{t.name}</span>
        <span style={{ color: t.c1, fontWeight: 700, fontSize: 13, letterSpacing: '0.2em' }}>{t.abbr}</span>
      </motion.div>
    </div>
  );
}

/* ─── HTML Preview Card ──────────────────────────────────── */
function FigurinhaCard({ imageUrl, team, name, position, stats, cardNum, size = 300 }: {
  imageUrl: string; team: Team; name: string; position: string;
  stats: Stats; cardNum: number; size?: number;
}) {
  const scale = size / 300;
  const H = Math.round(420 * scale);
  const ovr = Math.round((stats.VEL + stats.DRI + stats.FIN + stats.PAS + stats.FIS) / 5);
  const textColor = team.c2 === '#000000' ? '#ffffff' : team.c2;

  return (
    <div style={{
      position: 'relative', width: size, height: H, borderRadius: 16 * scale,
      overflow: 'hidden', flexShrink: 0,
      boxShadow: `0 0 0 ${3 * scale}px ${team.c1}, 0 0 0 ${5 * scale}px ${team.c2 === '#000000' ? '#fff' : team.c2}, 0 20px 60px rgba(0,0,0,0.8), 0 0 80px ${team.c1}66`,
    }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(155deg,${team.dark} 0%,#080808 100%)` }} />
      {/* stripes */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(135deg,${team.c1}18 0,${team.c1}18 2px,transparent 2px,transparent 20px)` }} />
      {/* top glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: H * 0.45, background: `radial-gradient(ellipse at 50% 0%,${team.c1}55,transparent 70%)` }} />
      {/* shimmer sweep */}
      <motion.div
        animate={{ x: ['-120%', '220%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear', repeatDelay: 3 }}
        style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', background: `linear-gradient(105deg,transparent 30%,${textColor}30 50%,transparent 70%)` }}
      />

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44 * scale,
        background: `linear-gradient(135deg,${team.c1},${team.dark})`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${12 * scale}px`, zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 * scale }}>
          <span style={{ fontSize: 20 * scale }}>{team.flag}</span>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 * scale, letterSpacing: '0.12em' }}>{team.abbr}</span>
        </div>
        <span style={{ color: textColor, fontWeight: 900, fontSize: 10 * scale, letterSpacing: '0.18em' }}>COPA MUNDO 2026</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 * scale, fontWeight: 700 }}>#{cardNum}</span>
      </div>

      {/* Photo */}
      <div style={{ position: 'absolute', top: 44 * scale, left: 0, right: 0, bottom: 0 }}>
        <Image src={imageUrl} alt="Player" fill style={{ objectFit: 'cover', objectPosition: 'top center' }} unoptimized />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: H * 0.5, background: `linear-gradient(to top,#080808,${team.dark}cc 40%,transparent)` }} />
      </div>

      {/* OVR */}
      <div style={{
        position: 'absolute', top: (44 + 10) * scale, left: 10 * scale, zIndex: 6,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        borderRadius: 10 * scale, padding: `${4 * scale}px ${10 * scale}px`,
        border: `1px solid ${team.c1}66`, textAlign: 'center',
      }}>
        <div style={{ color: textColor, fontSize: 28 * scale, fontWeight: 900, lineHeight: 1 }}>{ovr}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8 * scale, letterSpacing: '0.1em', fontWeight: 700 }}>OVR</div>
      </div>

      {/* Info panel */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: `0 ${12 * scale}px ${10 * scale}px`, zIndex: 6 }}>
        <div style={{ color: '#fff', fontSize: (name.length > 10 ? 18 : 22) * scale, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', textShadow: `0 2px 12px rgba(0,0,0,0.9),0 0 20px ${team.c1}`, lineHeight: 1, marginBottom: 2 * scale }}>
          {name || 'JOGADOR'}
        </div>
        <div style={{ color: textColor, fontSize: 8 * scale, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 7 * scale }}>{position}</div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 * scale, marginBottom: 8 * scale }}>
          {(Object.keys(stats) as (keyof Stats)[]).map(k => (
            <div key={k} style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: `1px solid ${team.c1}44`, borderRadius: 6 * scale, padding: `${3 * scale}px 0`, textAlign: 'center' }}>
              <div style={{ color: textColor, fontSize: 13 * scale, fontWeight: 900, lineHeight: 1 }}>{stats[k]}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7 * scale, letterSpacing: '0.08em' }}>{k}</div>
            </div>
          ))}
        </div>

        {/* BibCar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 * scale, borderTop: `1px solid ${team.c1}33`, paddingTop: 6 * scale }}>
          <div style={{ width: 18 * scale, height: 18 * scale, borderRadius: 4 * scale, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
            <Image src="/logo.png" alt="BibCar" width={18} height={18} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 9 * scale, fontWeight: 700, letterSpacing: '0.12em' }}>BIBCAR</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
type Stage = 'idle' | 'preview' | 'roulette' | 'loading' | 'result' | 'sharing' | 'error';

export default function PlayerTransformer() {
  const [stage, setStage] = useState<Stage>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [team, setTeam] = useState<Team | null>(null);
  const [position] = useState(() => pick(POSITIONS));
  const [stats] = useState(randomStats);
  const [cardNum] = useState(() => pick(CARD_NUMS));
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [storyBlob, setStoryBlob] = useState<Blob | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dataUrlRef = useRef<string>('');

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const dataUrl = await resizeImage(file);
    dataUrlRef.current = dataUrl;
    setPreviewUrl(dataUrl);
    setStage('preview');
  }, []);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); };

  const onTeamPicked = (t: Team) => {
    setTeam(t);
    setTimeout(() => runTransform(t), 600);
  };

  const runTransform = async (t: Team) => {
    setStage('loading');
    const prompt = `Athletic football player wearing ${t.jersey}, action pose on a stadium pitch, Maracanã crowd background, FIFA World Cup 2026, dramatic stadium lighting, photorealistic, ultra sharp, professional sports photography`;
    try {
      const res = await fetch('/api/fal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl: dataUrlRef.current, prompt }),
      });
      const data = await res.json() as { imageUrl?: string; error?: string };
      if (!res.ok || !data.imageUrl) throw new Error(data.error ?? 'Erro desconhecido');
      setResultUrl(data.imageUrl);
      setStage('result');
    } catch (e) {
      setErrorMsg(String(e));
      setStage('error');
    }
  };

  const buildAndShare = async (target: 'story' | 'download') => {
    if (!resultUrl || !team) return;
    setStage('sharing');
    try {
      const blob = storyBlob ?? await generateStoryBlob(resultUrl, team, playerName || 'JOGADOR', position, stats, cardNum);
      setStoryBlob(blob);
      const file = new File([blob], 'figurinha-copa2026.png', { type: 'image/png' });

      if (target === 'story' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Fui convocado pela ${team.name}! 🏆`, text: '⚽ Olha minha figurinha da Copa 2026 pelo app BibCar!\n\n#Copa2026 #BibCar' });
      } else {
        // fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'figurinha-copa2026.png'; a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // user cancelled share or download failed — just show fullscreen
      setFullscreen(true);
    } finally {
      setStage('result');
    }
  };

  const reset = () => {
    setStage('idle'); setPreviewUrl(null); setResultUrl(null);
    setErrorMsg(''); setFullscreen(false); setStoryBlob(null);
    dataUrlRef.current = '';
    if (fileRef.current) fileRef.current.value = '';
  };

  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

  return (
    <section className="relative py-24 px-4">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,rgba(0,156,59,0.25),rgba(255,223,0,0.2))', border: '1px solid rgba(255,223,0,0.35)', color: '#FFDF00', borderRadius: 999, padding: '4px 18px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 18 }}>
            ✨ FIGURINHA IA · COPA 2026
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem,5vw,2.9rem)', fontWeight: 900, lineHeight: 1.1, color: '#fff', marginBottom: 14 }}>
            Vira figurinha{' '}
            <span style={{ background: 'linear-gradient(90deg,#009C3B,#FFDF00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>da Copa 🏆</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
            Manda sua foto · a IA te transforma em jogador · sorteia seu time · gera figurinha instagramável
          </p>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">

          {/* IDLE */}
          {stage === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div
                onDrop={onDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed rgba(255,223,0,0.35)', borderRadius: 24, background: 'rgba(0,156,59,0.05)', padding: '56px 32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,223,0,0.65)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,156,59,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,223,0,0.35)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,156,59,0.05)'; }}
              >
                <div style={{ fontSize: 64, marginBottom: 16 }}>📸</div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>Manda sua foto</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginBottom: 28 }}>A IA te transforma em jogador e sorteia seu time</p>
                <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#009C3B,#007a2e)', color: '#fff', fontWeight: 700, padding: '12px 32px', borderRadius: 999, fontSize: '0.95rem' }}>
                  Escolher Foto
                </span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={onInput} style={{ display: 'none' }} />
            </motion.div>
          )}

          {/* PREVIEW */}
          {stage === 'preview' && previewUrl && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 24px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,223,0,0.5)', boxShadow: '0 0 40px rgba(0,156,59,0.4)' }}>
                <Image src={previewUrl} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 14, fontSize: '0.95rem' }}>Qual nome vai na figurinha?</p>
              <input
                type="text" maxLength={14} placeholder="SEU NOME (opcional)"
                value={playerName} onChange={e => setPlayerName(e.target.value.toUpperCase())}
                style={{ display: 'block', margin: '0 auto 28px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,223,0,0.3)', borderRadius: 12, padding: '12px 20px', color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', textAlign: 'center', outline: 'none', width: '100%', maxWidth: 280 }}
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setStage('roulette')} style={{ background: 'linear-gradient(135deg,#009C3B,#FFDF00)', color: '#051505', fontWeight: 900, padding: '14px 36px', borderRadius: 999, border: 'none', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.04em' }}>
                  🎲 Sortear meu time!
                </button>
                <button onClick={reset} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', padding: '14px 24px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                  Trocar foto
                </button>
              </div>
            </motion.div>
          )}

          {/* ROULETTE */}
          {stage === 'roulette' && (
            <motion.div key="roulette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TeamRoulette onDone={onTeamPicked} />
            </motion.div>
          )}

          {/* LOADING */}
          {stage === 'loading' && team && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{team.flag}</div>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }} style={{ fontSize: 58, display: 'inline-block', marginBottom: 24 }}>⚽</motion.div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>Criando sua figurinha pela {team.name}…</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>Pode demorar ~1 minuto. Não feche a página!</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                {[0,1,2].map(i => <motion.div key={i} animate={{ opacity:[0.3,1,0.3] }} transition={{ repeat:Infinity, duration:1.4, delay:i*0.46 }} style={{ width:9, height:9, borderRadius:'50%', background: team.c2 === '#000000' ? '#fff' : team.c2 }} />)}
              </div>
            </motion.div>
          )}

          {/* SHARING skeleton */}
          {stage === 'sharing' && team && (
            <motion.div key="sharing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '64px 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: 52, display: 'inline-block', marginBottom: 20 }}>⚙️</motion.div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>Gerando imagem para compartilhar…</p>
            </motion.div>
          )}

          {/* RESULT */}
          {stage === 'result' && resultUrl && team && (
            <motion.div key="result" initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.55, ease }} style={{ textAlign:'center' }}>
              {/* team reveal banner */}
              <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} style={{ marginBottom:20 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:10, background:`linear-gradient(135deg,${team.c1}33,${team.c2 === '#000000' ? '#fff1' : team.c2+'22'})`, border:`1.5px solid ${team.c1}88`, borderRadius:999, padding:'8px 20px' }}>
                  <span style={{ fontSize:22 }}>{team.flag}</span>
                  <span style={{ color:'#fff', fontWeight:900, fontSize:'0.9rem', letterSpacing:'0.05em' }}>Você foi convocado pela {team.name}! 🏆</span>
                </span>
              </motion.div>

              {/* card floating */}
              <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
                <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity, duration:3.2, ease:'easeInOut' }}>
                  <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} position={position} stats={stats} cardNum={cardNum} size={300} />
                </motion.div>
              </div>

              {/* Share buttons */}
              <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', maxWidth:420, margin:'0 auto' }}>
                <button
                  onClick={() => buildAndShare('story')}
                  style={{ flex:'1 1 180px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:`linear-gradient(135deg,${team.c1},${team.c2 === '#000000' ? '#444' : team.c2 + 'cc'})`, color: team.c2 === '#FFFFFF' || team.c2 === '#000000' ? '#fff' : '#051505', fontWeight:900, padding:'14px 24px', borderRadius:14, border:'none', fontSize:'0.95rem', cursor:'pointer' }}
                >
                  <span style={{ fontSize:20 }}>📲</span>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontSize:'0.85rem', opacity:0.75, lineHeight:1 }}>Compartilhar</div>
                    <div>Instagram / WhatsApp</div>
                  </div>
                </button>
                <button
                  onClick={() => buildAndShare('download')}
                  style={{ flex:'1 1 140px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.8)', fontWeight:700, padding:'14px 20px', borderRadius:14, border:'1px solid rgba(255,255,255,0.15)', fontSize:'0.9rem', cursor:'pointer' }}
                >
                  <span>⬇</span> Baixar PNG
                </button>
                <button
                  onClick={() => setFullscreen(true)}
                  style={{ flex:'1 1 140px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.55)', fontWeight:600, padding:'14px 20px', borderRadius:14, border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.85rem', cursor:'pointer' }}
                >
                  🔍 Tela cheia
                </button>
              </div>
              <button onClick={reset} style={{ marginTop:16, background:'transparent', color:'rgba(255,255,255,0.3)', border:'none', cursor:'pointer', fontSize:'0.82rem' }}>
                Tentar outra foto
              </button>
            </motion.div>
          )}

          {/* ERROR */}
          {stage === 'error' && (
            <motion.div key="error" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ fontSize:52, marginBottom:14 }}>😅</div>
              <p style={{ color:'#ff6b6b', fontWeight:700, fontSize:'1.05rem', marginBottom:8 }}>Eita, deu ruim!</p>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.84rem', marginBottom:28, maxWidth:340, margin:'0 auto 28px' }}>{errorMsg.replace('Error:','').trim()}</p>
              <button onClick={reset} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontWeight:700, padding:'12px 32px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer' }}>Tentar de novo</button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {fullscreen && resultUrl && team && (
          <motion.div
            key="fs" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setFullscreen(false)}
            style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.96)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, cursor:'pointer' }}
          >
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:20, letterSpacing:'0.05em', textAlign:'center' }}>
              📱 Pressione e segure para salvar · Toque fora para fechar
            </p>
            <div onClick={e => e.stopPropagation()}>
              <FigurinhaCard imageUrl={resultUrl} team={team} name={playerName||'JOGADOR'} position={position} stats={stats} cardNum={cardNum} size={Math.min(320, window.innerWidth - 48)} />
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => buildAndShare('story')} style={{ background:`linear-gradient(135deg,${team.c1},${team.c2 === '#000000' ? '#555' : team.c2 + 'cc'})`, color:'#fff', fontWeight:800, padding:'11px 24px', borderRadius:999, border:'none', fontSize:'0.88rem', cursor:'pointer' }}>
                📲 Compartilhar
              </button>
              <button onClick={() => buildAndShare('download')} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontWeight:700, padding:'11px 22px', borderRadius:999, border:'1px solid rgba(255,255,255,0.2)', fontSize:'0.88rem', cursor:'pointer' }}>
                ⬇ Baixar PNG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
