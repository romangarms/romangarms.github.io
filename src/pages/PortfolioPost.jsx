import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BloggerRSSClient, BLOGGER_CONFIG } from '../services/bloggerAPI';
import Footer from '../components/Footer';
import './PortfolioPost.css';

// Generate URL-friendly slug from post title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Extract headings from HTML content for table of contents
const extractHeadings = (htmlContent) => {
  if (!htmlContent) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4');

  return Array.from(headings).map((heading, index) => ({
    id: `heading-${index}`,
    text: heading.textContent,
    level: parseInt(heading.tagName.charAt(1)),
  }));
};

// Add IDs to headings in HTML content for scroll targeting
const addHeadingIds = (htmlContent) => {
  if (!htmlContent) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4');

  headings.forEach((heading, index) => {
    heading.id = `heading-${index}`;
  });

  return doc.body.innerHTML;
};

function PortfolioPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const client = new BloggerRSSClient(BLOGGER_CONFIG);
        const posts = await client.fetchPosts();

        const matchingPost = posts.find(
          (p) => generateSlug(p.title) === slug
        );

        if (matchingPost) {
          setPost(matchingPost);
        } else {
          setError('Post not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const headings = useMemo(() => {
    return post ? extractHeadings(post.content) : [];
  }, [post]);

  const contentWithIds = useMemo(() => {
    return post ? addHeadingIds(post.content) : '';
  }, [post]);

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Extract first image from post content for hero (get full resolution)
  const heroImage = useMemo(() => {
    if (!post?.content) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const firstImg = doc.querySelector('img');
    if (!firstImg?.src) return null;

    // Blogger images have size params like /s320/ or =s320 - replace with larger size
    let imgUrl = firstImg.src;
    imgUrl = imgUrl.replace(/\/s\d+\//, '/s1600/');
    imgUrl = imgUrl.replace(/=s\d+/, '=s1600');
    imgUrl = imgUrl.replace(/=w\d+-h\d+/, '=w1600');
    return imgUrl;
  }, [post]);

  // Preload hero image and track loading state
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  useEffect(() => {
    if (!heroImage) return;

    setHeroImageLoaded(false);
    const img = new Image();
    img.onload = () => setHeroImageLoaded(true);
    img.src = heroImage;
  }, [heroImage]);

  if (loading) {
    return (
      <div className="portfolio-post-page">
        <div className="post-loading">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="portfolio-post-page">
        <div className="post-error">
          <h2>Post Not Found</h2>
          <p>{error || 'The requested post could not be found.'}</p>
          <Link to="/portfolio" className="back-to-portfolio">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-post-page">
      {/* Hero Section */}
      <div
        className={`post-hero ${heroImageLoaded ? 'image-loaded' : ''}`}
        style={heroImage ? { '--hero-image': `url(${heroImage})` } : {}}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <Link to="/portfolio" className="back-link">
              ← Back to Portfolio
            </Link>
            <h1 className="hero-title">{post.title}</h1>
            <div className="hero-meta">
              <span className="hero-date">
                {new Date(post.published).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="hero-author">by {post.author}</span>
            </div>
            {post.categories && post.categories.length > 0 && (
              <div className="hero-categories">
                {post.categories.map(cat => (
                  <span key={cat} className="hero-category">{cat}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="post-container">
        {/* Table of Contents Sidebar */}
        {headings.length > 0 && (
          <aside className="toc-sidebar">
            <div className="toc-sticky">
              <h3 className="toc-title">Contents</h3>
              <nav className="toc-nav">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    className={`toc-link toc-level-${heading.level}`}
                    onClick={() => scrollToHeading(heading.id)}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Post Content */}
        <article className={`post-content ${headings.length === 0 ? 'no-toc' : ''}`}>
          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          <div className="post-footer">
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="post-original-link">
              View on blog.romangarms.com
            </a>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}

export default PortfolioPost;
