import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchPostViews,
  aggregateViewsByTime,
  getReferrerBreakdown,
  TIME_PERIODS
} from '../services/statsService';
import TimePeriodSelector from '../components/TimePeriodSelector';
import StatsChart from '../components/StatsChart';
import ReferrerList from '../components/ReferrerList';
import Footer from '../components/Footer';
import './PostStats.css';

/**
 * Format slug to readable title
 */
function formatSlug(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function PostStats() {
  const { slug } = useParams();
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(TIME_PERIODS.WEEK);

  useEffect(() => {
    const title = formatSlug(slug);
    document.title = `Stats: ${title} | Roman Garms`;
    return () => { document.title = 'Roman Garms'; };
  }, [slug]);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const fetchedViews = await fetchPostViews(slug, period);
      setViews(fetchedViews);
      setLoading(false);
    };

    loadStats();
  }, [slug, period]);

  const chartData = useMemo(() => aggregateViewsByTime(views, period), [views, period]);
  const referrers = useMemo(() => getReferrerBreakdown(views), [views]);
  const totalViews = views.length;

  return (
    <div className="post-stats-page">
      <div className="post-stats-container">
        <header className="post-stats-header">
          <Link to="/stats" className="back-link">
            ← Back to Stats
          </Link>
          <h1>{formatSlug(slug)}</h1>
          <Link to={`/portfolio/${slug}`} className="view-post-link">
            View Post →
          </Link>
        </header>

        <div className="post-stats-controls">
          <TimePeriodSelector selected={period} onChange={setPeriod} />
        </div>

        {loading ? (
          <div className="post-stats-loading">
            <div className="loading-spinner"></div>
            <p>Loading stats...</p>
          </div>
        ) : (
          <>
            <div className="post-stats-summary">
              <div className="stat-card large">
                <span className="stat-value">{totalViews}</span>
                <span className="stat-label">Total Views</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{referrers.length}</span>
                <span className="stat-label">Traffic Sources</span>
              </div>
            </div>

            <StatsChart data={chartData} title="Views Over Time" />

            <ReferrerList data={referrers} title="Traffic Sources" />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default PostStats;
