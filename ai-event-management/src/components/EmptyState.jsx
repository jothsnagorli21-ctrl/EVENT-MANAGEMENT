import { Calendar } from 'lucide-react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <Calendar size={28} />}
      </div>
      <div className="empty-state-title">{title || 'Nothing here yet'}</div>
      {description && <div className="empty-state-desc">{description}</div>}
      {action}
    </div>
  );
}
