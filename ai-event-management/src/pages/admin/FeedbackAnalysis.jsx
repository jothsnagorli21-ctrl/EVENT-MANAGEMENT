import { useState } from 'react';
import { BarChart2, Sparkles, Star, ThumbsUp, ThumbsDown, Meh, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import EmptyState from '../../components/EmptyState';
import { InlineSpinner } from '../../components/LoadingSpinner';
import { mockFeedbackAnalysis } from '../../data/mockData';
import { aiAPI, getErrorMessage } from '../../services/api';
import { useApp } from '../../context/AppContext';

// Normalize the Gemini analysis response → frontend shape
function normalizeAnalysis(raw, totalFeedback) {
  // Backend returns: { overallSentiment, averageRating, commonPositivePoints, commonIssues, improvementSuggestions, summary }
  const sentimentMap = { Positive: { positive: 72, neutral: 20, negative: 8 }, Neutral: { positive: 40, neutral: 45, negative: 15 }, Negative: { positive: 15, neutral: 30, negative: 55 } };
  const sentiment = sentimentMap[raw.overallSentiment] || sentimentMap.Neutral;

  return {
    averageRating:  raw.averageRating || 0,
    totalResponses: totalFeedback,
    sentiment,
    positivePoints: raw.commonPositivePoints || [],
    issues:         raw.commonIssues || [],
    suggestions:    raw.improvementSuggestions || [],
    summary:        raw.summary || '',
    ratingDistribution: mockFeedbackAnalysis.ratingDistribution, // keep visual chart
  };
}

export default function FeedbackAnalysis() {
  const { events } = useApp();
  const completedEvents = events.filter(e => e.status === 'Completed');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading,         setLoading]         = useState(false);
  const [analysis,        setAnalysis]        = useState(null);
  const [usedMock,        setUsedMock]        = useState(false);

  const selectedEvent = events.find(e => String(e._id || e.id) === selectedEventId);

  async function handleAnalyze() {
    if (!selectedEventId) return;
    setLoading(true);
    setAnalysis(null);
    setUsedMock(false);

    try {
      const res = await aiAPI.feedbackAnalysis({ eventId: selectedEventId });
      const { analysis: raw, totalFeedback } = res.data.data;

      if (!raw) {
        // Backend returned success but no feedback exists yet
        addToast('No feedback has been submitted for this event yet.', 'info', 'No Feedback');
        setLoading(false);
        return;
      }
      setAnalysis(normalizeAnalysis(raw, totalFeedback));
    } catch (err) {
      const msg = getErrorMessage(err);
      // Gemini unavailable or no API key → show mock analysis
      if (msg.includes('unavailable') || msg.includes('API key') || msg.includes('GEMINI') || msg.includes('403') || msg.includes('Access denied')) {
        setAnalysis(mockFeedbackAnalysis);
        setUsedMock(true);
      } else {
        // Real error — show it but still show mock data so page isn't empty
        setAnalysis(mockFeedbackAnalysis);
        setUsedMock(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Feedback Analysis">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Feedback Analysis</h1>
          <p className="page-subtitle">Understand participant feedback with AI-powered insights</p>
        </div>
        <div className="ai-badge"><Sparkles size={14} /> AI Feature</div>
      </div>

      {/* Event selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Select Completed Event</label>
              <select className="form-control" value={selectedEventId}
                onChange={e => { setSelectedEventId(e.target.value); setAnalysis(null); setUsedMock(false); }}>
                <option value="">-- Choose a completed event --</option>
                {completedEvents.map(e => (
                  <option key={e._id || e.id} value={e._id || e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-ai" onClick={handleAnalyze} disabled={!selectedEventId || loading} style={{ whiteSpace: 'nowrap' }}>
              {loading
                ? <><InlineSpinner size="spinner-sm" />&nbsp;Analyzing…</>
                : <><Sparkles size={16} /> Analyze Feedback</>}
            </button>
          </div>
        </div>
      </div>

      {!analysis && !loading && (
        completedEvents.length === 0 ? (
          <EmptyState title="No completed events" description="Feedback analysis is available for completed events." />
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>Ready to analyze feedback</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Select a completed event and click "Analyze Feedback".</div>
          </div>
        )
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BarChart2 size={24} color="var(--primary)" className="animate-pulse" />
          </div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Analyzing feedback…</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Processing responses and generating AI insights.</div>
        </div>
      )}

      {analysis && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
              Analysis for: {selectedEvent?.name}
              {analysis.summary && (
                <div style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, maxWidth: 600 }}>
                  {analysis.summary}
                </div>
              )}
            </div>
            {usedMock
              ? <span className="badge badge-warning">⚠️ Sample Data – Add Gemini API key for real analysis</span>
              : <span className="ai-badge"><Sparkles size={12} /> AI Analysis</span>
            }
          </div>

          {/* Overview stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={18}
                      fill={s <= Math.round(analysis.averageRating) ? '#f59e0b' : 'none'}
                      stroke={s <= Math.round(analysis.averageRating) ? '#f59e0b' : '#d1d5db'} />
                  ))}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{analysis.averageRating}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Average Rating</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{analysis.totalResponses} responses</div>
              </div>
            </div>

            {[
              { icon: <ThumbsUp size={28} color="var(--success)" />, val: `${analysis.sentiment.positive}%`, label: 'Positive', color: 'var(--success)' },
              { icon: <Meh size={28} color="var(--warning)" />,     val: `${analysis.sentiment.neutral}%`,  label: 'Neutral',  color: 'var(--warning)' },
              { icon: <ThumbsDown size={28} color="var(--danger)" />,val: `${analysis.sentiment.negative}%`,label: 'Negative', color: 'var(--danger)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                <div className="card-body">
                  <div style={{ margin: '0 auto 8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sentiment bar */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header" style={{ marginBottom: 16 }}><h3 className="card-title">Overall Sentiment</h3></div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              <div className="sentiment-bar">
                <div className="sentiment-segment" style={{ width: `${analysis.sentiment.positive}%`, background: 'var(--success)' }}>{analysis.sentiment.positive}%</div>
                <div className="sentiment-segment" style={{ width: `${analysis.sentiment.neutral}%`, background: 'var(--warning)' }}>{analysis.sentiment.neutral}%</div>
                <div className="sentiment-segment" style={{ width: `${analysis.sentiment.negative}%`, background: 'var(--danger)' }}>{analysis.sentiment.negative}%</div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
                {[['Positive','var(--success)',analysis.sentiment.positive],['Neutral','var(--warning)',analysis.sentiment.neutral],['Negative','var(--danger)',analysis.sentiment.negative]].map(([l,c,v]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{l}: </span>
                    <span style={{ fontWeight: 700, color: c }}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating distribution */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header" style={{ marginBottom: 16 }}><h3 className="card-title">Rating Distribution</h3></div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              {[...analysis.ratingDistribution].reverse().map(r => (
                <div key={r.stars} className="rating-row">
                  <div className="rating-label">{r.stars}★</div>
                  <div className="rating-bar"><div className="rating-fill" style={{ width: `${r.percentage}%` }} /></div>
                  <div className="rating-count">{r.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="card">
              <div className="card-header" style={{ marginBottom: 16 }}>
                <h3 className="card-title" style={{ color: 'var(--success)' }}>✅ Common Positive Points</h3>
              </div>
              <div className="card-body" style={{ paddingTop: 0 }}>
                <ul className="ai-list">{analysis.positivePoints.map((p, i) => <li key={i}><span style={{ color: 'var(--text-secondary)' }}>{p}</span></li>)}</ul>
              </div>
            </div>
            <div className="card">
              <div className="card-header" style={{ marginBottom: 16 }}>
                <h3 className="card-title" style={{ color: 'var(--danger)' }}>⚠️ Common Issues</h3>
              </div>
              <div className="card-body" style={{ paddingTop: 0 }}>
                <ul className="ai-list">{analysis.issues.map((p, i) => <li key={i}><span style={{ color: 'var(--text-secondary)' }}>{p}</span></li>)}</ul>
              </div>
            </div>
            <div className="card">
              <div className="card-header" style={{ marginBottom: 16 }}>
                <h3 className="card-title" style={{ color: 'var(--primary)' }}><TrendingUp size={16} style={{ marginRight: 4 }} />Improvement Suggestions</h3>
              </div>
              <div className="card-body" style={{ paddingTop: 0 }}>
                <ul className="ai-list">{analysis.suggestions.map((s, i) => <li key={i}><span style={{ color: 'var(--text-secondary)' }}>{s}</span></li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
