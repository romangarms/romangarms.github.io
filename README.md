# Roman Garms - Portfolio Website

my website

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/romangarms/romangarms-website.git
cd romangarms-website

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

### Building for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

The build outputs to the `/dist` directory.

### Deployment

Deploy to GitHub Pages with a single command:

```bash
# Build and deploy to gh-pages branch
npm run deploy
```

This will:
1. Build the React app (`npm run build`)
2. Deploy the `/dist` folder to the `gh-pages` branch
3. Your site will be live at https://romangarms.com

## How It Works

### SPA on GitHub Pages

GitHub Pages doesn't natively support client-side routing. This project uses a workaround:

1. **404.html** - When a user visits a direct URL (e.g., `/about`), GitHub Pages serves 404.html
2. **Redirect Script** - 404.html contains a script that converts the path to a query parameter
3. **index.html** - Reads the query parameter and uses `history.replaceState()` to restore the URL
4. **React Router** - Takes over and renders the correct page

This allows clean URLs like `/portfolio`, `/photos`, and `/about` to work correctly.

### CORS-Free RSS Feed

The Blogger RSS feed is fetched differently in development vs production:

- **Development**: Vite dev server proxies requests from `/api/blogger` to the actual RSS feed
- **Production**: Fetches directly from the RSS feed (CORS is allowed from your domain)

This eliminates the need for third-party CORS proxies.

## Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint

## Configuration

### Vite Config

`vite.config.js` contains:
- **Base URL**: Set to `./` for relative paths (works with custom domain)
- **Build Output**: Outputs to `/dist` with assets in `/assets`
- **Dev Server Proxy**: Proxies `/api/blogger` to Blogger RSS feed

### GitHub Pages Setup

1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Custom domain: `romangarms.com` (configured in CNAME file)