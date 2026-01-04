import PropTypes from 'prop-types';
import './ReferrerList.css';

function ReferrerList({ data, title = 'Traffic Sources' }) {
  if (!data || data.length === 0) {
    return (
      <div className="referrer-list">
        <h3 className="referrer-title">{title}</h3>
        <div className="referrer-empty">No referrer data available</div>
      </div>
    );
  }

  const totalViews = data.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className="referrer-list">
      <h3 className="referrer-title">{title}</h3>
      <div className="referrer-items">
        {data.map(({ referrer, views }) => {
          const percentage = totalViews > 0 ? (views / totalViews) * 100 : 0;
          return (
            <div key={referrer} className="referrer-item">
              <div className="referrer-info">
                <span className="referrer-name">{referrer}</span>
                <span className="referrer-count">{views} views</span>
              </div>
              <div className="referrer-bar-container">
                <div
                  className="referrer-bar"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

ReferrerList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      referrer: PropTypes.string.isRequired,
      views: PropTypes.number.isRequired
    })
  ),
  title: PropTypes.string
};

export default ReferrerList;
