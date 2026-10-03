import { createContext, useContext, useState, useCallback } from 'react';
import { mockEvents, mockParticipants, mockFeedback, mockRegistrations } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Restore user from localStorage so a page refresh does not log you out
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aems_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [events, setEvents] = useState(mockEvents);
  const [participants, setParticipants] = useState(mockParticipants);
  const [feedback, setFeedback] = useState(mockFeedback);
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [toasts, setToasts] = useState([]);

  // ── Toast helpers ──────────────────────────────────────────
  const addToast = useCallback((msg, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type, title }]);
    setTimeout(() => removeToast(id), 4000);
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
  }, []);

  // ── Events CRUD ────────────────────────────────────────────
  const createEvent = useCallback((eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now(),
      registeredParticipants: 0,
      tags: [],
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setRegistrations(prev => prev.filter(r => r.eventId !== id));
    setParticipants(prev => prev.filter(p => p.eventId !== id));
  }, []);

  const getEventById = useCallback((id) => {
    return events.find(e => e.id === Number(id));
  }, [events]);

  // ── Registrations ──────────────────────────────────────────
  const registerForEvent = useCallback((eventId, userId) => {
    const event = events.find(e => e.id === Number(eventId));
    if (!event) return false;
    const available = event.maxParticipants - event.registeredParticipants;
    if (available <= 0) return false;

    const alreadyRegistered = registrations.find(
      r => r.eventId === Number(eventId) && r.userId === userId
    );
    if (alreadyRegistered) return false;

    const newReg = {
      id: Date.now(),
      eventId: Number(eventId),
      userId,
      registrationDate: new Date().toISOString().slice(0, 10),
      status: 'Confirmed',
    };
    setRegistrations(prev => [...prev, newReg]);
    setEvents(prev => prev.map(e =>
      e.id === Number(eventId)
        ? { ...e, registeredParticipants: e.registeredParticipants + 1 }
        : e
    ));
    return true;
  }, [events, registrations]);

  const cancelRegistration = useCallback((eventId, userId) => {
    setRegistrations(prev => prev.filter(
      r => !(r.eventId === Number(eventId) && r.userId === userId)
    ));
    setEvents(prev => prev.map(e =>
      e.id === Number(eventId)
        ? { ...e, registeredParticipants: Math.max(0, e.registeredParticipants - 1) }
        : e
    ));
  }, []);

  const isRegistered = useCallback((eventId, userId) => {
    return registrations.some(
      r => r.eventId === Number(eventId) && (r.userId === userId || r.userId === 'student')
    );
  }, [registrations]);

  const getStudentRegistrations = useCallback((userId) => {
    return registrations
      .filter(r => r.userId === userId || r.userId === 'student')
      .map(r => ({ ...r, event: events.find(e => e.id === r.eventId) }))
      .filter(r => r.event);
  }, [registrations, events]);

  // ── Feedback ───────────────────────────────────────────────
  const submitFeedback = useCallback((feedbackData) => {
    const newFb = { ...feedbackData, id: Date.now(), date: new Date().toISOString().slice(0, 10) };
    setFeedback(prev => [newFb, ...prev]);
    return newFb;
  }, []);

  const getFeedbackForEvent = useCallback((eventId) => {
    return feedback.filter(f => f.eventId === Number(eventId));
  }, [feedback]);

  // ── Participants ───────────────────────────────────────────
  const getParticipantsForEvent = useCallback((eventId) => {
    return participants.filter(p => p.eventId === Number(eventId));
  }, [participants]);

  // ── Computed stats ─────────────────────────────────────────
  const adminStats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => e.status === 'Upcoming').length,
    ongoingEvents: events.filter(e => e.status === 'Ongoing').length,
    completedEvents: events.filter(e => e.status === 'Completed').length,
    totalRegistrations: events.reduce((sum, e) => sum + e.registeredParticipants, 0),
    totalParticipants: participants.length,
    totalFeedback: feedback.length,
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      events, createEvent, updateEvent, deleteEvent, getEventById,
      registrations, registerForEvent, cancelRegistration, isRegistered, getStudentRegistrations,
      feedback, submitFeedback, getFeedbackForEvent,
      participants, getParticipantsForEvent,
      adminStats,
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
