import './Sidebar.css';
import SocialSection from './SocialSection';

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
          Hi! I'm Roman Garms, a Computer Science major going to University of California Santa Cruz.
        </p>
        <p>
          I'm interested in computers, cars, videography, as well as trying to get tech to do something it's never
          done before. Big fan of porting Doom to things it never should run on.
        </p>
        <p>
          This is my portfolio, where I showcase some of the projects I've worked on over the years.        </p>
      </div>

      <div className="sidebar-links-row">
        <div id="sidebar-links">
          <h2>Social Links</h2>
          <SocialSection iconClassName="sidebar-icon" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
