import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, CheckCircle, ClipboardList, MessageSquare,
  Sparkles, Megaphone, BarChart2, PlusCircle, TrendingUp, ArrowRight, RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import { StatusBadge, CategoryBadge } from '../../components/StatusBadge';
import { useApp } from '../../context/AppContext';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminDashboard() {
  const { adminStats, events, loadEvents, loadAdminStats, loadingEvents, currentUser } = useApp();
  const navigate = useNavigate();

  const upcomingEvents = events.filter(e => e.status === 'Upcoming');

  // Simple CSS bar chart
  const chartData = [
    { label: 'Oct', value: 5 },
    { label: 'Nov', value: 8 },
    { label: 'Dec', value: 3 },
    { label: 'Jan', value: 6 },
    { label: 'Feb', value: 4 },
    { label: 'Mar', value: adminStats.upcomingEvents || 7 },
  ];
  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  async function handleRefresh() {
    await Promise.all([loadEvents(), loadAdminStats()]);
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: 24, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: 4 }}>
            Welcome back, {currentUser?.name?.split(' ')[0]} 👋
          </h2>
          <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>
            {adminStats.upcomingEvents} upcoming events · {adminStats.totalRegistrations} total registrations
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
            onClick={handleRefresh} disabled={loadingEvents}>
            <RefreshCw size={15} className={loadingEvents ? 'animate-pulse' : ''} />
            {loadingEvents ? 'Refreshing…' : 'Refresh'}
          </button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
            onClick={() => navigate('/admin/events/create')}>
            <PlusCircle size={16} /> New Event
          </button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
            onClick={() => navigate('/admin/ai-planner')}>
            <Sparkles size={16} /> AI Planner
          </button>
        </div>
      </div>

      {/* Stats — all from MongoDB via /api/dashboard/admin */}
      <div className="stat-grid">
        <StatCard label="Total Events"        value={adminStats.totalEvents}         icon={<Calendar size={22} />}      color="#4f46e5" bg="#eef2ff" />
        <StatCard label="Upcoming Events"     value={adminStats.upcomingEvents}      icon={<TrendingUp size={22} />}    color="#d97706" bg="#fef3c7" />
        <StatCard label="Completed Events"    value={adminStats.completedEvents}     icon={<CheckCircle size={22} />}   color="#16a34a" bg="#dcfce7" />
        <StatCard label="Total Registrations" value={adminStats.totalRegistrations}  icon={<ClipboardList size={22} />} color="#0891b2" bg="#e0f2fe" />
        <StatCard label="Total Participants"  value={adminStats.totalParticipants}   icon={<Users size={22} />}         color="#7c3aed" bg="#ede9fe" />
        <StatCard label="Total Feedback"      value={adminStats.totalFeedback}       icon={<MessageSquare size={22} />} color="#dc2626" bg="#fee2e2" />
      </div>

      {/* Quick Actions */}
      <div className="section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions-grid">
          {[
            { icon: <PlusCircle size={22} />, title: 'Create Event',          desc: 'Add a new college event',          color: '#4f46e5', bg: '#eef2ff', path: '/admin/events/create' },
            { icon: <Sparkles size={22} />,   title: 'AI Event Planner',      desc: 'Generate event plans with AI',      color: '#7c3aed', bg: '#ede9fe', path: '/admin/ai-planner' },
            { icon: <Megaphone size={22} />,  title: 'Generate Announcement', desc: 'Create event announcements',        color: '#d97706', bg: '#fef3c7', path: '/admin/announcements' },
            { icon: <BarChart2 size={22} />,  title: 'View Feedback',         desc: 'Analyze participant feedback',      color: '#16a34a', bg: '#dcfce7', path: '/admin/feedback-analysis' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Upcoming events table */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: 16 }}>
            <h3 className="card-title">Upcoming Events</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/events')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          {upcomingEvents.length === 0 ? (
            <div style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No upcoming events. <button className="btn btn-primary btn-sm" style={{ marginLeft: 8 }} onClick={() => navigate('/admin/events/create')}>Create one</button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.slice(0, 6).map(e => (
                    <tr key={e._id || e.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{e.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.venue}</div>
                      </td>
                      <td><CategoryBadge category={e.category} /></td>
                      <td style={{ fontSize: '0.85rem' }}>{fmtDate(e.date)}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{e.registeredParticipants}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/{e.maxParticipants}</span>
                      </td>
                      <td><StatusBadge status={e.status} /></td>
                      <td>
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/events/${e._id || e.id}`)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mini bar chart */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: 20 }}>
            <h3 className="card-title">Monthly Events</h3>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {chartData.map(d => (
                <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', background: 'var(--primary)', borderRadius: '4px 4px 0 0',
                    height: `${(d.value / maxVal) * 100}px`, transition: 'height 0.5s',
                    opacity: 0.5 + (d.value / maxVal) * 0.5,
                  }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.label}</div>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Events per month (2025–2026)
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
