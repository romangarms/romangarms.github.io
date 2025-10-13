/**
 * Blogger RSS Feed Integration
 *
 * Fetches blog posts from Blogger RSS feed using CORS proxies.
 * RSS feeds are public and require no API key.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const BLOGGER_CONFIG = {
    // Your Blogger RSS feed URL
    rssUrl: 'https://blog.romangarms.com/feeds/posts/default',

    // Maximum number of posts to fetch
    maxResults: 50,

    // Cache duration in milliseconds (30 minutes)
    cacheDuration: 30 * 60 * 1000
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
     * Get fetch URLs to try (uses CORS proxies with fallbacks)
     */
    getFetchUrls() {
        const encodedUrl = encodeURIComponent(this.config.rssUrl);
        return [
            `https://corsproxy.io/?${encodedUrl}`,
            this.config.rssUrl
        ];
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

        const urls = this.getFetchUrls();
        let lastError = null;

        // Try each URL in order until one works
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];

            try {
                if (i > 0) {
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
                console.warn(`Failed to fetch from proxy ${i + 1}:`, error.message);

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

// Export for use in React components
export { BloggerRSSClient, BLOGGER_CONFIG };
