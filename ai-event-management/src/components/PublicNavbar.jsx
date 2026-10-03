import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PublicNavbar() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const dashLink = currentUser
    ? currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
    : null;

  return (
    <nav className="public-navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-brand-icon">
          <Sparkles size={18} />
        </div>
        EventAI
      </Link>

      <div className="navbar-links">
        <Link to="/events" className="navbar-link">Events</Link>
        <Link to="/login" className="navbar-link">Login</Link>
      </div>

      <div className="navbar-actions">
        {currentUser ? (
          <button className="btn btn-primary btn-sm" onClick={() => navigate(dashLink)}>
            Go to Dashboard
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
