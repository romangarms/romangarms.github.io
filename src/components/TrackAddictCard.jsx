import './TrackAddictCard.css';

export default function TrackAddictCard({ name, src }) {
  return (
    <figure className="ta-card">
      <img src={src} alt={`Track Addict QR code for ${name}`} className="ta-qr" />
      <figcaption>
        <strong>{name}</strong>
        <span>Scan from the Segment track selection screen in Track Addict.</span>
      </figcaption>
    </figure>
  );
}
