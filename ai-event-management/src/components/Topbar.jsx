import { Menu, Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Topbar({ title, onMenuClick, hasSidebar = true }) {
  const { currentUser } = useApp();
  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className={`topbar ${!hasSidebar ? 'no-sidebar' : ''}`}>
      {hasSidebar && (
        <button className="topbar-hamburger" onClick={onMenuClick} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
      )}

      <div className="topbar-title">{title}</div>

      <div className="topbar-actions">
        <span className={`topbar-badge ${isAdmin ? '' : ''}`} style={{
          background: isAdmin ? 'var(--purple-light)' : 'var(--primary-bg)',
          color: isAdmin ? 'var(--purple)' : 'var(--primary)',
          border: `1px solid ${isAdmin ? '#ddd6fe' : '#c7d2fe'}`,
        }}>
          {isAdmin ? '👑 Admin' : '🎓 Student'}
        </span>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '0.8rem',
        }}>
          {initials}
        </div>
      </div>
    </header>
  );
}
