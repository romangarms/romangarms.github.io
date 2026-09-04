import './Section.css';

export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="section">
      {title && (
        <header className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
