import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BloggerRSSClient, BLOGGER_CONFIG } from '../services/bloggerAPI';
import './Comments.css';

// Extract the numeric Blogger profile id from a profile URL for comparison
const getProfileId = (uri) => {
  if (!uri) return null;
  const match = uri.match(/profile\/(\d+)/);
  return match ? match[1] : null;
};

// True if a Blogger avatar URL is the generic anonymous placeholder
const isPlaceholderAvatar = (src) =>
  !src || src.includes('/img/b16') || src.includes('blank.gif');

// Turn bare http(s) URLs in comment HTML into clickable links, without
// touching URLs that are already inside an anchor tag.
const linkifyHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const urlRegex = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]}'"])/g;

  const targets = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue.includes('http')) continue;
    if (node.parentElement && node.parentElement.closest('a')) continue;
    targets.push(node);
  }

  targets.forEach((node) => {
    const text = node.nodeValue;
    const frag = doc.createDocumentFragment();
    let lastIndex = 0;
    text.replace(urlRegex, (match, url, offset) => {
      if (offset > lastIndex) {
        frag.appendChild(doc.createTextNode(text.slice(lastIndex, offset)));
      }
      const a = doc.createElement('a');
      a.href = url;
      a.textContent = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      frag.appendChild(a);
      lastIndex = offset + match.length;
      return match;
    });
    if (lastIndex < text.length) {
      frag.appendChild(doc.createTextNode(text.slice(lastIndex)));
    }
    node.parentNode.replaceChild(frag, node);
  });

  return doc.body.innerHTML;
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

function CommentItem({ comment, isPostAuthor }) {
  const initial = (comment.author || '?').trim().charAt(0).toUpperCase() || '?';
  const showImage = !isPlaceholderAvatar(comment.authorImage);

  const nameEl = comment.authorUri ? (
    <a
      href={comment.authorUri}
      target="_blank"
      rel="noopener noreferrer"
      className="comment-author-name"
    >
      {comment.author}
    </a>
  ) : (
    <span className="comment-author-name">{comment.author}</span>
  );

  return (
    <li className="comment-item">
      {showImage ? (
        <img
          src={comment.authorImage}
          alt={comment.author}
          className="comment-avatar"
          loading="lazy"
        />
      ) : (
        <div className="comment-avatar comment-avatar-fallback" aria-hidden="true">
          {initial}
        </div>
      )}
      <div className="comment-body">
        <div className="comment-meta">
          {nameEl}
          {isPostAuthor && <span className="comment-author-badge">Author</span>}
          <span className="comment-date">{formatDate(comment.published)}</span>
        </div>
        <div
          className="comment-content"
          dangerouslySetInnerHTML={{ __html: linkifyHtml(comment.content) }}
        />
      </div>
    </li>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    author: PropTypes.string,
    authorUri: PropTypes.string,
    authorImage: PropTypes.string,
    published: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  isPostAuthor: PropTypes.bool,
};

function Comments({ commentsUrl, commentCount, postUrl, postAuthorUri }) {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(commentCount || 0);
  const [loading, setLoading] = useState(Boolean(commentsUrl));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!commentsUrl) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const client = new BloggerRSSClient(BLOGGER_CONFIG);
    client
      .fetchComments(commentsUrl)
      .then((result) => {
        if (cancelled) return;
        setComments(result.comments);
        setTotal(result.total);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to fetch comments:', err);
        setError('Comments could not be loaded right now.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [commentsUrl]);

  const ownerId = getProfileId(postAuthorUri);
  const commentFormUrl = postUrl && postUrl !== '#'
    ? `${postUrl}#comment-form`
    : null;

  return (
    <section className="comments-section">
      <h3 className="comments-heading">
        Comments{!loading && total > 0 ? ` (${total})` : ''}
      </h3>

      {loading && (
        <div className="comments-loading">
          <div className="loading-spinner"></div>
          <p>Loading comments...</p>
        </div>
      )}

      {!loading && error && (
        <p className="comments-empty">{error}</p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="comments-empty">No comments yet — be the first to share your thoughts.</p>
      )}

      {!loading && !error && comments.length > 0 && (
        <ul className="comments-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isPostAuthor={
                ownerId !== null && getProfileId(comment.authorUri) === ownerId
              }
            />
          ))}
        </ul>
      )}

      {commentFormUrl && (
        <a
          className="comments-cta"
          href={commentFormUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {comments.length > 0 ? 'Add a comment on Blogger' : 'Leave a comment on Blogger'} →
        </a>
      )}
    </section>
  );
}

Comments.propTypes = {
  commentsUrl: PropTypes.string,
  commentCount: PropTypes.number,
  postUrl: PropTypes.string,
  postAuthorUri: PropTypes.string,
};

export default Comments;
