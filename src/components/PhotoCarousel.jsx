import { useState } from 'react';
import './PhotoCarousel.css';

export default function PhotoCarousel({ photos }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const go = (delta) => setIndex((i) => (i + delta + count) % count);
  const current = photos[index];

  return (
    <div className="carousel" onKeyDown={(e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    }} tabIndex={0}>
      <div className="carousel-stage">
        <img src={current.src} alt={current.caption} className="carousel-image" />
        <button type="button" className="carousel-arrow prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
        <button type="button" className="carousel-arrow next" onClick={() => go(1)} aria-label="Next photo">›</button>
      </div>
      <div className="carousel-caption">{current.caption}</div>
      <div className="carousel-dots">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className={i === index ? 'dot active' : 'dot'}
            onClick={() => setIndex(i)}
            aria-label={`Photo ${i + 1}: ${p.caption}`}
          />
        ))}
      </div>
    </div>
  );
}
