import { useState } from 'react';
import { Star } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EmptyState from '../../components/EmptyState';
import { useApp } from '../../context/AppContext';
import { getErrorMessage } from '../../services/api';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={28}
          className={`star ${s <= (hover || value) ? 'filled' : ''}`}
          fill={s <= (hover || value) ? '#f59e0b' : 'none'}
          stroke={s <= (hover || value) ? '#f59e0b' : 'currentColor'}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        />
      ))}
      <span style={{ marginLeft: 8, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        {value > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value] : 'Select rating'}
      </span>
    </div>
  );
}

export default function FeedbackPage() {
  const { currentUser, events, submitFeedback, addToast, feedback } = useApp();

  // Only completed events that the student can give feedback for
  const completedEvents = events.filter(e => e.status === 'Completed');
  const myFeedback      = feedback.filter(f => f.studentName === currentUser?.name);

  const [form, setForm]     = useState({ eventId: '', rating: 0, comment: '', suggestions: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function update(k, v) {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.eventId)          e.eventId = 'Please select an event';
    if (form.rating === 0)      e.rating  = 'Please give a rating';
    if (!form.comment.trim())   e.comment = 'Please write a comment';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      await submitFeedback({
        eventId:     form.eventId,
        rating:      form.rating,
        comment:     form.comment,
        suggestions: form.suggestions,
      });
      addToast('Feedback submitted successfully! Thank you 🙏', 'success', 'Feedback Submitted');
      setForm({ eventId: '', rating: 0, comment: '', suggestions: '' });
      setErrors({});
    } catch (err) {
      addToast(getErrorMessage(err), 'error', 'Submission Failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Feedback">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Feedback</h1>
          <p className="page-subtitle">Share your experience and help us improve</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        {/* Submit form */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Submit Feedback</h3></div>
          <div className="card-body">
            {completedEvents.length === 0 ? (
              <EmptyState title="No completed events" description="Feedback can be submitted after events are completed." />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Select Event <span className="form-required">*</span></label>
                  <select className="form-control" value={form.eventId} onChange={e => update('eventId', e.target.value)}>
                    <option value="">-- Choose a completed event --</option>
                    {completedEvents.map(e => (
                      <option key={e._id || e.id} value={e._id || e.id}>{e.name}</option>
                    ))}
                  </select>
                  {errors.eventId && <div className="form-error">{errors.eventId}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Overall Rating <span className="form-required">*</span></label>
                  <StarRating value={form.rating} onChange={v => update('rating', v)} />
                  {errors.rating && <div className="form-error" style={{ marginTop: 6 }}>{errors.rating}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Comment <span className="form-required">*</span></label>
                  <textarea className="form-control" rows={4} placeholder="Share your experience…"
                    value={form.comment} onChange={e => update('comment', e.target.value)} />
                  {errors.comment && <div className="form-error">{errors.comment}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Suggestions <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea className="form-control" rows={3} placeholder="Any suggestions for improvement?"
                    value={form.suggestions} onChange={e => update('suggestions', e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                  {saving ? '⏳ Submitting…' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* History */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">My Feedback History</h3></div>
          <div className="card-body">
            {myFeedback.length === 0 ? (
              <EmptyState title="No feedback yet" description="Submit feedback to see it here." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {myFeedback.map(fb => {
                  const ev = events.find(e => String(e._id || e.id) === String(fb.eventId));
                  return (
                    <div key={fb.id} style={{ padding: 14, background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 6 }}>{ev?.name || 'Event'}</div>
                      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={14} fill={s <= fb.rating ? '#f59e0b' : 'none'} stroke={s <= fb.rating ? '#f59e0b' : '#d1d5db'} />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{fb.comment}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>{fb.date}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
