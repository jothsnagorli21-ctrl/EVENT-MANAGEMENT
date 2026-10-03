import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Calendar, MapPin, Eye, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EmptyState from '../../components/EmptyState';
import { StatusBadge, CategoryBadge } from '../../components/StatusBadge';
import { ConfirmModal } from '../../components/Modal';
import { useApp } from '../../context/AppContext';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyRegistrations() {
  const { currentUser, getStudentRegistrations, cancelRegistration, addToast } = useApp();
  const navigate = useNavigate();
  const [confirmCancel, setConfirmCancel] = useState(null);

  const regs = getStudentRegistrations(currentUser?.email);

  function handleCancel(eventId) {
    cancelRegistration(eventId, currentUser.email);
    addToast('Registration cancelled.', 'info', 'Cancelled');
    setConfirmCancel(null);
  }

  return (
    <DashboardLayout title="My Registrations">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Registrations</h1>
          <p className="page-subtitle">{regs.length} registered event{regs.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/student/events')}>
          Browse More Events
        </button>
      </div>

      {regs.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={28} />}
          title="No registrations yet"
          description="Browse events and register to see them here."
          action={<button className="btn btn-primary" onClick={() => navigate('/student/events')}>Browse Events</button>}
        />
      ) : (
        <>
          {/* Cards view */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {regs.map(r => {
              const e = r.event;
              if (!e) return null;
              const canCancel = e.status !== 'Completed';
              return (
                <div key={r.id} className="card">
                  <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        <CategoryBadge category={e.category} />
                        <StatusBadge status={e.status} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{e.name}</div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <Calendar size={12} />{fmtDate(e.date)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <MapPin size={12} />{e.venue}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '0 16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>Registered On</div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{fmtDate(r.registrationDate)}</div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '0 16px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>Status</div>
                      <StatusBadge status={r.status} />
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/events/${e.id}`)}>
                        <Eye size={14} /> View
                      </button>
                      {canCancel && (
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}
                          onClick={() => setConfirmCancel(e.id)}>
                          <Trash2 size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ConfirmModal
        open={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => handleCancel(confirmCancel)}
        title="Cancel Registration"
        message="Are you sure you want to cancel your registration for this event? This action cannot be undone."
        confirmText="Yes, Cancel"
        danger
      />
    </DashboardLayout>
  );
}
