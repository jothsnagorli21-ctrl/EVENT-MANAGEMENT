export default function LoadingSpinner({ size = '', text = 'Loading...' }) {
  return (
    <div className="loading-overlay">
      <div className={`spinner ${size}`} />
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
}

export function InlineSpinner({ size = '' }) {
  return <div className={`spinner ${size}`} style={{ display: 'inline-block' }} />;
}
