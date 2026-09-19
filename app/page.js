'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error generating app setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <h1>⚡ AI App Factory</h1>
      <p>Type your app idea below to generate architectural specs and starter code.</p>

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A fitness tracker that uses AI to predict rest times"
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Building...' : 'Generate App'}
        </button>
      </div>

      {result && (
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h2>🚀 {result.appName}</h2>
          <p><em>{result.tagline}</em></p>

          <h3>Features</h3>
          <ul>
            {result.features?.map((f, i) => <li key={i}>{f}</li>)}
          </ul>

          <h3>Tech Stack</h3>
          <p>{result.techStack?.join(', ')}</p>

          <h3>Generated Starter Code</h3>
          <pre style={{ backgroundColor: '#020617', padding: '15px', borderRadius: '8px', overflowX: 'auto', color: '#38bdf8' }}>
            <code>{result.starterCode}</code>
          </pre>
        </div>
      )}
    </main>
  );
}
