# Roman Garms - Portfolio Website

A modern, responsive portfolio website built with React and Vite, deployed on GitHub Pages.

## Features

- **Single Page Application (SPA)** - Smooth navigation without page reloads
- **Dynamic Blog Integration** - Fetches posts from Blogger RSS feed
- **Responsive Design** - Works on desktop and mobile
- **Interactive Projects** - Portfolio cards with modal overlays
- **Photo Showcase** - 360-degree spherical photos from drone
- **About Me** - Personal information and skills
- **Animated Favicon** - Rotating favicon animation
- **Clean URLs** - Uses BrowserRouter for clean, SEO-friendly URLs

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Bootstrap** - UI framework
- **GitHub Pages** - Hosting
- **gh-pages** - Deployment automation

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

The Vite dev server includes:
- **Hot Module Replacement (HMR)** - Instant updates without full page reload
- **CORS Proxy** - Proxies Blogger RSS feed requests to avoid CORS errors
- **Fast refresh** - Preserves component state during edits

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

## Project Structure

```
romangarms-website/
├── public/               # Static assets
│   ├── css/             # Global CSS files
│   ├── images/          # Images and icons
│   ├── favicons/        # Favicon animation frames
│   ├── SNES-StarFox/    # Unity WebGL game
│   ├── UltimateTicTacToe/ # Unity WebGL game
│   ├── .nojekyll        # Tells GitHub Pages not to use Jekyll
│   └── 404.html         # SPA redirect handler
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Navbar.jsx   # Navigation bar
│   │   ├── Footer.jsx   # Footer with social links
│   │   └── Modal.jsx    # Blog post modal
│   ├── pages/           # Page components
│   │   ├── Portfolio.jsx     # Main portfolio page
│   │   ├── PhotoShowcase.jsx # 360 photo gallery
│   │   ├── AboutMe.jsx       # About me page
│   │   └── NotFound.jsx      # 404 page
│   ├── services/        # API and service modules
│   │   └── bloggerAPI.js     # Blogger RSS feed client
│   ├── utils/           # Utility functions
│   │   └── useFaviconAnimation.js # Favicon animation hook
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global app styles
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

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

### Favicon Animation

The favicon cycles through 4 frames every 500ms, creating a rotating animation effect. This is implemented as a React hook (`useFaviconAnimation`) that runs on mount.

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

## License

All rights reserved © Roman Garms

## Contact

- **Website**: [romangarms.com](https://romangarms.com)
- **GitHub**: [@romangarms](https://github.com/romangarms)
- **LinkedIn**: [roman-garms](https://www.linkedin.com/in/roman-garms/)
- **Instagram**: [@romanogarmez](https://www.instagram.com/romanogarmez/)
