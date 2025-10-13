import { useState, useEffect } from 'react';
import { BloggerRSSClient, BLOGGER_CONFIG } from '../services/bloggerAPI';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import PortfolioGrid from '../components/PortfolioGrid';
import './Portfolio.css';

function Portfolio() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };


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
