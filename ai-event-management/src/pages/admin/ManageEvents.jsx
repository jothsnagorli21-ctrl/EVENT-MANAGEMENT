import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EmptyState from '../../components/EmptyState';
import { StatusBadge, CategoryBadge } from '../../components/StatusBadge';
import { ConfirmModal } from '../../components/Modal';
import { useApp } from '../../context/AppContext';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];
const statuses   = ['All', 'Upcoming', 'Ongoing', 'Completed'];

export default function ManageEvents() {
  const { events, deleteEvent, addToast } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  const filtered = events.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'All' || e.category === category;
    const matchStatus = status === 'All'   || e.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  function handleDelete(id) {
    deleteEvent(id);
    addToast('Event deleted successfully.', 'success', 'Deleted');
    setDeleteId(null);
  }

  return (
    <DashboardLayout title="Manage Events">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Events</h1>
          <p className="page-subtitle">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/events/create')}>
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input className="form-control" placeholder="Search events..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="form-control" style={{ width: 'auto', minWidth: 140 }} value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="form-control" style={{ width: 'auto', minWidth: 130 }} value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        {(search || category !== 'All' || status !== 'All') && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); }}>Clear</button>
        )}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState title="No events found" description="Try adjusting your filters or create a new event."
            action={<button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/events/create')}>Create Event</button>} />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: 220 }} className="truncate">{e.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.organizer}</div>
                    </td>
                    <td><CategoryBadge category={e.category} /></td>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{fmtDate(e.date)}</td>
                    <td style={{ fontSize: '0.85rem', maxWidth: 160 }} className="truncate">{e.venue}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{e.registeredParticipants}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/{e.maxParticipants}</span></div>
                      <div className="progress-bar-wrap" style={{ height: 4, marginTop: 4, width: 70 }}>
                        <div className="progress-bar-fill" style={{
                          width: `${Math.min(100, (e.registeredParticipants / e.maxParticipants) * 100)}%`,
                          background: e.registeredParticipants >= e.maxParticipants ? 'var(--danger)' : 'var(--primary)',
                        }} />
                      </div>
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon-only" title="View" onClick={() => navigate(`/events/${e.id}`)}><Eye size={15} /></button>
                        <button className="btn btn-icon-only" title="Edit" onClick={() => navigate(`/admin/events/edit/${e.id}`)}><Edit size={15} /></button>
                        <button className="btn btn-icon-only" title="Delete" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                          onClick={() => setDeleteId(e.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Event"
        message="Are you sure you want to delete this event? This will also remove all associated registrations. This action cannot be undone."
        confirmText="Delete Event"
        danger
      />
    </DashboardLayout>
  );
}
