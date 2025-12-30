import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BloggerRSSClient, BLOGGER_CONFIG } from '../services/bloggerAPI';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import PortfolioGrid from '../components/PortfolioGrid';
import './Portfolio.css';

// Generate URL-friendly slug from post title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

function Portfolio() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Portfolio | Roman Garms';
    return () => { document.title = 'Roman Garms'; };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const client = new BloggerRSSClient(BLOGGER_CONFIG);
        const fetchedPosts = await client.fetchPosts();

        // Sort posts by published date (newest first)
        const sortedPosts = fetchedPosts.sort((a, b) => {
          const dateA = new Date(a.published);
          const dateB = new Date(b.published);
          return dateB - dateA;
        });

        setPosts(sortedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const openPost = useCallback((post) => {
    const slug = generateSlug(post.title);
    navigate(`/portfolio/${slug}`);
  }, [navigate]);

  return (
    <div className="portfolio-page">
      <div id="body">
        <Sidebar />
        <PortfolioGrid
          posts={posts}
          loading={loading}
          error={error}
          onCardClick={openPost}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Portfolio;
