import { useEffect } from 'react';
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const date = new Date(post.published);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoriesHtml = post.categories && post.categories.length > 0 ? (
    <div className="post-categories">
      {post.categories.map(cat => (
        <span key={cat} className="post-category">{cat}</span>
      ))}
    </div>
  ) : null;

  const handleBackgroundClick = (e) => {
    if (e.target.id === 'post-modal') {
      onClose();
    }
  };

  return (
    <div id="post-modal" style={{ display: 'flex' }} onClick={handleBackgroundClick}>
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
              <span className="post-date">{formattedDate}</span>
              <span className="post-author">by {post.author}</span>
            </div>
            {categoriesHtml}
          </div>
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="post-footer">
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="post-original-link">
              View on blog.romangarms.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
