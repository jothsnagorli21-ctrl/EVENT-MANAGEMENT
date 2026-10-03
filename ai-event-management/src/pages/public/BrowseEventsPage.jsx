import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import { useApp } from '../../context/AppContext';

const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];
const statuses   = ['All', 'Upcoming', 'Ongoing', 'Completed'];

export default function BrowseEventsPage() {
  const { events, registerForEvent, isRegistered, currentUser, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = events.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.venue.toLowerCase().includes(search.toLowerCase()) ||
                        e.organizer.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'All' || e.category === category;
    const matchStatus = status === 'All' || e.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  function handleRegister(eventId) {
    if (!currentUser) {
      addToast('Please log in to register for events.', 'warning', 'Login Required');
      return;
    }
    const ok = registerForEvent(eventId, currentUser.email);
    if (ok) addToast('Registration successful! 🎉', 'success', 'Registered');
    else    addToast('Already registered or event is full.', 'error');
  }

  return (
    <div style={{ paddingTop: 66 }}>
      <PublicNavbar />
      <div style={{ padding: '40px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Browse Events</h1>
            <p className="page-subtitle">{filtered.length} events found</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="search-filter-bar">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              className="form-control"
              placeholder="Search events, venues, organizers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>

          <select className="form-control" style={{ width: 'auto', minWidth: 140 }}
            value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <select className="form-control" style={{ width: 'auto', minWidth: 130 }}
            value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>

          {(search || category !== 'All' || status !== 'All') && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); }}>
              Clear Filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No events found"
            description="Try adjusting your filters or search query."
          />
        ) : (
          <div className="events-grid">
            {filtered.map(e => (
              <EventCard
                key={e.id}
                event={e}
                showRegister
                onRegister={handleRegister}
                isRegistered={currentUser ? isRegistered(e.id, currentUser.email) : false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
