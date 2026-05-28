export type OrbVariant = 'home' | 'passageiro' | 'motorista' | 'franqueado' | 'copa';

interface OrbDef {
  color: string;
  glow: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

const ORBS: Record<OrbVariant, OrbDef[]> = {
  home: [
    { color: '#FFD23F', glow: 'rgba(255,210,63,0.55)', size: 480, x: 78, y: 28, duration: 7, delay: 0 },
    { color: '#C13EFF', glow: 'rgba(193,62,255,0.45)', size: 340, x: 88, y: 72, duration: 9, delay: -3 },
    { color: '#FF9500', glow: 'rgba(255,149,0,0.35)', size: 240, x: 55, y: 15, duration: 8, delay: -5 },
    { color: '#A930F0', glow: 'rgba(169,48,240,0.3)', size: 180, x: 68, y: 85, duration: 11, delay: -2 },
  ],
  passageiro: [
    { color: '#C13EFF', glow: 'rgba(193,62,255,0.55)', size: 500, x: 80, y: 32, duration: 7, delay: 0 },
    { color: '#FF2D8E', glow: 'rgba(255,45,142,0.4)', size: 320, x: 90, y: 75, duration: 9, delay: -3 },
    { color: '#A930F0', glow: 'rgba(169,48,240,0.35)', size: 220, x: 60, y: 10, duration: 8, delay: -4 },
    { color: '#C13EFF', glow: 'rgba(193,62,255,0.25)', size: 160, x: 72, y: 88, duration: 10, delay: -1 },
  ],
  motorista: [
    { color: '#FFD23F', glow: 'rgba(255,210,63,0.55)', size: 500, x: 78, y: 30, duration: 7, delay: 0 },
    { color: '#FF9500', glow: 'rgba(255,149,0,0.45)', size: 340, x: 88, y: 72, duration: 9, delay: -3 },
    { color: '#FFB627', glow: 'rgba(255,182,39,0.35)', size: 220, x: 60, y: 12, duration: 8, delay: -5 },
    { color: '#FFD23F', glow: 'rgba(255,210,63,0.25)', size: 160, x: 70, y: 85, duration: 11, delay: -2 },
  ],
  copa: [
    { color: '#009C3B', glow: 'rgba(0,156,59,0.65)', size: 560, x: 82, y: 26, duration: 7, delay: 0 },
    { color: '#FFDF00', glow: 'rgba(255,223,0,0.55)', size: 380, x: 90, y: 74, duration: 9, delay: -3 },
    { color: '#009C3B', glow: 'rgba(0,156,59,0.4)', size: 260, x: 60, y: 10, duration: 8, delay: -5 },
    { color: '#002776', glow: 'rgba(0,39,118,0.45)', size: 200, x: 72, y: 88, duration: 11, delay: -2 },
  ],
  franqueado: [
    { color: '#FFD23F', glow: 'rgba(255,210,63,0.5)', size: 460, x: 76, y: 28, duration: 7, delay: 0 },
    { color: '#C13EFF', glow: 'rgba(193,62,255,0.4)', size: 320, x: 88, y: 72, duration: 9, delay: -3 },
    { color: '#FF9500', glow: 'rgba(255,149,0,0.3)', size: 220, x: 58, y: 14, duration: 8, delay: -4 },
    { color: '#A930F0', glow: 'rgba(169,48,240,0.25)', size: 160, x: 70, y: 86, duration: 10, delay: -1 },
  ],
};

interface Props {
  variant?: OrbVariant;
  className?: string;
  style?: React.CSSProperties;
}

export default function FloatingOrbs({ variant = 'home', className = '', style }: Props) {
  const orbs = ORBS[variant];

  return (
    <div className={className} style={{ ...style, overflow: 'hidden', pointerEvents: 'none' }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 38% 38%, ${orb.color}cc 0%, ${orb.color}44 40%, transparent 70%)`,
            boxShadow: `0 0 ${orb.size * 0.3}px ${orb.glow}, 0 0 ${orb.size * 0.6}px ${orb.glow.replace(')', ', 0.2)')}`,
            filter: 'blur(2px)',
            animation: `float ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
