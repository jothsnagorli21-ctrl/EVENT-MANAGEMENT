import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Users, Brain, Megaphone, BarChart2, LayoutDashboard, ArrowRight, CheckCircle } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';

const features = [
  {
    icon: <Calendar size={24} />,
    title: 'Event Management',
    desc: 'Create, manage and organize college events effortlessly with a powerful admin dashboard.',
    color: '#4f46e5', bg: '#eef2ff',
  },
  {
    icon: <Users size={24} />,
    title: 'Event Registration',
    desc: 'Students can discover events, register instantly, and track their registrations in one place.',
    color: '#0891b2', bg: '#e0f2fe',
  },
  {
    icon: <Brain size={24} />,
    title: 'AI Event Planner',
    desc: 'Generate complete event schedules, activity lists, tasks, and preparation checklists using AI.',
    color: '#7c3aed', bg: '#ede9fe',
  },
  {
    icon: <Megaphone size={24} />,
    title: 'AI Announcements',
    desc: 'Create professional, eye-catching event announcements in seconds with AI-powered generation.',
    color: '#d97706', bg: '#fef3c7',
  },
  {
    icon: <BarChart2 size={24} />,
    title: 'Feedback Analysis',
    desc: 'Understand participant feedback, sentiment analysis, and identify key areas for improvement.',
    color: '#16a34a', bg: '#dcfce7',
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: 'Smart Dashboard',
    desc: 'View important event and registration statistics at a glance with an intuitive dashboard.',
    color: '#dc2626', bg: '#fee2e2',
  },
];

const highlights = [
  'No paperwork – fully digital event management',
  'Real-time registration tracking',
  'AI-powered planning and announcements',
  'Detailed feedback and analytics',
  'Role-based access for admin and students',
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 0 }}>
      <PublicNavbar />

      {/* Hero */}
      <section className="hero" style={{ paddingTop: 140 }}>
        <div className="hero-badge">
          <Sparkles size={14} /> AI-Powered Event Management
        </div>
        <h1 className="hero-title">
          Manage College Events <span>Smarter with AI</span>
        </h1>
        <p className="hero-subtitle">
          Plan events, manage participants, create announcements, and understand feedback — all in one place.
        </p>
        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={() => navigate('/register')}>
            Get Started <ArrowRight size={18} />
          </button>
          <button className="btn-hero-secondary" onClick={() => navigate('/events')}>
            Explore Events
          </button>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
          marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.12)',
        }}>
          {[
            { val: '500+', label: 'Events Managed' },
            { val: '2,400+', label: 'Registrations' },
            { val: '50+', label: 'Colleges' },
            { val: '98%', label: 'Satisfaction Rate' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#a5b4fc' }}>{s.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-header-title">Everything you need for college events</h2>
          <p className="section-header-desc">A complete digital platform that makes event management simple, fast, and intelligent.</p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section style={{ padding: '80px 40px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="hero-badge" style={{ background: 'var(--primary-bg)', border: '1px solid #c7d2fe', color: 'var(--primary)', marginBottom: 20, display: 'inline-flex' }}>
              <Sparkles size={14} /> Why EventAI?
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.3 }}>
              Built for colleges, powered by AI
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              Managing college events has always been a manual, time-consuming process.
              EventAI brings intelligence to every step — from planning to feedback analysis.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={16} color="var(--success)" />
                  {h}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Create Account
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                Demo Login
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🎯', label: 'Events Created', val: '24' },
              { icon: '👥', label: 'Participants', val: '986' },
              { icon: '⭐', label: 'Avg Rating', val: '4.4' },
              { icon: '🤖', label: 'AI Generations', val: '150+' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                padding: '20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.val}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', textAlign: 'center', color: '#fff' }}>
        <div className="hero-badge" style={{ marginBottom: 24 }}>
          <Sparkles size={14} /> Get Started Today
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16, color: '#fff' }}>
          Ready to transform your college events?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 32, fontSize: '1rem' }}>
          Join hundreds of colleges already using EventAI to manage their events smarter.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-hero-primary" onClick={() => navigate('/register')}>
            Create Free Account <ArrowRight size={18} />
          </button>
          <button className="btn-hero-secondary" onClick={() => navigate('/login')}>
            Try Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">🎓 EventAI</div>
        <div className="footer-tagline">Plan. Manage. Participate. Improve.</div>
        <div className="footer-links">
          <Link to="/events" className="footer-link">Events</Link>
          <Link to="/login" className="footer-link">Login</Link>
          <Link to="/register" className="footer-link">Register</Link>
        </div>
        <div className="footer-copy">© 2026 EventAI – AI Event Management System. College Project Prototype.</div>
      </footer>
    </div>
  );
}
