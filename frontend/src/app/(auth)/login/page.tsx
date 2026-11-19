'use client';
import { API_BASE_URL } from '@/lib/config';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/user');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', bottom: '-200px', right: '-200px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(0,214,143,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-green))',
            borderRadius: '14px',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="5" width="18" height="15" rx="3"
                stroke="white" strokeWidth="1.8"/>
              <path d="M3 9H21M16 14H18"
                stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M7 5V3H17V5"
                stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to your expense tracker</p>
        </div>
        {error && (
          <div style={{
            background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            color: 'var(--accent-red)', fontSize: '14px',
          }}>{error}</div>
        )}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px',
              outline: 'none', transition: 'border-color 0.2s',
            }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
          <input
            type="password"
            placeholder="????????"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '15px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <a href={`${API_BASE_URL}/auth/google`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: '500', textDecoration: 'none', marginBottom: '20px' }}>
          <svg width="20" height="20" viewBox="0 0 48 48"
  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"/>
  <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3C9.2 39.5 16.1 44 24 44z"/>
  <path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7v-5.3H5.8a20 20 0 0 0 0 17.6l6.8-5.3z"/>
  <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4 16.1 4 9.2 8.5 5.8 15.2l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4z"/>
</svg> Continue with Google
        </a>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: '500' }}>Create one</a>
        </p>
      </div>
    </div>
  );
}
