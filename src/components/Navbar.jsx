import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/portfolio">
          Roman Garms
        </Link>
        <button
          className="navbar-toggler navbar-dark"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                to="/portfolio"
              >
                Portfolio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                to="/about"
              >
                About Me
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                to="/garage"
              >
                Garage
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Projects
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="https://romangarms.com/concepts-file-viewer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Concepts File Viewer
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="https://nowplaying.romangarms.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Now Playing
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="https://tracker.romangarms.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhereHaveIBeen
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="/UltimateTicTacToe/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    UltimateTicTacToe
                  </a>
                </li>
                
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
