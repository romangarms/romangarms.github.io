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

    // Cache duration in milliseconds (2 hours)
    cacheDuration: 2 * 60 * 60 * 1000
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
     * Get fetch URLs to try for the main posts feed
     */
    getFetchUrls() {
        return this.getFetchUrlsFor(this.config.rssUrl);
    }

    /**
     * Get fetch URLs to try for an arbitrary Blogger feed URL
     * (uses self-hosted Cloudflare Worker proxy, with direct URL fallback)
     */
    getFetchUrlsFor(targetUrl) {
        const encodedUrl = encodeURIComponent(targetUrl);
        return [
            // Self-hosted Cloudflare Worker (primary and most reliable)
            `https://cors-header-proxy.romangarms.workers.dev/corsproxy/?apiurl=${encodedUrl}`,
            // Direct URL as fallback (will fail in browser due to CORS)
            targetUrl
        ];
    }

    /**
     * Fetch a feed URL through the proxy chain, returning raw XML text.
     * Tries each proxy in order until one succeeds.
     */
    async fetchWithProxy(targetUrl, timeoutMs = 5000) {
        const urls = this.getFetchUrlsFor(targetUrl);
        let lastError = null;

        for (let i = 0; i < urls.length; i++) {
            try {
                return await this.attemptFetch(urls[i], timeoutMs);
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('All fetch attempts failed');
    }

    /**
     * Attempt to fetch from a single URL with timeout
     */
    async attemptFetch(url, timeoutMs = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/xml, text/xml, application/atom+xml'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.text();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeoutMs}ms`);
            }
            throw error;
        }
    }

    /**
     * Fetches blog posts from RSS feed with caching and fallback proxies
     */
    async fetchPosts() {
        // Check fresh cache first
        const cachedData = this.getCachedPosts();
        if (cachedData) {
            return cachedData;
        }

        // Try to get stale cache as fallback
        const staleCache = this.getStaleCachedPosts();

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

        // All URLs failed - use stale cache if available
        console.error('All fetch attempts failed');
        if (staleCache) {
            console.warn('Using stale cached data as fallback');
            return staleCache;
        }

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
        // Get unique post id (e.g. tag:blogger.com,1999:blog-XXX.post-YYY)
        const idEl = entry.querySelector('id');
        const id = idEl ? idEl.textContent : null;

        // Get title
        const titleEl = entry.querySelector('title');
        const title = titleEl ? titleEl.textContent : 'Untitled Post';

        // Get published date
        const publishedEl = entry.querySelector('published');
        const published = publishedEl ? publishedEl.textContent : new Date().toISOString();

        // Get content
        const contentEl = entry.querySelector('content');
        const content = contentEl ? contentEl.textContent : '';

        // Get post URL (alternate link) and comments feed URL (replies link)
        let url = '#';
        let commentsUrl = null;
        const links = entry.querySelectorAll('link');
        for (const link of links) {
            const rel = link.getAttribute('rel');
            const type = link.getAttribute('type');
            if (rel === 'alternate' && type === 'text/html') {
                url = link.getAttribute('href');
            } else if (rel === 'replies' && type === 'application/atom+xml') {
                commentsUrl = link.getAttribute('href');
            }
        }

        // Get comment count from thr:total (namespaced element)
        const totalEls = entry.getElementsByTagName('thr:total');
        const commentCount = totalEls.length
            ? parseInt(totalEls[0].textContent, 10) || 0
            : 0;

        // Get categories/labels
        const categories = [];
        const categoryEls = entry.querySelectorAll('category');
        categoryEls.forEach(cat => {
            const term = cat.getAttribute('term');
            if (term) {
                categories.push(term);
            }
        });

        // Get author (name + profile URI)
        const authorEl = entry.querySelector('author name');
        const author = authorEl ? authorEl.textContent : 'Roman Garms';
        const authorUriEl = entry.querySelector('author uri');
        const authorUri = authorUriEl ? authorUriEl.textContent : null;

        return {
            id,
            title,
            published,
            content,
            url,
            categories,
            author,
            authorUri,
            commentsUrl,
            commentCount
        };
    }

    /**
     * Fetch and parse the comments feed for a single post.
     * Returns { comments, total }. Comments are sorted oldest-first.
     */
    async fetchComments(commentsUrl) {
        if (!commentsUrl) {
            return { comments: [], total: 0 };
        }

        // Short session cache (comments change more often than posts)
        const cacheKey = `blogger_comments_${commentsUrl}`;
        const cacheTsKey = `${cacheKey}_ts`;
        const commentsCacheDuration = 15 * 60 * 1000; // 15 minutes

        try {
            const cached = sessionStorage.getItem(cacheKey);
            const cachedTs = sessionStorage.getItem(cacheTsKey);
            if (cached && cachedTs &&
                Date.now() - parseInt(cachedTs, 10) < commentsCacheDuration) {
                return JSON.parse(cached);
            }
        } catch (error) {
            console.warn('Error reading comments cache:', error);
        }

        const xmlText = await this.fetchWithProxy(commentsUrl);
        const result = this.parseCommentsFeed(xmlText);

        try {
            sessionStorage.setItem(cacheKey, JSON.stringify(result));
            sessionStorage.setItem(cacheTsKey, Date.now().toString());
        } catch (error) {
            console.warn('Error caching comments:', error);
        }

        return result;
    }

    /**
     * Parse a Blogger comments Atom feed into { comments, total }
     */
    parseCommentsFeed(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Failed to parse comments feed XML');
        }

        const totalEls = xmlDoc.getElementsByTagName('openSearch:totalResults');
        const total = totalEls.length ? parseInt(totalEls[0].textContent, 10) || 0 : 0;

        const entries = xmlDoc.querySelectorAll('entry');
        const comments = [];

        entries.forEach(entry => {
            try {
                const comment = this.parseCommentEntry(entry);
                if (comment) {
                    comments.push(comment);
                }
            } catch (error) {
                console.warn('Failed to parse comment entry:', error);
            }
        });

        // Oldest first, so replies read naturally top-to-bottom
        comments.sort((a, b) => new Date(a.published) - new Date(b.published));

        return { comments, total: total || comments.length };
    }

    /**
     * Parse a single comment Atom entry into a comment object
     */
    parseCommentEntry(entry) {
        const idEl = entry.querySelector('id');
        const publishedEl = entry.querySelector('published');
        const published = publishedEl ? publishedEl.textContent : new Date().toISOString();
        const id = idEl ? idEl.textContent : `comment-${published}`;

        const contentEl = entry.querySelector('content');
        const content = contentEl ? contentEl.textContent : '';

        const authorNameEl = entry.querySelector('author name');
        const author = authorNameEl ? authorNameEl.textContent : 'Anonymous';

        const authorUriEl = entry.querySelector('author uri');
        const authorUri = authorUriEl ? authorUriEl.textContent : null;

        // Author avatar lives in a namespaced gd:image element
        let authorImage = null;
        const authorEl = entry.querySelector('author');
        if (authorEl) {
            const imgs = authorEl.getElementsByTagName('gd:image');
            if (imgs.length) {
                authorImage = imgs[0].getAttribute('src');
            }
        }

        return { id, published, content, author, authorUri, authorImage };
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
     * Get cached posts even if expired (for fallback)
     */
    getStaleCachedPosts() {
        try {
            const cachedPosts = sessionStorage.getItem(this.cacheKey);
            if (!cachedPosts) {
                return null;
            }
            return JSON.parse(cachedPosts);
        } catch (error) {
            console.error('Error reading stale cache:', error);
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
