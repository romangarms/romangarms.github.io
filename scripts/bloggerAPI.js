/**
 * Blogger RSS Feed Integration for Portfolio
 *
 * This script fetches blog posts from your Blogger RSS feed and dynamically generates
 * the portfolio grid on Portfolio.html. Posts open in a modal overlay for seamless viewing.
 *
 * NO API KEY REQUIRED - RSS feeds are completely public!
 * Much simpler and more secure than the Blogger API approach.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const BLOGGER_CONFIG = {
    // Your Blogger RSS feed URL
    // Format: https://YOUR-BLOG.blogspot.com/feeds/posts/default
    rssUrl: 'https://blog.romangarms.com/feeds/posts/default',

    // Maximum number of posts to fetch
    maxResults: 50,

    // Cache duration in milliseconds (30 minutes)
    cacheDuration: 30 * 60 * 1000,

    // CORS proxies for local development (will try in order until one works)
    // Set to [] to disable CORS proxy
    corsProxies: [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/'
    ]
};

// ============================================================================
// RSS FEED CLIENT
// ============================================================================
class BloggerRSSClient {
    constructor(config) {
        this.config = config;
        this.cacheKey = 'blogger_posts_cache';
        this.cacheTimestampKey = 'blogger_posts_cache_timestamp';
    }

    /**
     * Determine if we're running locally and need CORS proxy
     */
    isLocalDevelopment() {
        const hostname = window.location.hostname;
        return hostname === 'localhost' ||
               hostname === '127.0.0.1' ||
               hostname === '' ||
               hostname.startsWith('192.168.') ||
               hostname.startsWith('10.') ||
               hostname.includes('local');
    }

    /**
     * Get fetch URLs to try (with CORS proxies if needed)
     */
    getFetchUrls() {
        const needsProxy = this.isLocalDevelopment() &&
                          this.config.corsProxies &&
                          this.config.corsProxies.length > 0;

        if (needsProxy) {
            // Return array of proxied URLs to try in order
            return this.config.corsProxies.map(proxy =>
                proxy + encodeURIComponent(this.config.rssUrl)
            );
        }

        // Production: just use direct URL
        return [this.config.rssUrl];
    }

    /**
     * Attempt to fetch from a single URL
     */
    async attemptFetch(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/xml, text/xml, application/atom+xml'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.text();
    }

    /**
     * Fetches blog posts from RSS feed with caching and fallback proxies
     */
    async fetchPosts() {
        // Check cache first
        const cachedData = this.getCachedPosts();
        if (cachedData) {
            return cachedData;
        }

        // Get list of URLs to try
        const urls = this.getFetchUrls();
        const isLocal = this.isLocalDevelopment();

        if (isLocal) {
            console.log('Local development detected - will try CORS proxies if needed');
        }

        let lastError = null;

        // Try each URL in order until one works
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];

            try {
                if (isLocal && i > 0) {
                    console.log(`Trying fallback proxy ${i}...`);
                }

                console.log('Fetching blog posts from RSS feed...');
                const xmlText = await this.attemptFetch(url);
                const posts = this.parseRSSFeed(xmlText);

                if (!posts || posts.length === 0) {
                    throw new Error('No posts found in RSS feed');
                }

                // Cache the results
                this.cachePosts(posts);

                console.log(`✓ Successfully fetched ${posts.length} blog posts`);
                return posts;

            } catch (error) {
                lastError = error;
                console.warn('Failed to fetch from ' + (isLocal ? 'proxy ' + (i + 1) : 'RSS feed') + ':', error.message);

                // If this isn't the last URL, continue to next
                if (i < urls.length - 1) {
                    continue;
                }
            }
        }

        // All URLs failed
        console.error('All fetch attempts failed');
        throw new Error(`Failed to fetch blog posts: ${lastError?.message || 'Unknown error'}`);
    }

    /**
     * Parse Atom/RSS XML feed into post objects
     */
    parseRSSFeed(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Failed to parse RSS feed XML');
        }

        // Blogger uses Atom format
        const entries = xmlDoc.querySelectorAll('entry');
        const posts = [];

        entries.forEach(entry => {
            try {
                const post = this.parseEntry(entry);
                if (post) {
                    posts.push(post);
                }
            } catch (error) {
                console.warn('Failed to parse entry:', error);
            }
        });

        return posts.slice(0, this.config.maxResults);
    }

    /**
     * Parse a single Atom entry into a post object
     */
    parseEntry(entry) {
        // Get title
        const titleEl = entry.querySelector('title');
        const title = titleEl ? titleEl.textContent : 'Untitled Post';

        // Get published date
        const publishedEl = entry.querySelector('published');
        const published = publishedEl ? publishedEl.textContent : new Date().toISOString();

        // Get content
        const contentEl = entry.querySelector('content');
        const content = contentEl ? contentEl.textContent : '';

        // Get post URL (find the alternate link)
        let url = '#';
        const links = entry.querySelectorAll('link');
        for (const link of links) {
            if (link.getAttribute('rel') === 'alternate' && link.getAttribute('type') === 'text/html') {
                url = link.getAttribute('href');
                break;
            }
        }

        // Get categories/labels
        const categories = [];
        const categoryEls = entry.querySelectorAll('category');
        categoryEls.forEach(cat => {
            const term = cat.getAttribute('term');
            if (term) {
                categories.push(term);
            }
        });

        // Get author
        const authorEl = entry.querySelector('author name');
        const author = authorEl ? authorEl.textContent : 'Roman Garms';

        return {
            title,
            published,
            content,
            url,
            categories,
            author
        };
    }

    /**
     * Get cached posts if they exist and are fresh
     */
    getCachedPosts() {
        try {
            const cachedPosts = sessionStorage.getItem(this.cacheKey);
            const cacheTimestamp = sessionStorage.getItem(this.cacheTimestampKey);

            if (!cachedPosts || !cacheTimestamp) {
                return null;
            }

            const now = Date.now();
            const timestamp = parseInt(cacheTimestamp, 10);

            // Check if cache is still fresh
            if (now - timestamp < this.config.cacheDuration) {
                return JSON.parse(cachedPosts);
            }

            // Cache expired
            this.clearCache();
            return null;

        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    }

    /**
     * Cache posts in sessionStorage
     */
    cachePosts(posts) {
        try {
            sessionStorage.setItem(this.cacheKey, JSON.stringify(posts));
            sessionStorage.setItem(this.cacheTimestampKey, Date.now().toString());
        } catch (error) {
            console.error('Error caching posts:', error);
        }
    }

    /**
     * Clear cached posts
     */
    clearCache() {
        sessionStorage.removeItem(this.cacheKey);
        sessionStorage.removeItem(this.cacheTimestampKey);
    }
}

