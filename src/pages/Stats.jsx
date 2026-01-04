import { useState, useEffect, useMemo } from 'react';
import {
  fetchViews,
  aggregateViewsByTime,
  getTopPosts,
  getReferrerBreakdown,
  TIME_PERIODS
} from '../services/statsService';
import TimePeriodSelector from '../components/TimePeriodSelector';
import StatsChart from '../components/StatsChart';
import TopPostsTable from '../components/TopPostsTable';
import ReferrerList from '../components/ReferrerList';
import Footer from '../components/Footer';
import './Stats.css';

function Stats() {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(TIME_PERIODS.WEEK);

  useEffect(() => {
    document.title = 'Stats | Roman Garms';
    return () => { document.title = 'Roman Garms'; };
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const fetchedViews = await fetchViews(period);
      setViews(fetchedViews);
      setLoading(false);
    };

    loadStats();
  }, [period]);

  const chartData = useMemo(() => aggregateViewsByTime(views, period), [views, period]);
  const topPosts = useMemo(() => getTopPosts(views, 10), [views]);
  const referrers = useMemo(() => getReferrerBreakdown(views), [views]);
  const totalViews = views.length;

  return (
    <div className="stats-page">
      <div className="stats-container">
        <header className="stats-header">
          <h1>Portfolio Stats</h1>
          <p className="stats-subtitle">View statistics for portfolio posts</p>
        </header>

        <div className="stats-controls">
          <TimePeriodSelector selected={period} onChange={setPeriod} />
        </div>

        {loading ? (
          <div className="stats-loading">
            <div className="loading-spinner"></div>
            <p>Loading stats...</p>
          </div>
        ) : (
          <>
            <div className="stats-summary">
              <div className="stat-card">
                <span className="stat-value">{totalViews}</span>
                <span className="stat-label">Total Views</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{topPosts.length}</span>
                <span className="stat-label">Posts Viewed</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{referrers.length}</span>
                <span className="stat-label">Traffic Sources</span>
              </div>
            </div>

            <StatsChart data={chartData} title="Views Over Time" />

            <div className="stats-grid">
              <TopPostsTable data={topPosts} title="Top Posts" />
              <ReferrerList data={referrers} title="Traffic Sources" />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Stats;
