import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, GraduationCap, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authAPI, getErrorMessage } from '../../services/api';
import Toast from '../../components/Toast';

export default function RegisterPage() {
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())         e.name     = 'Full name is required';
    if (!form.email.trim())        e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)            e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authAPI.register({
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password,
        role:     form.role,
      });
      addToast('Account created successfully! Please sign in.', 'success', 'Registration Successful');
      navigate('/login');
    } catch (err) {
      const msg = getErrorMessage(err);
      addToast(msg, 'error', 'Registration Failed');
      // If the error is about email, surface it on that field
      if (msg.toLowerCase().includes('email')) {
        setErrors({ email: msg });
      }
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

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join EventAI and start managing events</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Role selector */}
            <div className="form-group">
              <label className="form-label">I am registering as</label>
              <div className="role-selector">
                <div className={`role-option ${form.role === 'student' ? 'selected' : ''}`} onClick={() => update('role', 'student')}>
                  <GraduationCap size={16} /> Student
                </div>
                <div className={`role-option ${form.role === 'admin' ? 'selected' : ''}`} onClick={() => update('role', 'admin')}>
                  <ShieldCheck size={16} /> Admin / Organizer
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name <span className="form-required">*</span></label>
              <div className="input-group">
                <User size={16} className="input-icon" />
                <input
                  className="form-control"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  autoComplete="name"
                />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span className="form-required">*</span></label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password <span className="form-required">*</span></label>
                <div className="input-group" style={{ position: 'relative' }}>
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    autoComplete="new-password"
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password <span className="form-required">*</span></label>
                <div className="input-group">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={e => update('confirm', e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirm && <div className="form-error">{errors.confirm}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
      <Toast />
    </>
  );
}
