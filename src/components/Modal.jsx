import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.css';

function Modal({ post, isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, [isOpen, onClose]);

  // Render modal content only when post exists
  const modalContent = post ? (
    <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div id="modal-post-content">
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span className="post-date">{new Date(post.published).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span className="post-author">by {post.author}</span>
            </div>
            {post.categories && post.categories.length > 0 && (
              <div className="post-categories">
                {post.categories.map(cat => (
                  <span key={cat} className="post-category">{cat}</span>
                ))}
              </div>
            )}
          </div>
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="post-footer">
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="post-original-link">
              View on blog.romangarms.com
            </a>
          </div>
        </div>
      </div>
  ) : null;

  // Use portal to render at document.body level
  return createPortal(
    <div
      id="post-modal"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      {modalContent}
    </div>,
    document.body
  );
}

Modal.propTypes = {
  post: PropTypes.shape({
    published: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Modal;
