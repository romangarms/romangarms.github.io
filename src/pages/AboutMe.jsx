import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './AboutMe.css';
import { workExperience } from '../data/experienceData';

const tileAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const tileTransition = (index) => ({
  duration: 0.4,
  delay: index * 0.05,
});

function AboutMe() {
  useEffect(() => {
    document.title = 'About Me | Roman Garms';
    return () => { document.title = 'Roman Garms'; };
  }, []);

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
              to track all the roads I've driven on, and a sample manager for the Teenage Engineer OP-Z and OP-1 synthesizers.
            </p>
          </motion.div>

          {/* Bottom left: More Info */}
          <motion.div
            className="tile"
            {...tileAnimation}
            transition={tileTransition(3)}
          >
            <h3>More Info:</h3>
            <p>That's me. I'm tall.</p>
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
              <li><a href="/portfolio/raspberry-pi-spotify-status-the-sequel">Spotify Now Playing web app designed for a Raspberry Pi</a></li>
              <li><a href="/portfolio/videopaks-for-the-op-z">Teenage Engineering OP-1 Tombola themed music utility for the OP-Z synthesizer</a></li>
              <li><a href="/portfolio/hacking-my-mazda-infotainment-mzd-aio-and-casdk">Custom applications to run on my car's infotainment system</a></li>
              <li><a href="/portfolio/programming-a-forza-horizon-style-map-tracker-wherehaveibeen">A Forza-Horizon-like location tracker website that shows me all of the roads I've driven</a></li>
              <li><a href="/portfolio/making-a-playstation-3-game-in-2024-ps3-unity-sdk">Porting a friend's game to the Playstation 3</a></li>
              <li><a href="/portfolio/drtuned-tuning-my-car-with-my-steam-deck">Tuning my car with a Steam Deck</a></li>
              <li><a href="/portfolio/doom-on-a-drone-controller">Running Doom on a drone controller</a></li>
            </ul>
          </motion.div>
          <motion.div
            className="tile tile-languages"
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
              <li><code>Typescript</code></li>
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

        {/* Work Experience */}
        <div className="tile-grid">
          <motion.div
            className="tile tile-full work-experience-section"
            {...tileAnimation}
            transition={tileTransition(7)}
          >
            <h3>Work Experience</h3>
            {workExperience.map((job) => (
              <div key={job.id} className="work-experience-item">
                <div className="work-experience-header">
                  <h4>{job.company} - {job.role}</h4>
                  <span className="work-experience-date">{job.dateRange}</span>
                </div>
                {job.workType && (
                  <span className="work-experience-location">
                    {job.location} • {job.workType}
                  </span>
                )}
                {!job.workType && (
                  <span className="work-experience-location">
                    {job.location}
                  </span>
                )}
                <p className="work-experience-description">{job.description}</p>
                <div className="work-experience-skills">
                  {job.skills.map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="work-experience-footer">
              <a
                href="https://docs.google.com/document/d/1is7jqNzrzXMzKfPKfckSH3HTqjGVDyygLRA1Ne9f0dA/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="resume-link"
              >
                View Full Resume →
              </a>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
  );
}

export default AboutMe;
