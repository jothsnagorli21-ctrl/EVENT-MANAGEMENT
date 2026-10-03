import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Public Pages
import LandingPage      from './pages/public/LandingPage';
import LoginPage        from './pages/public/LoginPage';
import RegisterPage     from './pages/public/RegisterPage';
import BrowseEventsPage from './pages/public/BrowseEventsPage';
import EventDetailsPage from './pages/public/EventDetailsPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentEvents    from './pages/student/StudentEvents';
import MyRegistrations  from './pages/student/MyRegistrations';
import FeedbackPage     from './pages/student/FeedbackPage';
import ProfilePage      from './pages/student/ProfilePage';

// Admin Pages
import AdminDashboard         from './pages/admin/AdminDashboard';
import ManageEvents           from './pages/admin/ManageEvents';
import CreateEventPage        from './pages/admin/CreateEventPage';
import EditEventPage          from './pages/admin/EditEventPage';
import ParticipantsPage       from './pages/admin/ParticipantsPage';
import AIEventPlanner         from './pages/admin/AIEventPlanner';
import AnnouncementGenerator  from './pages/admin/AnnouncementGenerator';
import FeedbackAnalysis       from './pages/admin/FeedbackAnalysis';
import AdminProfile           from './pages/admin/AdminProfile';

// ── Protected route guards ─────────────────────────────────
function RequireAuth({ children, role }) {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/events"   element={<BrowseEventsPage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />

      {/* Student */}
      <Route path="/student/dashboard"    element={<RequireAuth role="student"><StudentDashboard /></RequireAuth>} />
      <Route path="/student/events"       element={<RequireAuth role="student"><StudentEvents /></RequireAuth>} />
      <Route path="/student/registrations" element={<RequireAuth role="student"><MyRegistrations /></RequireAuth>} />
      <Route path="/student/feedback"     element={<RequireAuth role="student"><FeedbackPage /></RequireAuth>} />
      <Route path="/student/profile"      element={<RequireAuth role="student"><ProfilePage /></RequireAuth>} />

      {/* Admin */}
      <Route path="/admin/dashboard"         element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/events"            element={<RequireAuth role="admin"><ManageEvents /></RequireAuth>} />
      <Route path="/admin/events/create"     element={<RequireAuth role="admin"><CreateEventPage /></RequireAuth>} />
      <Route path="/admin/events/edit/:id"   element={<RequireAuth role="admin"><EditEventPage /></RequireAuth>} />
      <Route path="/admin/participants"      element={<RequireAuth role="admin"><ParticipantsPage /></RequireAuth>} />
      <Route path="/admin/ai-planner"        element={<RequireAuth role="admin"><AIEventPlanner /></RequireAuth>} />
      <Route path="/admin/announcements"     element={<RequireAuth role="admin"><AnnouncementGenerator /></RequireAuth>} />
      <Route path="/admin/feedback-analysis" element={<RequireAuth role="admin"><FeedbackAnalysis /></RequireAuth>} />
      <Route path="/admin/profile"           element={<RequireAuth role="admin"><AdminProfile /></RequireAuth>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
