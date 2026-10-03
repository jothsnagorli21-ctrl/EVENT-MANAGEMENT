import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, GraduationCap, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authAPI, getErrorMessage } from '../../services/api';
import Toast from '../../components/Toast';

export default function LoginPage() {
  const { login, addToast } = useApp();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required';
    if (!form.password.trim()) e.password = 'Password is required';
    return e;
  }

  async function handleLogin(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res  = await authAPI.login({ email: form.email, password: form.password });
      const { token, user } = res.data.data;

      // Store token + user together so the API interceptor can read it
      login({ ...user, token });

      addToast(`Welcome back, ${user.name}! 👋`, 'success', 'Login Successful');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      addToast(msg, 'error', 'Login Failed');
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Sparkles size={20} /></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>EventAI</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI Event Management</div>
            </div>
          </div>

          <h1 className="auth-title">Welcome back 👋</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <div className="demo-info">
            💡 <strong>First time?</strong> Register an account first, then log in.<br />
            Make sure the backend server is running on <strong>port 5000</strong>.
          </div>

          <form onSubmit={handleLogin} noValidate>
            {/* Role selector — for navigation only, actual role comes from DB */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-selector">
                <div
                  className={`role-option ${form.role === 'student' ? 'selected' : ''}`}
                  onClick={() => update('role', 'student')}
                >
                  <GraduationCap size={16} /> Student
                </div>
                <div
                  className={`role-option ${form.role === 'admin' ? 'selected' : ''}`}
                  onClick={() => update('role', 'admin')}
                >
                  <ShieldCheck size={16} /> Admin
                </div>
              </div>
              <div className="form-hint">Your actual role is determined by your registered account.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
          </p>
        </div>
      </div>
      <Toast />
    </>
  );
}