// ============================================================================
// MODAL MANAGER
// ============================================================================
class PostModal {
    constructor() {
        this.modal = null;
        this.modalContent = null;
        this.isOpen = false;
    }

    /**
     * Initialize modal elements
     */
    init() {
        this.modal = document.getElementById('post-modal');
        this.modalContent = document.getElementById('modal-post-content');

        if (!this.modal || !this.modalContent) {
            console.error('Modal elements not found');
            return;
        }

        // Close button
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Open modal with post content
     */
    open(post) {
        if (!this.modal || !this.modalContent) {
            console.error('Modal not initialized');
            return;
        }

        // Format the date
        const date = new Date(post.published);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Build categories/tags HTML
        let categoriesHtml = '';
        if (post.categories && post.categories.length > 0) {
            categoriesHtml = '<div class="post-categories">' +
                post.categories.map(cat => `<span class="post-category">${cat}</span>`).join('') +
                '</div>';
        }

        // Build the modal content
        const html = `
            <div class="post-header">
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <span class="post-date">${formattedDate}</span>
                    <span class="post-author">by ${post.author}</span>
                </div>
                ${categoriesHtml}
            </div>
            <div class="post-body">
                ${post.content}
            </div>
            <div class="post-footer">
                <a href="${post.url}" target="_blank" class="post-original-link">
                    View on blog.romangarms.com
                </a>
            </div>
        `;

        this.modalContent.innerHTML = html;
        this.modal.style.display = 'flex';
        this.isOpen = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    close() {
        if (!this.modal) return;

        this.modal.style.display = 'none';
        this.isOpen = false;

        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// ============================================================================
// PORTFOLIO RENDERER
// ============================================================================
class PortfolioRenderer {
    constructor(containerId, modal) {
        this.container = document.getElementById(containerId);
        this.modal = modal;

        if (!this.container) {
            throw new Error(`Container element with id "${containerId}" not found`);
        }
    }

    /**
     * Extract the first image from post content
     */
    extractImageFromContent(content) {
        if (!content) return null;

        // Try to find img tag in content
        const imgMatch = content.match(/<img[^>]+src=["']([^"'>]+)["']/);
        if (imgMatch?.[1]) {
            return imgMatch[1];
        }

        return null;
    }

    /**
     * Extract a clean text excerpt from HTML content
     */
    extractExcerpt(content, maxLength = 250) {
        if (!content) return 'Click to read more about this project.';

        // Remove HTML tags
        const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

        if (text.length <= maxLength) {
            return text;
        }

        // Truncate and add ellipsis
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Create HTML for a single portfolio item
     */
    createPortfolioItem(post) {
        const title = post.title || 'Untitled Post';
        const content = post.content || '';

        // Extract image and excerpt
        const imageUrl = this.extractImageFromContent(content);
        const excerpt = this.extractExcerpt(content);

        // Format date
        const date = new Date(post.published);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });

        // Build categories HTML (limit to 4 tags for cards)
        let categoriesHtml = '';
        if (post.categories && post.categories.length > 0) {
            const displayCategories = post.categories.slice(0, 4);
            categoriesHtml = `
                <div class="post-categories-card">
                    ${displayCategories.map(cat => `<span class="post-category-card">${cat}</span>`).join('')}
                </div>
            `;
        }

        return `
            <div class="portfolio-card" data-post-id="${post.url}">
                <div class="box">
                    ${imageUrl ? `<img src="${imageUrl}" class="preview-image" alt="${title}">` : ''}
                    <h4>${title}</h4>
                    <p class="post-excerpt">${excerpt}</p>
                    ${categoriesHtml}
                    <p class="post-date-preview">${formattedDate}</p>
                </div>
            </div>
        `;
    }

    /**
     * Render all posts to the portfolio container
     */
    renderPosts(posts) {
        if (!posts || posts.length === 0) {
            this.showError('No blog posts found.');
            return;
        }

        // Sort posts by published date (newest first)
        const sortedPosts = posts.sort((a, b) => {
            const dateA = new Date(a.published);
            const dateB = new Date(b.published);
            return dateB - dateA;
        });

        // Generate HTML for all posts
        const html = sortedPosts.map(post => this.createPortfolioItem(post)).join('');

        // Update container
        this.container.innerHTML = html;

        // Add click handlers to open modal
        this.attachCardClickHandlers(sortedPosts);
    }

    /**
     * Attach click handlers to portfolio cards
     */
    attachCardClickHandlers(posts) {
        const cards = this.container.querySelectorAll('.portfolio-card');

        cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.modal && posts[index]) {
                    this.modal.open(posts[index]);
                }
            });

            // Make cards keyboard accessible
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Read post: ${posts[index].title}`);

            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (this.modal && posts[index]) {
                        this.modal.open(posts[index]);
                    }
                }
            });
        });
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p style="margin-top: 20px;">Loading blog posts...</p>
            </div>
        `;
    }

    /**
     * Show error state
     */
    showError(message) {
        this.container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <h3 style="color: #dc3545;">Error Loading Posts</h3>
                <p>${message}</p>
                <p style="margin-top: 20px;">
                    <small>Please check the browser console for more details.</small>
                </p>
            </div>
        `;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the portfolio when DOM is ready
 */
async function initializePortfolio() {
    // Initialize modal
    const modal = new PostModal();
    modal.init();

    // Initialize renderer
    const renderer = new PortfolioRenderer('portfolio-container', modal);

    // Show loading state
    renderer.showLoading();

    try {
        // Fetch posts
        const client = new BloggerRSSClient(BLOGGER_CONFIG);
        const posts = await client.fetchPosts();

        // Render posts
        renderer.renderPosts(posts);

    } catch (error) {
        console.error('Failed to initialize portfolio:', error);
        renderer.showError(error.message);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    // DOM is already ready
    initializePortfolio();
}

// Export for manual refresh if needed
window.refreshPortfolio = initializePortfolio;
