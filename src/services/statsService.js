/**
 * Stats Service - Firebase Realtime Database Integration
 *
 * Handles view tracking and statistics querying for portfolio posts.
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get } from 'firebase/database';

// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================
// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase (only if config is available)
let app = null;
let database = null;

try {
  if (firebaseConfig.databaseURL) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
}

// ============================================================================
// TIME PERIOD HELPERS
// ============================================================================
export const TIME_PERIODS = {
  NOW: 'now',       // Last 15 minutes
  DAY: 'day',       // Last 24 hours
  WEEK: 'week',     // Last 7 days
  MONTH: 'month',   // Last 30 days
  ALL: 'all'        // All time
};

/**
 * Get timestamp for start of time period
 */
export function getTimePeriodStart(period) {
  const now = Date.now();
  switch (period) {
    case TIME_PERIODS.NOW:
      return now - (15 * 60 * 1000); // 15 minutes ago
    case TIME_PERIODS.DAY:
      return now - (24 * 60 * 60 * 1000); // 24 hours ago
    case TIME_PERIODS.WEEK:
      return now - (7 * 24 * 60 * 60 * 1000); // 7 days ago
    case TIME_PERIODS.MONTH:
      return now - (30 * 24 * 60 * 60 * 1000); // 30 days ago
    case TIME_PERIODS.ALL:
    default:
      return 0;
  }
}

// ============================================================================
// VIEW TRACKING
// ============================================================================

/**
 * Track a page view for a portfolio post
 * @param {string} postSlug - URL slug of the viewed post
 */
export async function trackView(postSlug) {
  if (!database) {
    console.warn('Firebase not initialized - view not tracked');
    return;
  }

  try {
    const viewData = {
      postSlug,
      timestamp: Date.now(),
      referrer: document.referrer || 'direct'
    };

    const viewsRef = ref(database, 'views');
    await push(viewsRef, viewData);
  } catch (error) {
    // Fail silently - don't break the page if tracking fails
    console.error('Failed to track view:', error);
  }
}

// ============================================================================
// STATS QUERIES
// ============================================================================

/**
 * Fetch all views within a time period
 * @param {string} period - Time period from TIME_PERIODS
 * @returns {Promise<Array>} Array of view objects
 */
