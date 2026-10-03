import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Star, ArrowRight, BookOpen, MessageSquare, ClipboardList } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import { useApp } from '../../context/AppContext';
import { getErrorMessage } from '../../services/api';

export default function StudentDashboard() {
  const { currentUser, events, getStudentRegistrations, registerForEvent, isRegistered, addToast, loadingEvents } = useApp();
  const navigate = useNavigate();

  const myRegs       = getStudentRegistrations(currentUser?._id);
  const upcomingAll  = events.filter(e => e.status === 'Upcoming');
  const myUpcoming   = myRegs.filter(r => r.event?.status === 'Upcoming');
  const myCompleted  = myRegs.filter(r => r.event?.status === 'Completed');

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  async function handleRegister(eventId) {
    try {
      await registerForEvent(eventId, currentUser._id);
      addToast('Registered successfully! 🎉', 'success', 'Registered');
    } catch (err) {
      addToast(getErrorMessage(err), 'error', 'Registration Failed');
    }
  }

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Greeting banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
        borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 24, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: 4 }}>
            {greeting}, {currentUser?.name?.split(' ')[0]} 👋
          </h2>
          <p style={{ opacity: 0.75, fontSize: '0.9rem' }}>
            {myUpcoming.length} upcoming registered event{myUpcoming.length !== 1 ? 's' : ''}. Stay curious!
          </p>
        </div>
        <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
          onClick={() => navigate('/student/events')}>
          Browse Events <ArrowRight size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard label="Available Events" value={upcomingAll.length}   icon={<Calendar size={22} />}      color="#4f46e5" bg="#eef2ff" />
        <StatCard label="My Registrations" value={myRegs.length}        icon={<ClipboardList size={22} />} color="#0891b2" bg="#e0f2fe" />
        <StatCard label="Upcoming"         value={myUpcoming.length}    icon={<Clock size={22} />}         color="#d97706" bg="#fef3c7" />
        <StatCard label="Completed"        value={myCompleted.length}   icon={<CheckCircle size={22} />}   color="#16a34a" bg="#dcfce7" />
      </div>

      {/* Quick Actions */}
      <div className="section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions-grid">
          {[
            { icon: <Calendar size={22} />,     title: 'Browse Events',    desc: 'Find and register for events',       color: '#4f46e5', bg: '#eef2ff', path: '/student/events' },
            { icon: <ClipboardList size={22} />, title: 'My Registrations', desc: 'Manage your event registrations',   color: '#0891b2', bg: '#e0f2fe', path: '/student/registrations' },
            { icon: <MessageSquare size={22} />, title: 'Give Feedback',    desc: 'Rate events you attended',          color: '#16a34a', bg: '#dcfce7', path: '/student/feedback' },
            { icon: <Star size={22} />,          title: 'My Profile',       desc: 'Update your account details',       color: '#7c3aed', bg: '#ede9fe', path: '/student/profile' },
          ].map(a => (
            <div key={a.title} className="quick-action-card" onClick={() => navigate(a.path)}>
              <div className="quick-action-icon" style={{ background: a.bg, color: a.color }}>{a.icon}</div>
              <div>
                <div className="quick-action-title">{a.title}</div>
                <div className="quick-action-desc">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="section">
        <div className="section-title" style={{ justifyContent: 'space-between' }}>
          <span><Calendar size={18} style={{ marginRight: 6 }} />Upcoming Events</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/events')}>View All <ArrowRight size={14} /></button>
        </div>
        {loadingEvents ? (
          <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Loading events…</div>
        ) : upcomingAll.length === 0 ? (
          <EmptyState title="No upcoming events" description="Check back soon for new events." />
        ) : (
          <div className="events-grid">
            {upcomingAll.slice(0, 3).map(e => (
              <EventCard key={e._id || e.id} event={e} showRegister onRegister={handleRegister}
                isRegistered={isRegistered(e._id || e.id, currentUser?._id)} />
            ))}
          </div>
        )}
      </div>

      {/* My Registered Events */}
      {myRegs.length > 0 && (
        <div className="section">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <span><BookOpen size={18} style={{ marginRight: 6 }} />My Registered Events</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/registrations')}>View All <ArrowRight size={14} /></button>
          </div>
          <div className="events-grid">
            {myRegs.slice(0, 3).map(r => r.event && (
              <EventCard key={r.id} event={r.event} showRegister isRegistered />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
