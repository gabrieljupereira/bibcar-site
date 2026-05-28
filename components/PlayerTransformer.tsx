'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PROMPT =
  'Brazilian football player wearing yellow and green national team jersey number 10, Maracanã stadium background, professional sports photography, photorealistic, sharp focus, athletic pose';

function resizeImageToDataUrl(file: File, maxSize = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = reject;
    img.src = url;
  });
}

type Stage = 'idle' | 'preview' | 'loading' | 'result' | 'error';

export default function PlayerTransformer() {
  const [stage, setStage] = useState<Stage>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const dataUrlRef = useRef<string>('');

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const dataUrl = await resizeImageToDataUrl(file);
    dataUrlRef.current = dataUrl;
    setPreviewUrl(dataUrl);
    setStage('preview');
  }, []);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const transform = async () => {
    setStage('loading');
    try {
      const res = await fetch('/api/fal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl: dataUrlRef.current, prompt: PROMPT }),
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

  const reset = () => {
    setStage('idle');
    setPreviewUrl(null);
    setResultUrl(null);
    setErrorMsg('');
    dataUrlRef.current = '';
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <section className="relative py-24 px-4">
      {/* section heading */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg,rgba(0,156,59,0.25),rgba(255,223,0,0.2))',
              border: '1px solid rgba(255,223,0,0.35)',
              color: '#FFDF00',
              borderRadius: 999,
              padding: '4px 18px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: 18,
            }}
          >
            ✨ IA EXCLUSIVA BIB NA COPA
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem,5vw,3rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#fff',
              marginBottom: 16,
            }}
          >
            Vira jogador da{' '}
            <span
              style={{
                background: 'linear-gradient(90deg,#009C3B,#FFDF00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Seleção
            </span>{' '}
            🇧🇷
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto' }}>
            Manda sua foto e nossa IA transforma você em jogador da Seleção Brasileira. Surpreenda seus amigos!
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* IDLE — upload zone */}
          {stage === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onDrop={onDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed rgba(255,223,0,0.4)',
                  borderRadius: 24,
                  background: 'rgba(0,156,59,0.06)',
                  padding: '64px 32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,223,0,0.7)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,156,59,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,223,0,0.4)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,156,59,0.06)';
                }}
              >
                <div style={{ fontSize: 64, marginBottom: 16 }}>📸</div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>
                  Arraste sua foto aqui
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: 24 }}>
                  ou clique para escolher do celular / computador
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg,#009C3B,#007a2e)',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '12px 32px',
                    borderRadius: 999,
                    fontSize: '0.95rem',
                  }}
                >
                  Escolher Foto
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={onInput}
                style={{ display: 'none' }}
              />
            </motion.div>
          )}

          {/* PREVIEW — confirm before sending */}
          {stage === 'preview' && previewUrl && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 260,
                  height: 260,
                  margin: '0 auto 28px',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '3px solid rgba(255,223,0,0.5)',
                  boxShadow: '0 0 40px rgba(0,156,59,0.4)',
                }}
              >
                <Image src={previewUrl} alt="Sua foto" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 28, fontSize: '0.95rem' }}>
                Pronto! Vamos transformar você em jogador? ⚽
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={transform}
                  style={{
                    background: 'linear-gradient(135deg,#009C3B,#FFDF00)',
                    color: '#051505',
                    fontWeight: 900,
                    padding: '14px 40px',
                    borderRadius: 999,
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                  }}
                >
                  🚀 Transformar Agora!
                </button>
                <button
                  onClick={reset}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    padding: '14px 28px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  Trocar foto
                </button>
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {stage === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '60px 0' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                style={{ fontSize: 72, display: 'inline-block', marginBottom: 28 }}
              >
                ⚽
              </motion.div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: 10 }}>
                A IA está treinando você...
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                Pode demorar até 1 minutinho. Não feche a página!
              </p>
              {/* progress dots */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 28 }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#FFDF00',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT — FIFA card style */}
          {stage === 'result' && resultUrl && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center' }}
            >
              {/* gold card */}
              <div
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  background: 'linear-gradient(150deg,#c8a84b 0%,#f5d778 40%,#c8a84b 100%)',
                  borderRadius: 24,
                  padding: '6px',
                  boxShadow: '0 0 60px rgba(255,223,0,0.5), 0 20px 60px rgba(0,0,0,0.6)',
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(150deg,#1a4d2e 0%,#0d2b19 100%)',
                    borderRadius: 20,
                    padding: '20px 20px 16px',
                    minWidth: 220,
                  }}
                >
                  {/* rating badge */}
                  <div style={{ textAlign: 'left', marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: '#f5d778',
                        lineHeight: 1,
                        display: 'block',
                      }}
                    >
                      99
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f5d778', letterSpacing: '0.1em' }}>
                      ATK
                    </span>
                  </div>
                  {/* player image */}
                  <div
                    style={{
                      position: 'relative',
                      width: 200,
                      height: 200,
                      margin: '0 auto 12px',
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <Image src={resultUrl} alt="Jogador" fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  {/* name */}
                  <p
                    style={{
                      color: '#f5d778',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    ⚽ Seleção BIB
                  </p>
                  {/* mini stats */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 8,
                      borderTop: '1px solid rgba(245,215,120,0.3)',
                      paddingTop: 10,
                    }}
                  >
                    {[['VEL', '97'], ['DRI', '96'], ['CHU', '98']].map(([label, val]) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', color: '#f5d778', fontWeight: 900, fontSize: 15 }}>
                          {val}
                        </span>
                        <span style={{ color: 'rgba(245,215,120,0.6)', fontSize: 9, letterSpacing: '0.1em' }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ color: '#FFDF00', fontWeight: 700, fontSize: '1.1rem', marginBottom: 24 }}>
                🏆 Você está escalado para a Copa 2026!
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={resultUrl}
                  download="meu-card-copa.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg,#009C3B,#FFDF00)',
                    color: '#051505',
                    fontWeight: 900,
                    padding: '12px 32px',
                    borderRadius: 999,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  ⬇ Baixar Card
                </a>
                <button
                  onClick={reset}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    padding: '12px 28px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Tentar outra foto
                </button>
              </div>
            </motion.div>
          )}

          {/* ERROR */}
          {stage === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '48px 0' }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>😅</div>
              <p style={{ color: '#ff6b6b', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
                Eita, algo deu errado!
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
                {errorMsg.replace('Error: ', '')}
              </p>
              <button
                onClick={reset}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: 700,
                  padding: '12px 32px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                }}
              >
                Tentar de novo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
