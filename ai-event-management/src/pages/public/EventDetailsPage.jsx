import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, User, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import { StatusBadge, CategoryBadge } from '../../components/StatusBadge';
import { useApp } from '../../context/AppContext';

function fmt(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, registerForEvent, cancelRegistration, isRegistered, currentUser, addToast } = useApp();

  const event = getEventById(id);
  if (!event) return (
    <div style={{ padding: '120px 40px', textAlign: 'center' }}>
      <h2>Event not found</h2>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/events')}>Back to Events</button>
    </div>
  );

  const available = event.maxParticipants - event.registeredParticipants;
  const full = available <= 0;
  const registered = currentUser ? isRegistered(event.id, currentUser.email) : false;

  function handleRegister() {
    if (!currentUser) { addToast('Please log in first.', 'warning', 'Login Required'); return; }
    const ok = registerForEvent(event.id, currentUser.email);
    if (ok) addToast('Event registration successful! 🎉', 'success', 'Registered');
    else    addToast('Already registered or event is full.', 'error');
  }

  function handleCancel() {
    if (!currentUser) return;
    cancelRegistration(event.id, currentUser.email);
    addToast('Registration cancelled.', 'info', 'Cancelled');
  }

  return (
    <div style={{ paddingTop: 66 }}>
      <PublicNavbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
          <ArrowLeft size={16} /> Back to Events
        </button>

        {/* Hero header */}
        <div className="event-detail-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            <CategoryBadge category={event.category} />
            <StatusBadge status={event.status} />
          </div>
          <h1 className="event-detail-title">{event.name}</h1>
          <div className="event-detail-meta">
            <span className="event-detail-meta-item"><Calendar size={16} />{fmt(event.date)}</span>
            <span className="event-detail-meta-item"><Clock size={16} />{fmtTime(event.startTime)} – {fmtTime(event.endTime)}</span>
            <span className="event-detail-meta-item"><MapPin size={16} />{event.venue}</span>
          </div>
        </div>

        {/* Info grid */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-item-label">Organizer</div>
            <div className="info-item-value">{event.organizer}</div>
          </div>
          <div className="info-item">
            <div className="info-item-label">Max Participants</div>
            <div className="info-item-value">{event.maxParticipants}</div>
          </div>
          <div className="info-item">
            <div className="info-item-label">Registered</div>
            <div className="info-item-value">{event.registeredParticipants}</div>
          </div>
          <div className="info-item">
            <div className="info-item-label">Available Seats</div>
            <div className="info-item-value" style={{ color: full ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
              {full ? 'Full' : available}
            </div>
          </div>
        </div>

        {/* Registration CTA */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-body">
            {registered ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={22} color="var(--success)" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--success)' }}>You're registered!</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your spot is confirmed for this event.</div>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel Registration</button>
              </div>
            ) : full ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={22} color="var(--danger)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--danger)' }}>Registration Closed</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This event has reached maximum capacity.</div>
                </div>
              </div>
            ) : event.status === 'Completed' ? (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>This event has already been completed.</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Register for this event</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{available} seats remaining – register before they fill up!</div>
                </div>
                <button className="btn btn-primary" onClick={handleRegister}>
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seats progress */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><h3 className="card-title">Registration Status</h3></div>
          <div className="card-body">
            <div className="seats-info" style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{event.registeredParticipants} registered</span>
              <span style={{ color: 'var(--text-muted)' }}>of {event.maxParticipants} seats</span>
            </div>
            <div className="progress-bar-wrap" style={{ height: 12 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, (event.registeredParticipants / event.maxParticipants) * 100)}%`,
                  background: full ? 'var(--danger)' : available < 10 ? 'var(--warning)' : 'var(--primary)',
                }}
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
              {Math.round((event.registeredParticipants / event.maxParticipants) * 100)}% full
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">About This Event</h3></div>
          <div className="card-body">
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              {event.description}
            </p>
            {event.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                {event.tags.map(tag => (
                  <span key={tag} className="badge badge-gray">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
