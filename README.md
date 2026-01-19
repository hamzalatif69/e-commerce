# NovaLearn — Premium Course Platform (PWA)

A production-ready, dark-themed e-commerce platform for selling online courses, built as a Progressive Web App (PWA) with offline capabilities.

## Features

- **Modern Dark UI**: Premium, professional design with smooth animations
- **PWA Ready**: Installable app with offline support
- **Course Catalog**: Browse, filter, and search courses
- **Course Details**: Rich course pages with outcomes and metadata
- **Enrollment System**: Add courses to cart and checkout
- **Responsive**: Mobile, tablet, and desktop optimized
- **GitHub Pages Compatible**: All relative paths, static hosting ready

## Pages

- **Home**: Hero section, featured courses, benefits
- **Courses**: Grid view with search and category filters
- **Course Details**: Individual course pages with full information
- **About**: Platform information and mission
- **Contact**: Contact form with local storage

## PWA Features

- Service Worker with offline caching
- App manifest for installability
- Install button appears when app is installable
- Works offline after installation
- Proper theme colors and icons

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **Vanilla JavaScript**: No frameworks, pure JS
- **Service Worker**: Offline capabilities
- **LocalStorage**: Cart and contact persistence

## Installation & Setup

1. Clone or download this repository
2. Generate icons using `generate-icons.html`:
   - Open `generate-icons.html` in your browser
   - Click "Generate & Download All Icons"
   - Save the downloaded PNG files to the `/icons/` folder
3. Deploy to GitHub Pages or any static host

## File Structure

```
/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # Application logic
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline service worker
├── icons/              # PWA icons (32x32, 192x192, 512x512)
│   ├── favicon-32.png
│   ├── icon-192.png
│   └── icon-512.png
├── generate-icons.html # Icon generator tool
├── generate-icons.js   # Icon generator script
└── README.md           # This file
```

## Deployment

### GitHub Pages

1. Push the repository to GitHub
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `gh-pages`)
4. The site will be available at `https://username.github.io/repository-name`

### Other Static Hosts

The site works on any static hosting service that serves files over HTTPS (required for PWA features).

## PWA Verification

After deployment, verify PWA features:

1. Open Chrome DevTools
2. Go to Application tab
3. Check Manifest is loaded correctly
4. Verify Service Worker is active
5. Test offline functionality in Network tab
6. Check "Add to home screen" prompt appears

## Browser Support

- Chrome/Edge (full PWA support)
- Firefox (basic PWA support)
- Safari (limited PWA support)
- Works as regular website in all browsers

## Development

The site uses client-side routing with hash-based URLs. All functionality is contained in the three main files:

- `index.html` - Structure and layout
- `style.css` - Styling and animations  
- `script.js` - Application logic and routing

## License

This project is provided as-is for educational and commercial use.
