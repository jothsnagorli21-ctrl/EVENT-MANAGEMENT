import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, PlusCircle, Users, Sparkles,
  Megaphone, BarChart2, User, LogOut, BookOpen, ClipboardList,
  MessageSquare, Star, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const studentLinks = [
  { to: '/student/dashboard',      icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/student/events',         icon: <Calendar size={18} />,        label: 'Browse Events' },
  { to: '/student/registrations',  icon: <ClipboardList size={18} />,   label: 'My Registrations' },
  { to: '/student/feedback',       icon: <MessageSquare size={18} />,   label: 'Feedback' },
  { to: '/student/profile',        icon: <User size={18} />,            label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard',         icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/events',            icon: <Calendar size={18} />,        label: 'Manage Events' },
  { to: '/admin/events/create',     icon: <PlusCircle size={18} />,      label: 'Create Event' },
  { to: '/admin/participants',      icon: <Users size={18} />,           label: 'Participants' },
];

const adminAILinks = [
  { to: '/admin/ai-planner',        icon: <Sparkles size={18} />,        label: 'AI Event Planner' },
  { to: '/admin/announcements',     icon: <Megaphone size={18} />,       label: 'AI Announcements' },
  { to: '/admin/feedback-analysis', icon: <BarChart2 size={18} />,       label: 'Feedback Analysis' },
];

const adminBottomLinks = [
  { to: '/admin/profile',           icon: <User size={18} />,            label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const links = isAdmin ? adminLinks : studentLinks;
  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  function handleLogout() {
    logout();
    navigate('/login');
    onClose?.();
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="sidebar-logo-text">🎓 EventAI</div>
              <div className="sidebar-logo-sub">AI Event Management</div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'rgba(199,210,254,0.6)', cursor: 'pointer', display: 'none' }}
              className="sidebar-close-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="sidebar-section-label">AI Features</div>
              {adminAILinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
              <div className="sidebar-section-label">Account</div>
              {adminBottomLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-icon">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser?.name || 'User'}</div>
              <div className="sidebar-user-role">{isAdmin ? 'Admin / Organizer' : 'Student'}</div>
            </div>
          </div>
          <button
            className="sidebar-link"
            onClick={handleLogout}
            style={{ marginTop: 8, color: '#fca5a5' }}
          >
            <span className="sidebar-link-icon"><LogOut size={18} /></span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
