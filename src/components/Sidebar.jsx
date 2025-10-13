import './Sidebar.css';

function Sidebar() {
  return (
    <div id="sidebar">
      <div className="sidebar-image-container">
        <img
          src="/images/sunsetpfp.jpg"
          alt="Roman Garms with a cat on his shoulder"
        />
      </div>
      <div id="sidebar-bio">
        <p>
          Hiya! I'm Roman Garms, a Computer Science major going to University of California Santa Cruz.
        </p>
        <p>
          I'm interested in computers, cars, videography, as well as trying to get tech to do something it's never
          done before. Big fan of porting Doom to things it never should run on.
        </p>
        <p>
          This is my portfolio, where I showcase some of the projects I've worked on over the years.
          Click on any of the projects to learn more about them.
        </p>
      </div>

      <div className="sidebar-links-row">
        <div id="sidebar-links">
          <h2>Social Links</h2>
          <img width="48px" className="sidebar-icon" src="/images/github.svg" alt="GitHub Icon" />
          <a href="https://github.com/romangarms" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <br />

          <img width="48px" className="sidebar-icon" src="/images/linkedIn.svg" alt="LinkedIn Icon" />
          <a href="https://www.linkedin.com/in/roman-garms/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <br />

          <img width="48px" className="sidebar-icon" src="/images/instagram.svg" alt="Instagram Icon" />
          <a href="https://www.instagram.com/romanogarmez/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>

        <div id="sidebar-links">
          <h2>Interactive Projects</h2>
          <a href="https://nowplaying.romangarms.com/" target="_blank" rel="noopener noreferrer">
            Now Playing
          </a>
          <br />

          <a href="https://tracker.romangarms.com/" target="_blank" rel="noopener noreferrer">
            WhereHaveIBeen
          </a>
          <br />

          <a href="/UltimateTicTacToe/index.html" target="_blank" rel="noopener noreferrer">
            UltimateTicTacToe
          </a>
          <br />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
