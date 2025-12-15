import { motion } from 'framer-motion';
import './AboutMe.css';

const tileAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const tileTransition = (index) => ({
  duration: 0.4,
  delay: index * 0.05,
});

function AboutMe() {
  return (
    <div className="about-me-page">
      <div className="about-me-container">
        {/* Full-width title */}
        <div className="tile-grid single-row">
        <motion.div
          className="tile tile-full"
          {...tileAnimation}
          transition={tileTransition(0)}
        >
          <h1>Roman Garms: About Me</h1>
        </motion.div>
      </div>

      {/* Image + intro */}
      <div className="tile-grid two-column-layout">
        {/* Top left: image */}
        <motion.div
          className="tile tile-image"
          {...tileAnimation}
          transition={tileTransition(1)}
        >
          <div className="image-row">
            <img src="/images/sunsetpfp.jpg" alt="Roman Garms with a cat on his shoulder" />
            <img src="/images/romanoldmazda.jpg" alt="Roman Garms with a Mazda" />
          </div>
        </motion.div>

        {/* Right column: tall tile spanning both rows */}
        <motion.div
          className="tile tile-tall"
          {...tileAnimation}
          transition={tileTransition(2)}
        >
          <h3>Who I Am:</h3>
          <p>
            I'm Roman Garms, a Computer Science major going to University of California Santa Cruz. I'm
            interested in computers, cars, videography, as well as trying to get tech to do something it's never
            done before. Big fan of porting Doom to things it never should run on.
          </p>
          <p>
            I'm constantly working on new projects of all kinds. Recently I've been working on a mapping project
            to track all the roads I've driven on, and a web app to show my current Spotify listening status on
            a Raspberry Pi.
          </p>
          <p>
            Currently employed as a Junior Software Engineer at Logic.inc.
          </p>
        </motion.div>

        {/* Bottom left: More Info */}
        <motion.div
          className="tile"
          {...tileAnimation}
          transition={tileTransition(3)}
        >
          <h3>More Info:</h3>
          <p>That's me.</p>
        </motion.div>
      </div>

      {/* Projects + Languages */}
      <div className="tile-grid">
        <motion.div
          className="tile"
          {...tileAnimation}
          transition={tileTransition(4)}
        >
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
        </motion.div>
        <motion.div
          className="tile"
          {...tileAnimation}
          transition={tileTransition(5)}
        >
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
        </motion.div>
      </div>

      {/* Social Links */}
      <div className="tile-grid">
        <motion.div
          className="tile tile-full"
          {...tileAnimation}
          transition={tileTransition(6)}
        >
          <h3>Social Links:</h3>
          <p>
            Check out my social links! You can see a lot of my projects on GitHub, view my work experience
            on LinkedIn, see pretty photos on my Instagram, or send me an email.
          </p>
          <div className="social-links-row">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/romangarms">
              <img src="/images/github.svg" alt="GitHub logo" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/roman-garms/">
              <img src="/images/linkedIn.svg" alt="LinkedIn logo" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/romangarms">
              <img src="/images/instagram.svg" alt="Instagram logo" />
            </a>
            <a href="mailto:romangarms@gmail.com">
              <img src="/images/mail.svg" alt="Email" />
            </a>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}

export default AboutMe;
