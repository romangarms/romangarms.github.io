import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TopPostsTable.css';

function TopPostsTable({ data, title = 'Top Posts' }) {
  if (!data || data.length === 0) {
    return (
      <div className="top-posts-table">
        <h3 className="top-posts-title">{title}</h3>
        <div className="top-posts-empty">No post data available</div>
      </div>
    );
  }

  return (
    <div className="top-posts-table">
      <h3 className="top-posts-title">{title}</h3>
      <div className="posts-list">
        {data.map(({ postSlug, views }, index) => (
          <div key={postSlug} className="post-row">
            <span className="post-rank">#{index + 1}</span>
            <Link
              to={`/portfolio/${postSlug}`}
              className="post-slug"
            >
              {formatSlug(postSlug)}
            </Link>
            <span className="post-views">{views} views</span>
            <Link
              to={`/stats/${postSlug}`}
              className="post-stats-link"
              title="View detailed stats"
            >
              Stats
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Format slug to readable title
 */
function formatSlug(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

TopPostsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      postSlug: PropTypes.string.isRequired,
      views: PropTypes.number.isRequired
    })
  ),
  title: PropTypes.string
};

export default TopPostsTable;
