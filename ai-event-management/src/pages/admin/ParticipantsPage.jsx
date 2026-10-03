import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useApp } from '../../context/AppContext';

export default function ParticipantsPage() {
  const { events, getParticipantsForEvent } = useApp();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [participants,    setParticipants]    = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [search,          setSearch]          = useState('');
  const [statusFilter,    setStatusFilter]    = useState('All');
  const [viewParticipant, setViewParticipant] = useState(null);

  const selectedEvent = events.find(e => String(e._id || e.id) === selectedEventId);

  // Fetch participants whenever the selected event changes
  useEffect(() => {
    if (!selectedEventId) { setParticipants([]); return; }
    setLoading(true);
    getParticipantsForEvent(selectedEventId)
      .then(list => setParticipants(list || []))
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false));
  }, [selectedEventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = participants.filter(p => {
    const matchSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function fmtDate(d) {
    if (!d || d === '—') return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <DashboardLayout title="Participants">
      <div className="page-header">
        <div>
          <h1 className="page-title">Participants</h1>
          <p className="page-subtitle">View participants for each event</p>
        </div>
      </div>

      {/* Event selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Event</label>
            <select className="form-control" value={selectedEventId}
              onChange={e => { setSelectedEventId(e.target.value); setSearch(''); }}>
              <option value="">-- Choose an event to view participants --</option>
              {events.map(e => (
                <option key={e._id || e.id} value={e._id || e.id}>
                  {e.name} ({e.registeredParticipants} registered)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {selectedEvent && !loading && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Registered',      val: participants.length,                                   color: 'var(--primary)',   bg: 'var(--primary-bg)' },
            { label: 'Max Capacity',    val: selectedEvent.maxParticipants,                         color: 'var(--text-secondary)', bg: 'var(--bg)' },
            { label: 'Available Seats', val: selectedEvent.maxParticipants - participants.length,   color: 'var(--success)',  bg: 'var(--success-light)' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 'var(--radius)', padding: '10px 16px', border: '1px solid var(--border)', color: s.color }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.7 }}>{s.label}</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{s.val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {selectedEventId && !loading && (
        <div className="search-filter-bar">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input className="form-control" placeholder="Search by name or email…" value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
          </div>
          <select className="form-control" style={{ width: 'auto', minWidth: 120 }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {['All', 'Confirmed', 'Pending'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      )}

      {/* Content */}
      {!selectedEventId ? (
        <EmptyState icon={<Users size={28} />} title="Select an event" description="Choose an event above to view its participants." />
      ) : loading ? (
        <LoadingSpinner text="Loading participants from database…" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No participants found"
          description={participants.length === 0 ? 'No one has registered for this event yet.' : 'No participants match your search.'} />
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id || i}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--primary-bg)', color: 'var(--primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                        }}>
                          {p.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{p.studentName}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.email}</td>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{fmtDate(p.registrationDate)}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => setViewParticipant(p)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!viewParticipant} onClose={() => setViewParticipant(null)} title="Participant Details">
        {viewParticipant && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'var(--primary-bg)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1.25rem', margin: '0 auto 12px',
              }}>
                {viewParticipant.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{viewParticipant.studentName}</div>
              <StatusBadge status={viewParticipant.status} />
            </div>
            {[
              ['Email',             viewParticipant.email],
              ['Registration Date', fmtDate(viewParticipant.registrationDate)],
            ].map(([k, v]) => v && v !== '—' ? (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{k}</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v}</span>
              </div>
            ) : null)}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
