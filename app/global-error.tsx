'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="pt-BR">
      <body style={{ background: '#070707', color: '#fff', fontFamily: 'monospace', padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#FFD23F', fontSize: '24px', marginBottom: '16px' }}>BibCar — Erro de Diagnóstico</h1>
        <p style={{ color: '#A5B0BD', marginBottom: '24px' }}>
          Um erro ocorreu ao carregar o site. Detalhes abaixo:
        </p>
        <div style={{ background: '#141420', border: '1px solid #FF2D8E', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
          <strong style={{ color: '#FF2D8E' }}>Mensagem:</strong>
          <pre style={{ color: '#fff', marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{error.message}</pre>
        </div>
        {error.digest && (
          <div style={{ background: '#141420', border: '1px solid #3a3a52', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
            <strong style={{ color: '#A5B0BD' }}>Digest:</strong>
            <pre style={{ color: '#A5B0BD', marginTop: '8px' }}>{error.digest}</pre>
          </div>
        )}
        <div style={{ background: '#141420', border: '1px solid #3a3a52', borderRadius: '8px', padding: '20px' }}>
          <strong style={{ color: '#A5B0BD' }}>Stack:</strong>
          <pre style={{ color: '#A5B0BD', marginTop: '8px', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{error.stack}</pre>
        </div>
      </body>
    </html>
  );
}
