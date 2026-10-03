import { useState } from 'react';
import { Megaphone, Sparkles, Copy, CheckCheck, RefreshCw, Edit, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { InlineSpinner } from '../../components/LoadingSpinner';
import { mockAnnouncementTemplates } from '../../data/mockData';
import { aiAPI, getErrorMessage } from '../../services/api';
import { useApp } from '../../context/AppContext';

// Build a mock announcement from template when Gemini is unavailable
function buildMockAnnouncement(event, templateIndex) {
  const template = mockAnnouncementTemplates[templateIndex % mockAnnouncementTemplates.length];
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const fmtTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  return template
    .replace(/{eventName}/g, event.name)
    .replace(/{date}/g, fmtDate(event.date))
    .replace(/{startTime}/g, fmtTime(event.startTime))
    .replace(/{endTime}/g, fmtTime(event.endTime))
    .replace(/{venue}/g, event.venue)
    .replace(/{category}/g, event.category);
}

export default function AnnouncementGenerator() {
  const { events, addToast } = useApp();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading,         setLoading]         = useState(false);
  const [announcement,    setAnnouncement]    = useState('');
  const [editMode,        setEditMode]        = useState(false);
  const [copied,          setCopied]          = useState(false);
  const [usedMock,        setUsedMock]        = useState(false);
  const [mockIndex,       setMockIndex]       = useState(0);

  const selectedEvent = events.find(e => String(e._id || e.id) === selectedEventId);

  function fmtDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  }

  async function handleGenerate(templateIdx = mockIndex) {
    if (!selectedEventId) { addToast('Please select an event.', 'warning'); return; }
    setLoading(true);
    setAnnouncement('');
    setEditMode(false);
    setUsedMock(false);

    try {
      const res = await aiAPI.announcement({ eventId: selectedEventId });
      setAnnouncement(res.data.data?.announcement || '');
    } catch (err) {
      const msg = getErrorMessage(err);
      // Fallback to mock when Gemini key is missing
      if (msg.includes('unavailable') || msg.includes('API key') || msg.includes('GEMINI') || msg.includes('403') || msg.includes('Access denied')) {
        setAnnouncement(buildMockAnnouncement(selectedEvent, templateIdx));
        setUsedMock(true);
        addToast('AI service unavailable – showing sample announcement.', 'warning', 'Using Sample Data');
      } else {
        addToast(msg, 'error', 'Generation Failed');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRegenerate() {
    const next = mockIndex + 1;
    setMockIndex(next);
    handleGenerate(next);
  }

  function handleCopy() {
    navigator.clipboard.writeText(announcement).then(() => {
      setCopied(true);
      addToast('Announcement copied to clipboard!', 'success', 'Copied');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <DashboardLayout title="AI Announcements">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Announcement Generator</h1>
          <p className="page-subtitle">Create professional event announcements instantly</p>
        </div>
        <div className="ai-badge"><Sparkles size={14} /> AI Feature</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left panel */}
        <div>
          <div className="card">
            <div className="card-header" style={{ marginBottom: 20 }}>
              <h3 className="card-title">Select Event</h3>
            </div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              <div className="form-group">
                <label className="form-label">Event <span className="form-required">*</span></label>
                <select className="form-control" value={selectedEventId}
                  onChange={e => { setSelectedEventId(e.target.value); setAnnouncement(''); setUsedMock(false); }}>
                  <option value="">-- Choose an event --</option>
                  {events.map(e => (
                    <option key={e._id || e.id} value={e._id || e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              {/* Event info card */}
              {selectedEvent && (
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.875rem' }}>{selectedEvent.name}</div>
                  {[
                    ['Date',      fmtDate(selectedEvent.date)],
                    ['Time',      `${fmtTime(selectedEvent.startTime)} – ${fmtTime(selectedEvent.endTime)}`],
                    ['Venue',     selectedEvent.venue],
                    ['Category',  selectedEvent.category],
                    ['Organizer', selectedEvent.organizer],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                      <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn btn-ai" style={{ width: '100%' }} onClick={() => handleGenerate(mockIndex)} disabled={loading}>
                {loading
                  ? <><InlineSpinner size="spinner-sm" />&nbsp;Generating…</>
                  : <><Sparkles size={16} /> Generate Announcement</>}
              </button>
            </div>
          </div>

          {usedMock && (
            <div className="demo-info" style={{ marginTop: 12 }}>
              ⚠️ <strong>Gemini API key not configured.</strong> Showing a sample announcement. Add a valid
              <code style={{ fontSize: '0.8rem' }}> GEMINI_API_KEY</code> to the backend <code>.env</code>.
            </div>
          )}
        </div>

        {/* Right panel */}
        <div>
          {!announcement && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📢</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Ready to generate an announcement</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Select an event and click "Generate Announcement".</div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Megaphone size={24} color="var(--warning)" className="animate-pulse" />
              </div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Crafting your announcement…</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>AI is composing a professional announcement.</div>
            </div>
          )}

          {announcement && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn btn-secondary btn-sm" onClick={handleRegenerate} disabled={loading}>
                  <RefreshCw size={14} /> Regenerate
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                  {copied ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
                <button className={`btn btn-sm ${editMode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setEditMode(p => !p)}>
                  {editMode ? <><Eye size={14} /> Preview</> : <><Edit size={14} /> Edit</>}
                </button>
                {usedMock
                  ? <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>⚠️ Sample Data</span>
                  : <span className="ai-badge" style={{ marginLeft: 'auto' }}><Sparkles size={12} /> AI Generated</span>
                }
              </div>

              {editMode
                ? <textarea className="announcement-edit" value={announcement} onChange={e => setAnnouncement(e.target.value)} />
                : <div className="announcement-preview">{announcement}</div>
              }

              <div style={{ marginTop: 12, background: 'var(--success-light)', border: '1px solid #bbf7d0', borderRadius: 'var(--radius)', padding: 12 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>💡 Usage Tips</div>
                <ul style={{ fontSize: '0.78rem', color: '#166534', paddingLeft: 16 }}>
                  <li>Copy and paste into WhatsApp groups, email, or notice boards</li>
                  <li>Click Edit to customize the announcement text</li>
                  <li>Click Regenerate to get a different style</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
