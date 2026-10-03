import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, CategoryBadge } from './StatusBadge';
import { useApp } from '../context/AppContext';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function EventCard({ event, showRegister = false, onRegister, isRegistered = false }) {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const availableSeats = event.maxParticipants - event.registeredParticipants;
  const isFull = availableSeats <= 0;

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div>
          <div style={{ marginBottom: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <CategoryBadge category={event.category} />
            <StatusBadge status={event.status} />
          </div>
          <div className="event-card-title">{event.name}</div>
        </div>
      </div>

      <div className="event-card-body">
        <div className="event-meta">
          <div className="event-meta-item">
            <Calendar size={14} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-meta-item">
            <Clock size={14} />
            <span>{formatTime(event.startTime)} – {formatTime(event.endTime)}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={14} />
            <span>{event.venue}</span>
          </div>
          <div className="event-meta-item">
            <Users size={14} />
            <span style={{ color: isFull ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
              {isFull ? 'Full' : `${availableSeats} seats available`}
            </span>
          </div>
        </div>

        {/* Seats bar */}
        <div className="seats-bar-wrap">
          <div className="seats-info">
            <span>{event.registeredParticipants} registered</span>
            <span>{event.maxParticipants} max</span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, (event.registeredParticipants / event.maxParticipants) * 100)}%`,
                background: isFull ? 'var(--danger)' : availableSeats < 10 ? 'var(--warning)' : 'var(--success)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="event-card-footer">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          View Details <ArrowRight size={14} />
        </button>
        {showRegister && currentUser && (
          isRegistered ? (
            <button className="btn btn-success btn-sm" disabled>✓ Registered</button>
          ) : isFull ? (
            <button className="btn btn-secondary btn-sm" disabled>Full</button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onRegister && onRegister(event.id)}
            >
              Register
            </button>
          )
        )}
      </div>
    </div>
  );
}
