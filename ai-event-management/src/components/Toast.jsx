import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
  success: <CheckCircle size={18} color="var(--success)" />,
  error:   <XCircle    size={18} color="var(--danger)"  />,
  warning: <AlertCircle size={18} color="var(--warning)" />,
  info:    <Info        size={18} color="var(--info)"    />,
};

const defaultTitles = {
  success: 'Success',
  error:   'Error',
  warning: 'Warning',
  info:    'Info',
};

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon">{icons[t.type] || icons.info}</div>
          <div className="toast-content">
            <div className="toast-title">{t.title || defaultTitles[t.type]}</div>
            <div className="toast-msg">{t.msg}</div>
          </div>
          <button className="toast-close" onClick={() => removeToast(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
