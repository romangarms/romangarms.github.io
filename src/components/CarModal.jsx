import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { linkifyText } from '../utils/linkify';
import './CarModal.css';

// Get Forza class color based on letter
const getForzaClassColor = (forzaClass) => {
  if (!forzaClass) return '#666';
  const letter = forzaClass.charAt(0).toUpperCase();
  const colors = {
    'X': '#0d7a3e',  // Green
    'S': '#6b4c9a',  // Purple (S1, S2)
    'A': '#c23b2e',  // Red
    'B': '#e67332',  // Orange
    'C': '#d4c32a',  // Yellow
    'D': '#3498db',  // Blue
    'E': '#666666',  // Gray
    'F': '#666666',  // Gray
  };
  return colors[letter] || '#666';
};

function CarModal({ car, isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, [isOpen, onClose]);

  // Group mods by category
  const groupModsByCategory = (mods) => {
    if (!mods || mods.length === 0) return {};
    return mods.reduce((groups, mod) => {
      const category = mod.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(mod);
      return groups;
    }, {});
  };

  const modalContent = car ? (
    <div className="car-modal-content">
      <button className="modal-close" onClick={onClose} aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="car-modal-scroll">
        {/* Hero Image */}
        <div className="car-hero">
          <img src={car.image} alt={car.title} />
          {car.stats?.forzaClass && (
            <div
              className="forza-class-badge"
              style={{ background: getForzaClassColor(car.stats.forzaClass) }}
            >
              {car.stats.forzaClass}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="car-header">
          <h1 className="car-title">{car.title}</h1>
          <div className="car-brief-info">
            {(car.briefInfo || 'No brief info').split('\n').map((line, i) => (
              line.trim() && <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        {car.stats && (
          <section className="car-section">
            <h2>Specifications</h2>
            <div className="stats-grid">
              {car.stats.power && (
                <div className="stat-item">
                  <Icon icon="mdi:engine" className="stat-icon" />
                  <span className="stat-value">{car.stats.power}</span>
                  <span className="stat-label">Power</span>
                </div>
              )}
              {car.stats.torque && (
                <div className="stat-item">
                  <Icon icon="mdi:gauge" className="stat-icon" />
                  <span className="stat-value">{car.stats.torque}</span>
                  <span className="stat-label">Torque</span>
                </div>
              )}
              {car.stats.zeroToSixty && (
                <div className="stat-item">
                  <Icon icon="mdi:timer-outline" className="stat-icon" />
                  <span className="stat-value">{car.stats.zeroToSixty}</span>
                  <span className="stat-label">0-60 mph</span>
                </div>
              )}
              {car.stats.topSpeed && (
                <div className="stat-item">
                  <Icon icon="mdi:speedometer" className="stat-icon" />
                  <span className="stat-value">{car.stats.topSpeed}</span>
                  <span className="stat-label">Top Speed</span>
                </div>
              )}
              {car.stats.drivetrain && (
                <div className="stat-item">
                  <Icon icon="tabler:car-4wd" className="stat-icon" />
                  <span className="stat-value">{car.stats.drivetrain}</span>
                  <span className="stat-label">Drivetrain</span>
                </div>
              )}
              {car.stats.transmission && (
                <div className="stat-item">
                  <Icon icon="mdi:car-shift-pattern" className="stat-icon" />
                  <span className="stat-value">{car.stats.transmission}</span>
                  <span className="stat-label">Transmission</span>
                </div>
              )}

            </div>
          </section>
        )}

        {/* Description Section */}
        {car.description && (
          <section className="car-section">
            <h2>About This Build</h2>
            <div className="car-description">
              {car.description.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{linkifyText(paragraph)}</p>
              ))}
            </div>
          </section>
        )}

        {/* Mods Section */}
        {car.mods && car.mods.length > 0 && (
          <section className="car-section">
            <h2>Modifications</h2>
            <div className="mods-list">
              {Object.entries(groupModsByCategory(car.mods)).map(([category, mods]) => (
                <div className="mods-category" key={category}>
                  <h3>{category}</h3>
                  <ul>
                    {mods.map((mod, index) => (
                      <li key={index}>
                        {mod.brand && <span className="mod-brand">{mod.brand} </span>}
                        {mod.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  ) : null;

  return createPortal(
    <div
      id="car-modal"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      {modalContent}
    </div>,
    document.body
  );
}

CarModal.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    briefInfo: PropTypes.string,
    description: PropTypes.string,
    stats: PropTypes.shape({
      power: PropTypes.string,
      torque: PropTypes.string,
      zeroToSixty: PropTypes.string,
      forzaClass: PropTypes.string,
      topSpeed: PropTypes.string,
      drivetrain: PropTypes.string,
      transmission: PropTypes.string,
      status: PropTypes.string,
      usage: PropTypes.arrayOf(PropTypes.string)
    }),
    mods: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      brand: PropTypes.string
    }))
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CarModal;
