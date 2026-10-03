import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EventForm from '../../components/EventForm';
import { useApp } from '../../context/AppContext';

export default function CreateEventPage() {
  const { createEvent, addToast } = useApp();
  const navigate = useNavigate();

  function handleSubmit(data) {
    createEvent(data);
    addToast(`"${data.name}" created successfully! 🎉`, 'success', 'Event Created');
    navigate('/admin/events');
  }

  return (
    <DashboardLayout title="Create Event">
      <div style={{ maxWidth: 720 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Create New Event</h1>
            <p className="page-subtitle">Fill in the details to create a new college event</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <PlusCircle size={18} />
              </div>
              <h3 className="card-title">Event Details</h3>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <EventForm
              onSubmit={handleSubmit}
              onCancel={() => navigate('/admin/events')}
              submitLabel="Create Event"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
