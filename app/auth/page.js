'use client';

import { useMemo, useState } from 'react';
import { authContent } from '@/lib/content';
import { getBrowserSupabase } from '@/lib/supabase-browser';

export default function AuthPage() {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              source: 'pilot-web'
            }
          }
        });
        if (error) throw error;
        if (data.session) {
          window.location.href = '/chat';
          return;
        }
        setMessage('账号已创建，请根据当前认证配置完成验证后登录。');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        window.location.href = '/chat';
      }
    } catch (err) {
      setMessage(err.message || '认证失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container narrow-page">
      <section className="glass-card auth-card">
        <div className="section-head">
          <h1>{authContent.title}</h1>
          <p>{authContent.subtitle}</p>
        </div>

        <div className="tabs-row">
          <button type="button" className={mode === 'signin' ? 'tab active' : 'tab'} onClick={() => setMode('signin')}>
            {authContent.signInTitle}
          </button>
          <button type="button" className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => setMode('signup')}>
            {authContent.signUpTitle}
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>{authContent.emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            required
            autoComplete="email"
          />

          <label>{authContent.passwordLabel}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少 6 位"
            required
            minLength={6}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />

          <button className="primary-btn" disabled={loading}>
            {loading ? '处理中...' : mode === 'signup' ? authContent.signUpButton : authContent.signInButton}
          </button>
        </form>

        <p className="helper-text">{authContent.helper}</p>
        {message ? <p className="info-text">{message}</p> : null}
      </section>
    </main>
  );
}
