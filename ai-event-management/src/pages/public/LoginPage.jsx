import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, GraduationCap, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { demoAccounts } from '../../data/mockData';
import Toast from '../../components/Toast';

export default function LoginPage() {
  const { login, addToast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
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

  function handleLogin(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      const user = form.role === 'admin' ? demoAccounts.admin : demoAccounts.student;
      login(user);
      addToast(`Welcome back, ${user.name}! 👋`, 'success', 'Login Successful');
      navigate(form.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      setLoading(false);
    }, 800);
  }

  function quickFill(role) {
    const acc = demoAccounts[role];
    setForm({ email: acc.email, password: acc.password, role });
    setErrors({});
  }

  return (
    <>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>EventAI</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI Event Management</div>
            </div>
          </div>

          <h1 className="auth-title">Welcome back 👋</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          {/* Demo info */}
          <div className="demo-info">
            🧪 <strong>Demo Mode</strong> – No real authentication connected.<br />
            Use <strong>student@demo.com</strong> or <strong>admin@demo.com</strong> with password <strong>demo123</strong>
          </div>

          {/* Quick fill buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickFill('student')}>
              🎓 Fill Student Demo
            </button>
            <button type="button" className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickFill('admin')}>
              👑 Fill Admin Demo
            </button>
          </div>

          <form onSubmit={handleLogin} noValidate>
            {/* Role selector */}
            <div className="form-group">
              <label className="form-label">Select Role</label>
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
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
