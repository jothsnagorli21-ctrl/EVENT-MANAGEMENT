import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EventForm from '../../components/EventForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { getErrorMessage } from '../../services/api';

export default function EditEventPage() {
  const { id } = useParams();
  const { getEventById, updateEvent, addToast } = useApp();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const event = getEventById(id);

  if (!event) return (
    <DashboardLayout title="Edit Event">
      <LoadingSpinner text="Loading event..." />
    </DashboardLayout>
  );

  async function handleSubmit(data) {
    setSaving(true);
    try {
      await updateEvent(event._id, data);
      addToast(`"${data.name}" updated successfully!`, 'success', 'Event Updated');
      navigate('/admin/events');
    } catch (err) {
      addToast(getErrorMessage(err), 'error', 'Update Failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Edit Event">
      <div style={{ maxWidth: 720 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Event</h1>
            <p className="page-subtitle">Update the details for "{event.name}"</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                <Edit size={18} />
              </div>
              <h3 className="card-title">Edit Event Details</h3>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <EventForm
              initialData={event}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/admin/events')}
              submitLabel={saving ? 'Saving…' : 'Save Changes'}
              disabled={saving}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
