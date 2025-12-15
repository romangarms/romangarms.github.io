import './Footer.css';
import SocialSection from './SocialSection';

function Footer() {
  return (
    <div id="footer">
      <div id="footer-tiles">
        <h2>Social Links</h2>
        <SocialSection iconClassName="footer-icon" />
      </div>
    </div>
  );
}

export default Footer;
