import './AboutMe.css';

function AboutMe() {
  return (
    <main className="about-me-page">
      {/* Full-width title */}
      <div className="tile-grid single-row">
        <div className="tile tile-full">
          <h1>Roman Garms: About Me</h1>
        </div>
      </div>

      {/* Image + intro */}
      <div className="tile-grid tile-2col-fixed">
        {/* Left column: image + text stacked */}
        <div className="nested-column">
          <div className="tile tile-image half-height">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src="/images/sunsetpfp.jpg" alt="Roman Garms with a cat on his shoulder" />
              <img src="/images/romanoldmazda.jpg" alt="Roman Garms with a Mazda" />
            </div>
          </div>
          <div className="tile half-height">
            <h3>More Info:</h3>
            <p>That's me.</p>
            <br />
            <br />
          </div>
        </div>

        {/* Right column: tall tile */}
        <div className="tile tile-tall">
          <h3>Who I Am:</h3>
          <p>
            I'm Roman Garms, a Computer Science major going to University of California Santa Cruz. I'm
            interested in computers, cars, videography, as well as trying to get tech to do something it's never
            done before. Big fan of porting Doom to things it never should run on.
          </p>
          <p>
            I'm constantly working on new projects of all kinds. Recently I've been working on a mapping project
            to track all the roads I've driven on, and a web app to show my current Spotify listening status on
            a Raspberry Pi. I also have a blog where I write about my projects and the research I've done to make them work.
          </p>
        </div>
      </div>

      {/* Projects + Languages */}
      <div className="tile-grid">
        <div className="tile">
          <h3>Some of my favorite projects:</h3>
          <ul>
            <li>Making my Spotify Now Playing web app designed for a Raspberry Pi</li>
            <li>Creating a Teenage Engineering OP-1 Tombola themed music utility for the OP-Z synthesizer</li>
            <li>Creating custom applications to run on my car's infotainment system</li>
            <li>Creating a Forza-Horizon-like location tracker website that shows me all of the roads I've driven</li>
            <li>Porting a friend's game to the Playstation 3</li>
            <li>Tuning my car with a Steam Deck</li>
            <li>Running Doom on a drone controller</li>
          </ul>
        </div>
        <div className="tile">
          <h3>I've been writing code with:</h3>
          <ul>
            <li><code>C</code></li>
            <li><code>C++</code></li>
            <li><code>C#</code></li>
            <li><code>Java</code></li>
            <li><code>Javascript</code></li>
            <li><code>Python</code></li>
            <li><code>Swift</code></li>
          </ul>
        </div>
      </div>

      {/* Social Links */}
      <div className="tile-grid">
        <div className="tile tile-small">
          <h3>GitHub</h3>
          <br />
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/romangarms">
            <div className="social-links">
              <img src="/images/github.svg" alt="GitHub logo" />
            </div>
          </a>
        </div>
        <div className="tile tile-small">
          <h3>LinkedIn</h3>
          <br />
          <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/roman-garms/">
            <div className="social-links">
              <img src="/images/linkedIn.svg" alt="LinkedIn logo" />
            </div>
          </a>
        </div>
        <div className="tile tile-small">
          <h3>Instagram</h3>
          <br />
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/romanogarmez/">
            <div className="social-links">
              <img src="/images/instagram.svg" alt="Instagram logo" />
            </div>
          </a>
        </div>
        <div className="tile tile-small">
          <h3>Social Links:</h3>
          <br />
          <p>Check out my social links!</p>
          <p>
            You can see a lot of my projects on GitHub, view my work experience on LinkedIn, and see pretty
            photos on my Instagram.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AboutMe;
