# PRD: Portfolio View Stats Tracking

## Overview

Add view statistics tracking for blog posts displayed on the portfolio page. Since posts are fetched via Blogger RSS feeds, native Blogger analytics are lost. This feature replicates Blogger's stats functionality with a custom tracking system and dashboard.

## Problem Statement

The portfolio page displays blog posts from Blogger via RSS feed integration. This means:
- No access to Blogger's built-in view statistics
- No visibility into which posts are popular
- No way to identify traffic spikes or referral sources

## Solution

Implement client-side view tracking using Firebase Realtime Database, with a stats dashboard accessible at `/stats`.

## Technical Architecture

### Storage: Firebase Realtime Database
- **Why Firebase**: Free tier (1GB storage, 10GB/month transfer), reliable, easy setup, good dashboard
- **Data model**: Store individual view events for detailed analytics

### Data Captured Per View
| Field | Type | Description |
|-------|------|-------------|
| `postSlug` | string | URL slug of the viewed post |
| `timestamp` | number | Unix timestamp (ms) of the view |
| `referrer` | string | `document.referrer` value (traffic source) |

### Database Structure
```
views/
  {auto-generated-id}/
    postSlug: "my-project-post"
    timestamp: 1704307200000
    referrer: "https://google.com"
```

## Pages & Routes

### Stats Overview: `/stats`
Dashboard showing aggregate statistics across all posts.

**Components:**
- **Time period selector**: Now, Day, Week, Month, All time
- **Total views counter**: For selected time period
- **Line chart**: Views over time (default: last 7 days)
- **Top posts table**: Ranked by view count for selected period
- **Referrer breakdown**: List of traffic sources with counts

### Post Stats: `/stats/:slug`
Detailed statistics for a single post.

**Components:**
- **Post title & link** to the actual post
- **Time period selector**: Now, Day, Week, Month, All time
- **Total views counter**: For this post in selected period
- **Line chart**: Views over time for this post
- **Referrer breakdown**: Traffic sources for this post

## User Interface

### Design
- Match existing site design (header, footer, navigation, typography)
- Consistent styling with other pages
- Responsive layout for mobile/desktop

### Chart Library
Use a lightweight charting library compatible with React (e.g., Recharts or Chart.js with react-chartjs-2).

## Implementation Details

### View Tracking
- Track views on the `PortfolioPost.jsx` page
- Fire tracking event on page load (component mount)
- Handle errors gracefully (don't break the page if Firebase is unavailable)

### Firebase Setup
- Create Firebase project
- Add Firebase config to environment/config file
- Initialize Firebase in the app
- Create a `statsService.js` for all Firebase operations

### Stats Page Data Fetching
- Query Firebase for views within selected time range
- Aggregate data client-side for charts and tables
- Consider caching/memoization for performance

## Security Considerations

- **No authentication required**: Stats page is unlisted but publicly accessible
- **Write protection**: Firebase rules should allow writes from the app domain only
- **No sensitive data**: Only tracking page views, no PII

### Firebase Security Rules
```json
{
  "rules": {
    "views": {
      ".read": true,
      ".write": true
    }
  }
}
```
*Note: For production, consider restricting writes to your domain using Firebase App Check.*

## Success Metrics

- Successfully track all portfolio post views
- Stats page loads and displays data correctly
- Line charts accurately show traffic patterns
- Referrer data captures traffic sources

## Out of Scope

- User authentication/login
- Real-time live updating (polling/refresh is acceptable)
- Historical data import from Blogger
- Email alerts for traffic spikes
- Geographic data / IP tracking

## Dependencies

- Firebase account (free tier)
- Charting library (to be selected during implementation)

## File Changes Summary

### New Files
- `src/services/statsService.js` - Firebase operations for tracking & querying
- `src/pages/Stats.jsx` - Overview dashboard page
- `src/pages/PostStats.jsx` - Per-post stats page
- `src/components/StatsChart.jsx` - Reusable line chart component
- `src/components/ReferrerList.jsx` - Referrer breakdown component
- `src/components/TopPostsTable.jsx` - Top posts ranking component
- `src/components/TimePeriodSelector.jsx` - Time range selector component

### Modified Files
- `src/App.jsx` - Add routes for `/stats` and `/stats/:slug`
- `src/pages/PortfolioPost.jsx` - Add view tracking on page load
- `package.json` - Add Firebase and charting library dependencies
