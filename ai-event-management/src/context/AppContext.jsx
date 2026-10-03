import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { eventsAPI, registrationsAPI, feedbackAPI, dashboardAPI, getErrorMessage } from '../services/api';

const AppContext = createContext(null);

// ── Normalize a backend event object → frontend shape ─────
// Backend:  { title, capacity, registeredCount, availableSeats, organizer: { name } }
// Frontend: { name, maxParticipants, registeredParticipants, organizer (string) }
function normalizeEvent(e) {
  if (!e) return null;
  return {
    id:                   e._id,
    _id:                  e._id,
    name:                 e.title,
    title:                e.title,
    description:          e.description,
    category:             e.category,
    date:                 e.date ? e.date.slice(0, 10) : '',
    startTime:            e.startTime,
    endTime:              e.endTime,
    venue:                e.venue,
    maxParticipants:      e.capacity,
    registeredParticipants: e.registeredCount ?? 0,
    availableSeats:       e.availableSeats ?? (e.capacity - (e.registeredCount ?? 0)),
    organizer:            e.organizer?.name || e.organizer || '',
    organizerId:          e.organizer?._id || e.organizerId || null,
    status:               e.status,
    tags:                 e.tags || [],
    createdAt:            e.createdAt,
  };
}

// ── Normalize a backend registration → frontend shape ──────
function normalizeRegistration(r) {
  return {
    id:               r.registrationId || r._id,
    eventId:          r.event?._id || r.eventId,
    userId:           r.student?._id || r.userId,
    registrationDate: r.registeredAt ? r.registeredAt.slice(0, 10) : '',
    status:           'Confirmed',
    event:            r.event ? normalizeEvent({ ...r.event, registeredCount: 0, availableSeats: 0 }) : null,
  };
}

// ── Normalize a backend feedback entry → frontend shape ────
function normalizeFeedback(f) {
  return {
    id:          f._id,
    eventId:     f.eventId,
    studentName: f.student?.name || f.studentName || '',
    rating:      f.rating,
    comment:     f.comment,
    suggestions: f.suggestions || '',
    date:        f.createdAt ? f.createdAt.slice(0, 10) : f.date || '',
  };
}

