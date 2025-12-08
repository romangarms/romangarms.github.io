import './Footer.css';

function Footer() {
  return (
    <div id="footer">
      <div id="footer-tiles">
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
        <a href="https://www.instagram.com/romangarms" target="_blank" rel="noopener noreferrer" id="footer-links">
          Instagram
        </a>
      </div>
    </div>
  );
}

export default Footer;
