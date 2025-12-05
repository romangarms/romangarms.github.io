import { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

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
  };
  return colors[letter] || '#666';
};

// Icon components using Iconify
const EngineIcon = () => <Icon icon="mdi:engine" width="16" />;
const TimerIcon = () => <Icon icon="mdi:timer-outline" width="16" />;
const DrivetrainIcon = () => <Icon icon="tabler:car-4wd" width="16" />;

const getUsageIcon = (usage) => {
  switch (usage) {
    case 'Daily': return <Icon icon="mdi:car" width="16" />;
    case 'AutoX': return <Icon icon="mdi:go-kart" width="16" />;
    case 'Track': return <Icon icon="mdi:flag-checkered" width="16" />;
    case 'Project': return <Icon icon="mdi:wrench" width="16" />;
    default: return null;
  }
};

const CarCard = memo(({ car, onCardClick, index }) => {
  const forzaColor = getForzaClassColor(car.stats?.forzaClass);

  return (
    <motion.div
      className="car-card"
      onClick={() => onCardClick(car)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick(car);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details: ${car.title}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <div className="box">
        <div className="car-image-container">
          <img src={car.image} className="car-image" alt={car.title} />
          {car.stats?.forzaClass && (
            <span
              className="forza-badge-overlay"
              style={{ backgroundColor: forzaColor }}
            >
              {car.stats.forzaClass}
            </span>
          )}
        </div>
        <h4>{car.title}</h4>
        <div className="car-brief">
          {car.briefInfo.split('\n').map((line, i) => (
            line.trim() && <p key={i}>{line}</p>
          ))}
        </div>
        {car.stats && (
          <div className="car-stats-container">
            <div className="car-stats-preview">
              {car.stats.power && (
                <span className="stat-with-icon">
                  <EngineIcon />
                  {car.stats.power}
                </span>
              )}
              {car.stats.zeroToSixty && (
                <span className="stat-with-icon">
                  <TimerIcon />
                  {car.stats.zeroToSixty}
                </span>
              )}
              {car.stats.drivetrain && (
                <span className="stat-with-icon">
                  <DrivetrainIcon />
                  {car.stats.drivetrain}
                </span>
              )}
            </div>
            {car.stats.usage && car.stats.usage.length > 0 && (
              <div className="car-stats-preview">
                {car.stats.usage.map(use => (
                  <span key={use} className="stat-with-icon">
                    {getUsageIcon(use)}
                    {use}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

CarCard.displayName = 'CarCard';

CarCard.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    briefInfo: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      power: PropTypes.string,
      zeroToSixty: PropTypes.string,
      forzaClass: PropTypes.string,
      drivetrain: PropTypes.string,
      transmission: PropTypes.string,
      status: PropTypes.string,
      usage: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired,
  onCardClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

function GarageGrid({ cars, onCardClick }) {
  return (
    <div className="garage-grid">
      {cars.map((car, index) => (
        <CarCard key={car.id} car={car} onCardClick={onCardClick} index={index} />
      ))}
    </div>
  );
}

GarageGrid.propTypes = {
  cars: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCardClick: PropTypes.func.isRequired
};

export default GarageGrid;
