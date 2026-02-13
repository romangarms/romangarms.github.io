import { Link } from 'react-router-dom';
import './SocialSection.css';

function SocialSection({ iconClassName = "" }) {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/romangarms",
      icon: "/images/github.svg",
      alt: "GitHub Icon"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/roman-garms/",
      icon: "/images/linkedIn.svg",
      alt: "LinkedIn Icon"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/romangarms",
      icon: "/images/instagram.svg",
      alt: "Instagram Icon"
    },
    {
      name: "Mail",
      url: "mailto:romangarms@gmail.com",
      icon: "/images/mail.svg",
      alt: "Mail Icon"
    },
    {
      name: "Resume",
      url: "https://docs.google.com/document/d/1is7jqNzrzXMzKfPKfckSH3HTqjGVDyygLRA1Ne9f0dA/edit?usp=sharing",
      icon: "/images/resume.svg",
      alt: "Resume Icon"
    }
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%' }}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          >
            <img
              className={iconClassName}
              src={link.icon}
              alt={link.alt}
              style={{ width: '100%', height: 'auto', maxWidth: '80px' }}
            />
          </a>
        ))}
      </div>
      <Link to="/about" className="social-section-read-more">
        Read more
      </Link>
    </>
  );
}

export default SocialSection;
