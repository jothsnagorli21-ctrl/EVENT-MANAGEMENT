import axios from 'axios';

// All requests go to /api — Vite proxy forwards them to http://localhost:5000
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT on every request ──────
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('aems_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch {
      // ignore malformed localStorage
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: unwrap data, handle 401 globally ─
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local storage and reload to login
      localStorage.removeItem('aems_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Helper: extract readable error message from axios error ─
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  profile:  ()     => api.get('/auth/profile'),
};

// ════════════════════════════════════════════════════════════
// EVENTS
// ════════════════════════════════════════════════════════════
export const eventsAPI = {
  getAll:   ()         => api.get('/events'),
  getById:  (id)       => api.get(`/events/${id}`),
  create:   (data)     => api.post('/events', data),
  update:   (id, data) => api.put(`/events/${id}`, data),
  delete:   (id)       => api.delete(`/events/${id}`),
};

// ════════════════════════════════════════════════════════════
// REGISTRATIONS
// ════════════════════════════════════════════════════════════
export const registrationsAPI = {
  register:       (eventId) => api.post(`/events/${eventId}/register`),
  getMyAll:       ()        => api.get('/my-registrations'),
  getParticipants:(eventId) => api.get(`/events/${eventId}/participants`),
};

// ════════════════════════════════════════════════════════════
// FEEDBACK
// ════════════════════════════════════════════════════════════
export const feedbackAPI = {
  submit:  (eventId, data) => api.post(`/events/${eventId}/feedback`, data),
  getAll:  (eventId)       => api.get(`/events/${eventId}/feedback`),
};

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════
export const dashboardAPI = {
  admin:   () => api.get('/dashboard/admin'),
  student: () => api.get('/dashboard/student'),
};

// ════════════════════════════════════════════════════════════
// AI
// ════════════════════════════════════════════════════════════
export const aiAPI = {
  eventPlan:        (data) => api.post('/ai/event-plan', data),
  announcement:     (data) => api.post('/ai/announcement', data),
  feedbackAnalysis: (data) => api.post('/ai/feedback-analysis', data),
};

export default api;
