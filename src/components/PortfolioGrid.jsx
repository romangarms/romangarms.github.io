function PortfolioGrid({ posts, loading, error, onCardClick }) {
  const extractImageFromContent = (content) => {
    if (!content) return null;
    const imgMatch = content.match(/<img[^>]+src=["']([^"'>]+)["']/);
    return imgMatch?.[1] || null;
  };

  const extractExcerpt = (content, maxLength = 250) => {
    if (!content) return 'Click to read more about this project.';
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const PortfolioCard = ({ post }) => {
    const imageUrl = extractImageFromContent(post.content);
    const excerpt = extractExcerpt(post.content);
    const date = new Date(post.published);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });

    return (
      <div
        className="portfolio-card"
        onClick={() => onCardClick(post)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCardClick(post);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Read post: ${post.title}`}
      >
        <div className="box">
          {imageUrl && <img src={imageUrl} className="preview-image" alt={post.title} />}
          <h4>{post.title}</h4>
          <p className="post-excerpt">{excerpt}</p>
          {post.categories && post.categories.length > 0 && (
            <div className="post-categories-card">
              {post.categories.slice(0, 4).map(cat => (
                <span key={cat} className="post-category-card">{cat}</span>
              ))}
            </div>
          )}
          <p className="post-date-preview">{formattedDate}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="portfolio-grid-container">
      <div className="container" id="portfolio-container">
        {loading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: '20px' }}>Loading blog posts...</p>
          </div>
        )}

        {error && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#dc3545' }}>Error Loading Posts</h3>
            <p>{error}</p>
            <p style={{ marginTop: '20px' }}>
              <small>Please check the browser console for more details.</small>
            </p>
          </div>
        )}

        {!loading && !error && posts.map((post) => (
          <PortfolioCard key={post.url} post={post} />
        ))}
      </div>
    </div>
  );
}

export default PortfolioGrid;
