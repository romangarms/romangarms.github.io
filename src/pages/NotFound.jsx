import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <h1 className="page-title">404</h1>
      <p className="page-lead" style={{ margin: '0 auto 1rem' }}>That page doesn't exist.</p>
      <Link to="/">Back to the leaderboards</Link>
    </div>
  );
}
