import { useState } from 'react';
import { User, Mail, BookOpen, Hash } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useApp } from '../../context/AppContext';

export default function ProfilePage() {
  const { currentUser, login, addToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '' });
  const [errors, setErrors] = useState({});

  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  function handleSave() {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (Object.keys(e).length) { setErrors(e); return; }
    login({ ...currentUser, name: form.name, email: form.email });
    addToast('Profile updated successfully!', 'success', 'Profile Saved');
    setEditing(false);
    setErrors({});
  }

  const isAdmin = currentUser?.role === 'admin';

  return (
    <DashboardLayout title="Profile">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your account information</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {/* Avatar */}
            <div className="profile-avatar-lg">{initials}</div>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{currentUser?.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                {currentUser?.email}
              </div>
              <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-primary'}`} style={{ marginTop: 8 }}>
                {isAdmin ? '👑 Admin / Organizer' : '🎓 Student'}
              </span>
            </div>

            <hr className="divider" />

            {/* Info / Edit */}
            {!editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: <User size={16} />, label: 'Full Name', val: currentUser?.name },
                  { icon: <Mail size={16} />, label: 'Email', val: currentUser?.email },
                  { icon: <BookOpen size={16} />, label: 'Department', val: currentUser?.department || '—' },
                  ...(currentUser?.rollNo ? [{ icon: <Hash size={16} />, label: 'Roll Number', val: currentUser.rollNo }] : []),
                  { icon: <User size={16} />, label: 'Role', val: isAdmin ? 'Admin / Organizer' : 'Student' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                      <div style={{ fontWeight: 600, marginTop: 1 }}>{item.val}</div>
                    </div>
                  </div>
                ))}

                <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }} />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }} />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => { setEditing(false); setErrors({}); setForm({ name: currentUser?.name, email: currentUser?.email }); }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demo notice */}
        <div className="demo-info" style={{ marginTop: 16 }}>
          🧪 <strong>Prototype Mode</strong> – Profile changes are stored in frontend state only and will reset on page refresh.
        </div>
      </div>
    </DashboardLayout>
  );
}
