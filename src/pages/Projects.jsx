import { useEffect, useState } from 'react';
import { projects } from '../data/projectsData';
import Footer from '../components/Footer';
import './Projects.css';

// Cache configuration (matches blog post cache duration)
const GITHUB_CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

// Helper functions for GitHub stars caching
const getGitHubCacheKey = (owner, repo) => `github_stars_${owner}_${repo}`;
const getGitHubCacheTimestampKey = (owner, repo) => `github_stars_${owner}_${repo}_timestamp`;

const getCachedStars = (owner, repo) => {
  try {
    const cacheKey = getGitHubCacheKey(owner, repo);
    const timestampKey = getGitHubCacheTimestampKey(owner, repo);

    const cachedStars = sessionStorage.getItem(cacheKey);
    const cacheTimestamp = sessionStorage.getItem(timestampKey);

    if (!cachedStars || !cacheTimestamp) {
      return null;
    }

    const now = Date.now();
    const timestamp = parseInt(cacheTimestamp, 10);

    // Check if cache is still fresh
    if (now - timestamp < GITHUB_CACHE_DURATION) {
      return parseInt(cachedStars, 10);
    }

    // Cache expired
    sessionStorage.removeItem(cacheKey);
    sessionStorage.removeItem(timestampKey);
    return null;

  } catch (error) {
    console.error('Error reading GitHub stars cache:', error);
    return null;
  }
};

const cacheStars = (owner, repo, stars) => {
  try {
    const cacheKey = getGitHubCacheKey(owner, repo);
    const timestampKey = getGitHubCacheTimestampKey(owner, repo);

    sessionStorage.setItem(cacheKey, stars.toString());
    sessionStorage.setItem(timestampKey, Date.now().toString());
  } catch (error) {
    console.error('Error caching GitHub stars:', error);
  }
};

// Component to fetch and display GitHub stars
function GitHubStars({ githubUrl }) {
  const [stars, setStars] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!githubUrl) {
      setLoading(false);
      return;
    }

    // Extract owner and repo from GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      setLoading(false);
      return;
    }

    const [, owner, repo] = match;

    // Check cache first
    const cachedStars = getCachedStars(owner, repo);
    if (cachedStars !== null) {
      setStars(cachedStars);
      setLoading(false);
      return;
    }

    // Fetch repository data from GitHub API
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          const starCount = data.stargazers_count;
          setStars(starCount);
          cacheStars(owner, repo, starCount);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [githubUrl]);

  if (loading || stars === null) return null;

  return (
    <span className="github-stars">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
      </svg>
      {stars.toLocaleString()}
    </span>
  );
}

// Helper to get GitHub URL from project
const getProjectGithubUrl = (project) => {
  if (project.githubUrl) return project.githubUrl;
  if (project.githubUrls && project.githubUrls[0]) return project.githubUrls[0].url;
  return null;
};

// Fetch stars for a single project
const fetchProjectStars = async (project) => {
  const githubUrl = getProjectGithubUrl(project);
  if (!githubUrl) return { project, stars: null };

  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return { project, stars: null };

  const [, owner, repo] = match;

  // Check cache first
  const cachedStars = getCachedStars(owner, repo);
  if (cachedStars !== null) {
    return { project, stars: cachedStars };
  }

  // Try to fetch from API
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await response.json();

    if (data.stargazers_count !== undefined) {
      cacheStars(owner, repo, data.stargazers_count);
      return { project, stars: data.stargazers_count };
    }
  } catch (error) {
    // Fetch failed, will sort by date instead
  }

  return { project, stars: null };
};

function Projects() {
  const [sortedProjects, setSortedProjects] = useState(projects);

  useEffect(() => {
    document.title = 'Projects | Roman Garms';
    return () => {
      document.title = 'Roman Garms';
    };
  }, []);

  useEffect(() => {
    // Fetch stars for all projects and sort
    const sortProjects = async () => {
      const projectsWithStars = await Promise.allSettled(
        projects.map(project => fetchProjectStars(project))
      );

      // Extract successful results
      const results = projectsWithStars
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      // Check if we got any star counts
      const hasStars = results.some(r => r.stars !== null);

      // Sort based on what data we have
      const sorted = [...projects].sort((a, b) => {
        if (hasStars) {
          // Sort by stars (descending), with null values at the end
          const aResult = results.find(r => r.project.id === a.id);
          const bResult = results.find(r => r.project.id === b.id);
          const aStars = aResult?.stars ?? -1;
          const bStars = bResult?.stars ?? -1;

          if (aStars !== bStars) {
            return bStars - aStars; // Higher stars first
          }
        }

        // Fall back to date sorting (newer first)
        return new Date(b.date) - new Date(a.date);
      });

      setSortedProjects(sorted);
    };

    sortProjects();
  }, []);

  return (
    <div className="projects-page">
      <div className="projects-body">
        <div className="projects-header">
          <h1>Projects</h1>
          <p>A showcase of publicly available projects and applications</p>
        </div>

        <div className="projects-container">
          {sortedProjects.map((project) => (
            <div key={project.id} className="project-card">
              {/* Blurred background layer */}
              <div
                className="project-card-background"
                style={{ '--project-image': `url(${project.image})` }}
              />

              {/* Gradient overlay */}
              <div className="project-card-overlay" />

              {/* Card content */}
              <div className="project-card-content">
                {/* Left side - Image */}
                <div className="project-image-container">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-image"
                  />
                </div>

                {/* Right side - Info */}
                <div className="project-info">
                  <h2 className="project-title">{project.title}</h2>

                  <div className="project-tags">
                    {project.status && (
                      <span className={`project-status ${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    )}
                    {project.githubUrl && <GitHubStars githubUrl={project.githubUrl} />}
                    {project.githubUrls && project.githubUrls[0] && (
                      <GitHubStars githubUrl={project.githubUrls[0].url} />
                    )}
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>

                  <p className="project-description">
                    {project.description}
                    {project.blogPostUrl && (
                      <> <a href={project.blogPostUrl} className="read-more-link">(Read more)</a></>
                    )}
                    {project.blogPostUrls && project.blogPostUrls.map((post, index) => (
                      <span key={index}>
                        {' '}<a href={post.url} className="read-more-link">(Read more - {post.label})</a>
                      </span>
                    ))}
                  </p>

                  <div className="project-meta">
                    <span className="project-date">
                      {new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        timeZone: 'UTC'
                      })}
                    </span>
                  </div>

                  <div className="project-actions">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-btn project-btn-primary"
                      >
                        View Live
                      </a>
                    )}
                    {project.downloadUrl && (
                      <a
                        href={project.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-btn project-btn-primary"
                      >
                        Download
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-btn project-btn-secondary"
                      >
                        View on GitHub
                      </a>
                    )}
                    {project.githubUrls && project.githubUrls.map((repo, index) => (
                      <a
                        key={index}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-btn project-btn-secondary"
                      >
                        GitHub ({repo.label})
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Projects;
