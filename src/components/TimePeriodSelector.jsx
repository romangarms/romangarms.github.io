import PropTypes from 'prop-types';
import { TIME_PERIODS } from '../services/statsService';
import './TimePeriodSelector.css';

const PERIOD_LABELS = {
  [TIME_PERIODS.NOW]: 'Now',
  [TIME_PERIODS.DAY]: 'Day',
  [TIME_PERIODS.WEEK]: 'Week',
  [TIME_PERIODS.MONTH]: 'Month',
  [TIME_PERIODS.ALL]: 'All Time'
};

function TimePeriodSelector({ selected, onChange }) {
  return (
    <div className="time-period-selector">
      {Object.entries(PERIOD_LABELS).map(([period, label]) => (
        <button
          key={period}
          className={`period-btn ${selected === period ? 'active' : ''}`}
          onClick={() => onChange(period)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

TimePeriodSelector.propTypes = {
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TimePeriodSelector;
