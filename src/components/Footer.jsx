import './Footer.css';

function Footer() {
  return (
    <div id="footer">
      <div style={{ marginLeft: '2%', marginRight: '1%' }} id="footer-tiles">
        <h2>Social Links</h2>

        <img width="24px" className="footer-icon" src="/images/github.svg" alt="GitHub Icon" />
        <a href="https://github.com/romangarms" target="_blank" rel="noopener noreferrer" id="footer-links">
          GitHub
        </a>
        <br />

        <img width="24px" className="footer-icon" src="/images/linkedIn.svg" alt="LinkedIn Icon" />
        <a href="https://www.linkedin.com/in/roman-garms/" target="_blank" rel="noopener noreferrer" id="footer-links">
          LinkedIn
        </a>
        <br />

        <img width="24px" className="footer-icon" src="/images/instagram.svg" alt="Instagram Icon" />
        <a href="https://www.instagram.com/romanogarmez/" target="_blank" rel="noopener noreferrer" id="footer-links">
          Instagram
        </a>
      </div>

      <div style={{ marginLeft: '1%', marginRight: '2%' }} id="footer-tiles">
        <h2>Interactive Projects</h2>

        <img width="24px" className="footer-icon" src="/images/openinnew.svg" alt="Open In New Icon" />
        <a href="https://nowplaying.romangarms.com/" target="_blank" rel="noopener noreferrer" id="footer-links">
          Now Playing
        </a>
        <br />

        <img width="24px" className="footer-icon" src="/images/openinnew.svg" alt="Open In New Icon" />
        <a href="https://tracker.romangarms.com/" target="_blank" rel="noopener noreferrer" id="footer-links">
          WhereHaveIBeen
        </a>
        <br />

        <img width="24px" className="footer-icon" src="/images/openinnew.svg" alt="Open In New Icon" />
        <a href="/UltimateTicTacToe/index.html" target="_blank" rel="noopener noreferrer" id="footer-links">
          UltimateTicTacToe
        </a>
        <br />
      </div>
    </div>
  );
}

export default Footer;
