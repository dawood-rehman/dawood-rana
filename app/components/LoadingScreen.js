export default function LoadingScreen({ label = 'Loading portfolio' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-mark">DR</div>
      <div className="loading-copy">
        <p>{label}</p>
        <span />
      </div>
    </div>
  );
}
