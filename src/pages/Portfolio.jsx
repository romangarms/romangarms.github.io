import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BloggerRSSClient, BLOGGER_CONFIG } from '../services/bloggerAPI';
import Modal from '../components/Modal';
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  const openModal = useCallback((post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    const slug = generateSlug(post.title);
    navigate(`#${slug}`, { replace: true });
  }, [navigate]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPost(null);
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  // Handle initial hash on page load (for shared links)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && posts.length > 0) {
      const matchingPost = posts.find(
        (post) => generateSlug(post.title) === hash
      );
      if (matchingPost) {
        setSelectedPost(matchingPost);
        setIsModalOpen(true);
      }
    }
  }, [posts]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setIsModalOpen(false);
        setSelectedPost(null);
      } else if (posts.length > 0) {
        const matchingPost = posts.find(
          (post) => generateSlug(post.title) === hash
        );
        if (matchingPost) {
          setSelectedPost(matchingPost);
          setIsModalOpen(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [posts]);


  return (
    <div className="portfolio-page">
      <div id="body">
        <Sidebar />
        <PortfolioGrid
          posts={posts}
          loading={loading}
          error={error}
          onCardClick={openModal}
        />
      </div>

      <Footer />

      <Modal post={selectedPost} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Portfolio;
