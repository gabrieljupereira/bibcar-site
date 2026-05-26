'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import React, { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';

export type OrbVariant = 'home' | 'passageiro' | 'motorista' | 'franqueado';

interface OrbConfig {
  position: [number, number, number];
  color: string;
  emissive: string;
  scale: number;
  speed: number;
  distort: number;
}

const CONFIGS: Record<OrbVariant, OrbConfig[]> = {
  home: [
    { position: [2.8, 1.2, -2], color: '#FFD23F', emissive: '#FFD23F', scale: 1.15, speed: 1.4, distort: 0.38 },
    { position: [-2.8, -0.6, -1.5], color: '#C13EFF', emissive: '#C13EFF', scale: 0.85, speed: 2.0, distort: 0.55 },
    { position: [0.4, 2.2, -3], color: '#FF9500', emissive: '#FF9500', scale: 0.65, speed: 1.7, distort: 0.48 },
    { position: [3.8, -1.6, -2.5], color: '#A930F0', emissive: '#A930F0', scale: 0.95, speed: 1.2, distort: 0.3 },
    { position: [-0.8, 1.8, -1.8], color: '#FFB627', emissive: '#FFB627', scale: 0.55, speed: 2.3, distort: 0.62 },
    { position: [-3.8, 0.6, -3], color: '#C13EFF', emissive: '#C13EFF', scale: 1.05, speed: 1.6, distort: 0.42 },
  ],
  motorista: [
    { position: [2.8, 1.2, -2], color: '#FFD23F', emissive: '#FFD23F', scale: 1.25, speed: 1.4, distort: 0.38 },
    { position: [-2.5, -0.6, -1.5], color: '#FFB627', emissive: '#FFB627', scale: 0.85, speed: 2.0, distort: 0.55 },
    { position: [0.4, 2.2, -3], color: '#FF9500', emissive: '#FF9500', scale: 0.7, speed: 1.7, distort: 0.48 },
    { position: [3.8, -1.6, -2.5], color: '#FFD23F', emissive: '#FFD23F', scale: 0.95, speed: 1.2, distort: 0.3 },
    { position: [-0.8, 1.8, -1.8], color: '#FFB627', emissive: '#FFB627', scale: 0.6, speed: 2.3, distort: 0.62 },
    { position: [-3.8, 0.6, -3], color: '#FF9500', emissive: '#FF9500', scale: 1.05, speed: 1.6, distort: 0.42 },
  ],
  passageiro: [
    { position: [2.8, 1.2, -2], color: '#C13EFF', emissive: '#C13EFF', scale: 1.15, speed: 1.4, distort: 0.42 },
    { position: [-2.8, -0.6, -1.5], color: '#FF2D8E', emissive: '#FF2D8E', scale: 0.85, speed: 2.0, distort: 0.58 },
    { position: [0.4, 2.2, -3], color: '#A930F0', emissive: '#A930F0', scale: 0.65, speed: 1.7, distort: 0.48 },
    { position: [3.8, -1.6, -2.5], color: '#C13EFF', emissive: '#C13EFF', scale: 0.95, speed: 1.2, distort: 0.35 },
    { position: [-0.8, 1.8, -1.8], color: '#FF2D8E', emissive: '#FF2D8E', scale: 0.55, speed: 2.3, distort: 0.65 },
    { position: [-3.8, 0.6, -3], color: '#A930F0', emissive: '#A930F0', scale: 1.05, speed: 1.6, distort: 0.44 },
  ],
  franqueado: [
    { position: [2.8, 1.2, -2], color: '#FFD23F', emissive: '#FFD23F', scale: 1.15, speed: 1.4, distort: 0.38 },
    { position: [-2.8, -0.6, -1.5], color: '#C13EFF', emissive: '#C13EFF', scale: 0.85, speed: 2.0, distort: 0.55 },
    { position: [0.4, 2.2, -3], color: '#FFB627', emissive: '#FFB627', scale: 0.65, speed: 1.7, distort: 0.48 },
    { position: [3.8, -1.6, -2.5], color: '#A930F0', emissive: '#A930F0', scale: 0.95, speed: 1.2, distort: 0.3 },
    { position: [-0.8, 1.8, -1.8], color: '#FFD23F', emissive: '#FFD23F', scale: 0.55, speed: 2.3, distort: 0.62 },
    { position: [-3.8, 0.6, -3], color: '#C13EFF', emissive: '#C13EFF', scale: 1.05, speed: 1.6, distort: 0.42 },
  ],
};

function Orb({ position, color, emissive, scale, speed, distort }: OrbConfig) {
  const meshRef = useRef<THREE.Mesh>(null);
  return (
    <Float speed={speed} rotationIntensity={0.25} floatIntensity={1.4}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 48, 48]} />
        <MeshDistortMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.38}
          distort={distort}
          speed={1.6}
          transparent
          opacity={0.82}
        />
      </mesh>
    </Float>
  );
}

function Scene({ mouse, variant }: { mouse: { x: number; y: number }; variant: OrbVariant }) {
  const { camera } = useThree();
  const orbs = CONFIGS[variant];
  const light1 = variant === 'motorista' ? '#FF9500' : '#FFD23F';
  const light2 = variant === 'motorista' ? '#FFD23F' : '#C13EFF';

  useFrame(() => {
    (camera as THREE.PerspectiveCamera).position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
    (camera as THREE.PerspectiveCamera).position.y += (-mouse.y * 0.7 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.04} />
      <pointLight position={[6, 4, 3]} color={light1} intensity={4} />
      <pointLight position={[-6, -4, 2]} color={light2} intensity={4} />
      <Sparkles count={90} scale={12} size={2.2} speed={0.35} color={light1} />
      <Sparkles count={70} scale={10} size={1.6} speed={0.5} color={light2} />
      {orbs.map((orb, i) => (
        <Orb key={i} {...orb} />
      ))}
    </>
  );
}

interface Props {
  variant?: OrbVariant;
  className?: string;
  style?: React.CSSProperties;
}

export default function FloatingOrbs({ variant = 'home', className = '', style }: Props) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    });
  }, []);

  return (
    <div className={className} style={style} onMouseMove={handleMouseMove}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene mouse={mouse} variant={variant} />
      </Canvas>
    </div>
  );
}
