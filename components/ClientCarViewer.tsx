'use client';

import dynamic from 'next/dynamic';

const CarViewer3D = dynamic(() => import('./CarViewer3D'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,210,63,0.4)',
        fontSize: 13,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      Carregando...
    </div>
  ),
});

export default CarViewer3D;
