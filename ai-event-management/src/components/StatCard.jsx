export default function StatCard({ label, value, icon, color = '#4f46e5', bg = '#eef2ff', change, changeType }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && (
          <div className={`stat-change ${changeType === 'up' ? 'up' : 'down'}`}>
            {changeType === 'up' ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </div>
  );
}
