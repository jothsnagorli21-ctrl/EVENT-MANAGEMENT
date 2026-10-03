import { useState } from 'react';
import { Sparkles, RefreshCw, Copy, CheckCheck, List, Clock, ClipboardList, CheckSquare, Package } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { InlineSpinner } from '../../components/LoadingSpinner';
import { mockAIEventPlan } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const eventTypes = ['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Conference', 'Webinar'];
const audiences  = ['1st Year Students', '2nd Year Students', '3rd Year Students', 'All Students', 'Faculty', 'Mixed Audience'];

export default function AIEventPlanner() {
  const { addToast } = useApp();
  const [form, setForm] = useState({ type: 'Workshop', topic: '', duration: '8', participants: '', audience: 'All Students', requirements: '' });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [copied, setCopied] = useState(false);

  function update(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function generatePlan() {
    if (!form.topic.trim()) { addToast('Please enter an event topic.', 'warning'); return; }
    setLoading(true);
    setPlan(null);
    setTimeout(() => {
      setPlan(mockAIEventPlan);
      setChecklist(mockAIEventPlan.checklist.map(item => ({ ...item })));
      setLoading(false);
    }, 1800);
  }

  function toggleChecklist(index) {
    setChecklist(prev => prev.map((c, i) => i === index ? { ...c, done: !c.done } : c));
  }

  function copyPlan() {
    if (!plan) return;
    const text = [
      `AI EVENT PLAN – ${form.type}: ${form.topic}`,
      '',
      '=== SCHEDULE ===',
      ...plan.schedule.map(s => `${s.time} – ${s.activity}`),
      '',
      '=== ACTIVITIES ===',
      ...plan.activities.map(a => `• ${a}`),
      '',
      '=== TASKS ===',
      ...plan.tasks.map(t => `• ${t}`),
      '',
      '=== RESOURCES ===',
      ...plan.resources.map(r => `• ${r}`),
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      addToast('Plan copied to clipboard!', 'success', 'Copied');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const doneCount = checklist.filter(c => c.done).length;

  return (
    <DashboardLayout title="AI Event Planner">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Event Planner</h1>
          <p className="page-subtitle">Generate a complete event plan in seconds</p>
        </div>
        <div className="ai-badge"><Sparkles size={14} /> AI Feature</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Input form */}
        <div>
          <div className="card">
            <div className="card-header" style={{ marginBottom: 20 }}>
              <h3 className="card-title">Event Details</h3>
            </div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <select className="form-control" value={form.type} onChange={e => update('type', e.target.value)}>
                  {eventTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Event Topic <span className="form-required">*</span></label>
                <input className="form-control" placeholder="e.g. Introduction to Machine Learning" value={form.topic} onChange={e => update('topic', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration (hours)</label>
                  <input type="number" className="form-control" min="1" max="48" value={form.duration} onChange={e => update('duration', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Participants</label>
                  <input type="number" className="form-control" placeholder="e.g. 100" value={form.participants} onChange={e => update('participants', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select className="form-control" value={form.audience} onChange={e => update('audience', e.target.value)}>
                  {audiences.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Special Requirements</label>
                <textarea className="form-control" rows={3} placeholder="Any special requirements or notes..." value={form.requirements} onChange={e => update('requirements', e.target.value)} />
              </div>

              <button className="btn btn-ai" style={{ width: '100%' }} onClick={generatePlan} disabled={loading}>
                {loading ? <><InlineSpinner size="spinner-sm" /> &nbsp;Generating...</> : <><Sparkles size={16} /> Generate Event Plan</>}
              </button>
            </div>
          </div>

          {/* Demo notice */}
          <div className="demo-info" style={{ marginTop: 12 }}>
            🤖 <strong>Prototype AI Mode</strong> – This generates a sample output. No actual AI API is used.
          </div>
        </div>

        {/* Result */}
        <div>
          {!plan && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Ready to generate your event plan</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Fill in the event details and click "Generate Event Plan" to get started.</div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Sparkles size={24} color="var(--purple)" className="animate-pulse" />
              </div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Generating your event plan...</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>AI is analyzing your requirements and crafting a detailed plan.</div>
            </div>
          )}

          {plan && (
            <div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <button className="btn btn-secondary btn-sm" onClick={generatePlan}>
                  <RefreshCw size={14} /> Regenerate
                </button>
                <button className="btn btn-secondary btn-sm" onClick={copyPlan}>
                  {copied ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy Plan</>}
                </button>
              </div>

              {/* Header */}
              <div className="ai-result-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{form.type}: {form.topic}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {form.duration}h • {form.participants || 'N/A'} participants • {form.audience}
                    </div>
                  </div>
                  <div className="ai-badge" style={{ marginLeft: 'auto' }}>✨ AI Generated</div>
                </div>

                {/* Schedule */}
                <div className="ai-result-section">
                  <div className="ai-result-section-title"><Clock size={14} /> Event Schedule</div>
                  <div className="schedule-list">
                    {plan.schedule.map((s, i) => (
                      <div key={i} className="schedule-item">
                        <span className="schedule-time">{s.time}</span>
                        <span className="schedule-activity">{s.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities & Tasks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                  <div className="ai-result-section">
                    <div className="ai-result-section-title"><List size={14} /> Suggested Activities</div>
                    <ul className="ai-list">
                      {plan.activities.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                  <div className="ai-result-section">
                    <div className="ai-result-section-title"><ClipboardList size={14} /> Required Tasks</div>
                    <ul className="ai-list">
                      {plan.tasks.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Checklist */}
                <div className="ai-result-section" style={{ marginTop: 16 }}>
                  <div className="ai-result-section-title">
                    <CheckSquare size={14} /> Preparation Checklist
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)' }}>
                      {doneCount}/{checklist.length} done
                    </span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${(doneCount / checklist.length) * 100}%`, background: 'var(--success)' }} />
                    </div>
                  </div>
                  <div className="checklist">
                    {checklist.map((item, i) => (
                      <div key={i} className="checklist-item" onClick={() => toggleChecklist(i)}>
                        <div className={`checklist-box ${item.done ? 'checked' : ''}`}>
                          {item.done && <CheckCheck size={12} color="#fff" />}
                        </div>
                        <span style={{ textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.6 : 1 }}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div className="ai-result-section" style={{ marginTop: 16 }}>
                  <div className="ai-result-section-title"><Package size={14} /> Resource Requirements</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {plan.resources.map((r, i) => (
                      <span key={i} className="badge badge-primary">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
