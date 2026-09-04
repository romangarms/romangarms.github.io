import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { asset } from '../utils/asset';
import './Navbar.css';

const LINKS = [
  { to: '/acceleration', label: 'Acceleration' },
  { to: '/leaderboard', label: 'Leaderboard (WA)' },
  { to: '/leaderboard-ca', label: 'Leaderboard (CA)' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link className="navbar-brand" to="/" onClick={() => setOpen(false)}>
          <img src={asset('images/logo.png')} alt="" className="navbar-logo" />
          <span>Aerial Reforestation</span>
        </Link>
        <button
          className="navbar-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="navbar-links"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul id="navbar-links" className={open ? 'navbar-links open' : 'navbar-links'}>
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
