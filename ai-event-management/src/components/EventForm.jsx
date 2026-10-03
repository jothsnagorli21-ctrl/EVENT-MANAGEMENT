import { useState } from 'react';

const categories = ['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];
const statuses   = ['Upcoming', 'Ongoing', 'Completed'];

const empty = {
  name: '', description: '', category: 'Workshop', date: '',
  startTime: '', endTime: '', venue: '', maxParticipants: '',
  organizer: '', status: 'Upcoming',
};

export default function EventForm({ initialData = {}, onSubmit, onCancel, submitLabel = 'Create Event' }) {
  const [form, setForm] = useState({ ...empty, ...initialData });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())         e.name        = 'Event name is required';
    if (!form.description.trim())  e.description = 'Description is required';
    if (!form.date)                e.date        = 'Date is required';
    if (!form.startTime)           e.startTime   = 'Start time is required';
    if (!form.endTime)             e.endTime     = 'End time is required';
    if (!form.venue.trim())        e.venue       = 'Venue is required';
    if (!form.organizer.trim())    e.organizer   = 'Organizer name is required';
    if (!form.maxParticipants || Number(form.maxParticipants) < 1)
                                   e.maxParticipants = 'Valid max participants required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, maxParticipants: Number(form.maxParticipants) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Event Name <span className="form-required">*</span></label>
        <input className="form-control" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. AI Workshop 2026" />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Description <span className="form-required">*</span></label>
        <textarea className="form-control" rows={4} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the event..." />
        {errors.description && <div className="form-error">{errors.description}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-control" value={form.category} onChange={e => update('category', e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-control" value={form.status} onChange={e => update('status', e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date <span className="form-required">*</span></label>
          <input type="date" className="form-control" value={form.date} onChange={e => update('date', e.target.value)} />
          {errors.date && <div className="form-error">{errors.date}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Max Participants <span className="form-required">*</span></label>
          <input type="number" className="form-control" min="1" value={form.maxParticipants} onChange={e => update('maxParticipants', e.target.value)} placeholder="e.g. 100" />
          {errors.maxParticipants && <div className="form-error">{errors.maxParticipants}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Time <span className="form-required">*</span></label>
          <input type="time" className="form-control" value={form.startTime} onChange={e => update('startTime', e.target.value)} />
          {errors.startTime && <div className="form-error">{errors.startTime}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">End Time <span className="form-required">*</span></label>
          <input type="time" className="form-control" value={form.endTime} onChange={e => update('endTime', e.target.value)} />
          {errors.endTime && <div className="form-error">{errors.endTime}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Venue <span className="form-required">*</span></label>
        <input className="form-control" value={form.venue} onChange={e => update('venue', e.target.value)} placeholder="e.g. Seminar Hall, Block A" />
        {errors.venue && <div className="form-error">{errors.venue}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Organizer Name <span className="form-required">*</span></label>
        <input className="form-control" value={form.organizer} onChange={e => update('organizer', e.target.value)} placeholder="e.g. Dr. John Smith" />
        {errors.organizer && <div className="form-error">{errors.organizer}</div>}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