export async function fetchViews(period = TIME_PERIODS.ALL) {
  if (!database) {
    console.warn('Firebase not initialized');
    return [];
  }

  try {
    const viewsRef = ref(database, 'views');
    const snapshot = await get(viewsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const views = [];
    snapshot.forEach((child) => {
      views.push({
        id: child.key,
        ...child.val()
      });
    });

    // Filter by time period client-side
    if (period !== TIME_PERIODS.ALL) {
      const startTimestamp = getTimePeriodStart(period);
      return views.filter(view => view.timestamp >= startTimestamp);
    }

    return views;
  } catch (error) {
    console.error('Failed to fetch views:', error);
    return [];
  }
}

/**
 * Fetch views for a specific post
 * @param {string} postSlug - URL slug of the post
 * @param {string} period - Time period from TIME_PERIODS
 * @returns {Promise<Array>} Array of view objects for the post
 */
export async function fetchPostViews(postSlug, period = TIME_PERIODS.ALL) {
  const allViews = await fetchViews(period);
  return allViews.filter(view => view.postSlug === postSlug);
}

// ============================================================================
// AGGREGATION HELPERS
// ============================================================================

/**
 * Aggregate views by post slug
 * @param {Array} views - Array of view objects
 * @returns {Object} Object mapping postSlug to view count
 */
export function aggregateViewsByPost(views) {
  return views.reduce((acc, view) => {
    acc[view.postSlug] = (acc[view.postSlug] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Aggregate views by referrer
 * @param {Array} views - Array of view objects
 * @returns {Object} Object mapping referrer to view count
 */
export function aggregateViewsByReferrer(views) {
  return views.reduce((acc, view) => {
    const referrer = normalizeReferrer(view.referrer);
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Normalize referrer URL to a readable domain
 * @param {string} referrer - Raw referrer string
 * @returns {string} Normalized referrer name
 */
function normalizeReferrer(referrer) {
  if (!referrer || referrer === 'direct') {
    return 'Direct';
  }

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace(/^www\./, '');

    // Map common domains to friendly names
    if (hostname.includes('google')) return 'Google';
    if (hostname.includes('bing')) return 'Bing';
    if (hostname.includes('duckduckgo')) return 'DuckDuckGo';
    if (hostname.includes('linkedin')) return 'LinkedIn';
    if (hostname.includes('twitter') || hostname.includes('x.com')) return 'Twitter/X';
    if (hostname.includes('facebook')) return 'Facebook';
    if (hostname.includes('reddit')) return 'Reddit';
    if (hostname.includes('github')) return 'GitHub';

    return hostname;
  } catch {
    return referrer;
  }
}

/**
 * Aggregate views by time for charting
 * @param {Array} views - Array of view objects
 * @param {string} period - Time period for determining bucket size
 * @returns {Array} Array of { date, views } objects
 */
export function aggregateViewsByTime(views, period = TIME_PERIODS.WEEK) {
  if (views.length === 0) {
    return [];
  }

  // Determine bucket size based on period
  let bucketMs;
  let dateFormat;
  let bucketCount;

  switch (period) {
    case TIME_PERIODS.NOW:
      bucketMs = 60 * 1000; // 1 minute buckets
      bucketCount = 15;
      dateFormat = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      break;
    case TIME_PERIODS.DAY:
      bucketMs = 60 * 60 * 1000; // 1 hour buckets
      bucketCount = 24;
      dateFormat = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      break;
    case TIME_PERIODS.WEEK:
      bucketMs = 24 * 60 * 60 * 1000; // 1 day buckets
      bucketCount = 7;
      dateFormat = (date) => date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      break;
    case TIME_PERIODS.MONTH:
      bucketMs = 24 * 60 * 60 * 1000; // 1 day buckets
      bucketCount = 30;
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      break;
    case TIME_PERIODS.ALL:
    default:
      // For all time, use weekly buckets if we have lots of data
      bucketMs = 7 * 24 * 60 * 60 * 1000;
      bucketCount = 12; // ~3 months of weekly data
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      break;
  }

  // Initialize buckets going back from now
  const now = Date.now();
  const buckets = [];
  for (let i = bucketCount - 1; i >= 0; i--) {
    const bucketStart = now - (i * bucketMs);
    buckets.push({
      startTime: bucketStart,
      date: dateFormat(new Date(bucketStart)),
      views: 0
    });
  }

  // Assign views to buckets
  views.forEach(view => {
    const bucketIndex = Math.floor((now - view.timestamp) / bucketMs);
    const reversedIndex = bucketCount - 1 - bucketIndex;
    if (reversedIndex >= 0 && reversedIndex < bucketCount) {
      buckets[reversedIndex].views++;
    }
  });

  return buckets.map(({ date, views }) => ({ date, views }));
}

/**
 * Get top posts sorted by view count
 * @param {Array} views - Array of view objects
 * @param {number} limit - Maximum number of posts to return
 * @returns {Array} Array of { postSlug, views } sorted by views descending
 */
export function getTopPosts(views, limit = 10) {
  const postViews = aggregateViewsByPost(views);
  return Object.entries(postViews)
    .map(([postSlug, viewCount]) => ({ postSlug, views: viewCount }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/**
 * Get referrer breakdown sorted by count
 * @param {Array} views - Array of view objects
 * @returns {Array} Array of { referrer, views } sorted by views descending
 */
export function getReferrerBreakdown(views) {
  const referrerViews = aggregateViewsByReferrer(views);
  return Object.entries(referrerViews)
    .map(([referrer, viewCount]) => ({ referrer, views: viewCount }))
    .sort((a, b) => b.views - a.views);
}
