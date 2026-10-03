export function StatusBadge({ status }) {
  const map = {
    Upcoming:  'badge-primary',
    Ongoing:   'badge-warning',
    Completed: 'badge-success',
    Confirmed: 'badge-success',
    Pending:   'badge-warning',
    Cancelled: 'badge-danger',
    Full:      'badge-danger',
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}

export function CategoryBadge({ category }) {
  const map = {
    Workshop:  'badge-primary',
    Hackathon: 'badge-purple',
    Seminar:   'badge-info',
    Cultural:  'badge-warning',
    Sports:    'badge-success',
    Technical: 'badge-primary',
    Other:     'badge-gray',
  };
  return <span className={`badge ${map[category] || 'badge-gray'}`}>{category}</span>;
}
