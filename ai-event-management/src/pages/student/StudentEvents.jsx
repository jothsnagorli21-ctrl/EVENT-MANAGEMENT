import { useState } from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import { useApp } from '../../context/AppContext';

const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];
const statuses   = ['All', 'Upcoming', 'Ongoing', 'Completed'];

export default function StudentEvents() {
  const { events, registerForEvent, isRegistered, currentUser, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = events.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.venue.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'All' || e.category === category;
    const matchStatus = status === 'All' || e.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  function handleRegister(eventId) {
    const ok = registerForEvent(eventId, currentUser.email);
    if (ok) addToast('Registered successfully! 🎉', 'success', 'Registered');
    else    addToast('Already registered or event is full.', 'error');
  }

  return (
    <DashboardLayout title="Browse Events">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Events</h1>
          <p className="page-subtitle">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

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

      {filtered.length === 0 ? (
        <EmptyState title="No events found" description="Try adjusting your filters." />
      ) : (
        <div className="events-grid">
          {filtered.map(e => (
            <EventCard key={e.id} event={e} showRegister onRegister={handleRegister}
              isRegistered={isRegistered(e.id, currentUser?.email)} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
