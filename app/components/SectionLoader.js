export default function SectionLoader({ label = 'Loading section' }) {
  return (
    <section className="section-frame">
      <div className="section-container">
        <div className="section-skeleton">
          <div className="section-skeleton-mark" />
          <div className="section-skeleton-lines">
            <span />
            <span />
            <span />
          </div>
          <p>{label}</p>
        </div>
      </div>
    </section>
  );
}