export function AppProvider({ children }) {
  // ── Current user (restored from localStorage) ─────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aems_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── App state ──────────────────────────────────────────────
  const [events, setEvents]             = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback]         = useState([]);
  const [participants, setParticipants] = useState([]);
  const [adminStats, setAdminStats]     = useState({
    totalEvents: 0, upcomingEvents: 0, ongoingEvents: 0,
    completedEvents: 0, totalRegistrations: 0, totalParticipants: 0, totalFeedback: 0,
  });
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [toasts, setToasts]             = useState([]);

  // ── Toast helpers ──────────────────────────────────────────
  const addToast = useCallback((msg, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Auth ───────────────────────────────────────────────────
  const login = useCallback((user) => {
    setCurrentUser(user);
    localStorage.setItem('aems_user', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('aems_user');
    setEvents([]);
    setRegistrations([]);
    setFeedback([]);
    setParticipants([]);
  }, []);

  // ── Load events from backend ───────────────────────────────
  const loadEvents = useCallback(async () => {
    if (!currentUser) return;
    setLoadingEvents(true);
    try {
      const res = await eventsAPI.getAll();
      setEvents((res.data.data?.events || []).map(normalizeEvent));
    } catch (err) {
      console.error('loadEvents:', getErrorMessage(err));
    } finally {
      setLoadingEvents(false);
    }
  }, [currentUser]);

  // Load events whenever a user logs in
  useEffect(() => {
    if (currentUser) loadEvents();
  }, [currentUser, loadEvents]);

  // ── Load student registrations ─────────────────────────────
  const loadMyRegistrations = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'student') return;
    try {
      const res = await registrationsAPI.getMyAll();
      const regs = (res.data.data?.registrations || []).map(normalizeRegistration);
      setRegistrations(regs);
    } catch (err) {
      console.error('loadMyRegistrations:', getErrorMessage(err));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === 'student') loadMyRegistrations();
  }, [currentUser, loadMyRegistrations]);

  // ── Load admin dashboard stats ─────────────────────────────
  const loadAdminStats = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      const res = await dashboardAPI.admin();
      const stats = res.data.data?.stats || {};
      setAdminStats({
        totalEvents:        stats.totalEvents        ?? 0,
        upcomingEvents:     stats.upcomingEvents     ?? 0,
        ongoingEvents:      stats.ongoingEvents      ?? 0,
        completedEvents:    stats.completedEvents    ?? 0,
        totalRegistrations: stats.totalRegistrations ?? 0,
        totalParticipants:  stats.totalParticipants  ?? 0,
        totalFeedback:      stats.totalFeedback      ?? 0,
      });
    } catch (err) {
      console.error('loadAdminStats:', getErrorMessage(err));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === 'admin') loadAdminStats();
  }, [currentUser, loadAdminStats]);

  // ── Events CRUD ────────────────────────────────────────────
  // Backend uses: title, capacity. Frontend form uses: name, maxParticipants.
  // Map before sending, normalize the response back.
  function toBackendEvent(formData) {
    return {
      title:       formData.name  || formData.title,
      description: formData.description,
      category:    formData.category,
      date:        formData.date,
      startTime:   formData.startTime,
      endTime:     formData.endTime,
      venue:       formData.venue,
      capacity:    Number(formData.maxParticipants || formData.capacity),
      status:      formData.status,
    };
  }

  const createEvent = useCallback(async (formData) => {
    const payload = toBackendEvent(formData);
    const res = await eventsAPI.create(payload);
    const newEvent = normalizeEvent(res.data.data?.event);
    setEvents(prev => [newEvent, ...prev]);
    loadAdminStats();
    return newEvent;
  }, [loadAdminStats]);

  const updateEvent = useCallback(async (id, formData) => {
    const payload = toBackendEvent(formData);
    const res = await eventsAPI.update(id, payload);
    const updated = normalizeEvent(res.data.data?.event);
    setEvents(prev => prev.map(e => (e._id === id || e.id === id) ? updated : e));
    return updated;
  }, []);

  const deleteEvent = useCallback(async (id) => {
    await eventsAPI.delete(id);
    setEvents(prev => prev.filter(e => e._id !== id && e.id !== id));
    setRegistrations(prev => prev.filter(r => r.eventId !== id));
    loadAdminStats();
  }, [loadAdminStats]);

  const getEventById = useCallback((id) => {
    return events.find(e => String(e._id) === String(id) || String(e.id) === String(id));
  }, [events]);

  // ── Registrations ──────────────────────────────────────────
  const registerForEvent = useCallback(async (eventId, _userId) => {
    const res = await registrationsAPI.register(eventId);
    // Optimistically update seat count in local state
    setEvents(prev => prev.map(e =>
      (String(e._id) === String(eventId) || String(e.id) === String(eventId))
        ? { ...e, registeredParticipants: e.registeredParticipants + 1 }
        : e
    ));
    // Add to local registrations list for instant UI feedback
    const reg = res.data.data?.registration;
    if (reg) {
      const event = events.find(e => String(e._id) === String(eventId));
      setRegistrations(prev => [
        ...prev,
        { id: reg._id, eventId, userId: currentUser?._id, registrationDate: new Date().toISOString().slice(0, 10), status: 'Confirmed', event },
      ]);
    }
    return true;
  }, [events, currentUser]);

  const cancelRegistration = useCallback(async (eventId, _userId) => {
    // No cancel endpoint in backend — remove from local state only
    setRegistrations(prev => prev.filter(r => String(r.eventId) !== String(eventId)));
    setEvents(prev => prev.map(e =>
      (String(e._id) === String(eventId) || String(e.id) === String(eventId))
        ? { ...e, registeredParticipants: Math.max(0, e.registeredParticipants - 1) }
        : e
    ));
  }, []);

  const isRegistered = useCallback((eventId, _userId) => {
    return registrations.some(r => String(r.eventId) === String(eventId));
  }, [registrations]);

  const getStudentRegistrations = useCallback((_userId) => {
    return registrations;
  }, [registrations]);

  // ── Feedback ───────────────────────────────────────────────
  const submitFeedback = useCallback(async (feedbackData) => {
    const { eventId, rating, comment, suggestions } = feedbackData;
    const res = await feedbackAPI.submit(eventId, { rating, comment, suggestions });
    const newFb = normalizeFeedback({ ...res.data.data?.feedback, eventId });
    setFeedback(prev => [newFb, ...prev]);
    return newFb;
  }, []);

  const getFeedbackForEvent = useCallback(async (eventId) => {
    try {
      const res = await feedbackAPI.getAll(eventId);
      const list = (res.data.data?.feedback || []).map(f => normalizeFeedback({ ...f, eventId }));
      setFeedback(prev => {
        const filtered = prev.filter(f => String(f.eventId) !== String(eventId));
        return [...filtered, ...list];
      });
      return list;
    } catch {
      return feedback.filter(f => String(f.eventId) === String(eventId));
    }
  }, [feedback]);

  // ── Participants ───────────────────────────────────────────
  const getParticipantsForEvent = useCallback(async (eventId) => {
    try {
      const res = await registrationsAPI.getParticipants(eventId);
      const list = (res.data.data?.participants || []).map(p => ({
        id:               p.registrationId,
        eventId,
        studentName:      p.student?.name || '—',
        email:            p.student?.email || '—',
        registrationDate: p.registeredAt ? p.registeredAt.slice(0, 10) : '—',
        status:           'Confirmed',
        department:       '—',
        rollNo:           '—',
        phone:            '—',
      }));
      setParticipants(prev => {
        const others = prev.filter(p => String(p.eventId) !== String(eventId));
        return [...others, ...list];
      });
      return list;
    } catch {
      return participants.filter(p => String(p.eventId) === String(eventId));
    }
  }, [participants]);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      events, loadEvents, loadingEvents,
      createEvent, updateEvent, deleteEvent, getEventById,
      registrations, registerForEvent, cancelRegistration,
      isRegistered, getStudentRegistrations, loadMyRegistrations,
      feedback, submitFeedback, getFeedbackForEvent,
      participants, getParticipantsForEvent,
      adminStats, loadAdminStats,
      toasts, addToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
