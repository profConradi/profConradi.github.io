# Simone Conradi – Portfolio website

A sophisticated, editorial-style portfolio showcasing mathematical art and physics/mathematics simulations. Built with clean HTML, CSS, and JavaScript using Markdown for easy content updates.

## Features

- **Sophisticated editorial design** – Organic, hand-crafted aesthetic with academic touches
- **Markdown-based content** – Easy updates without touching code
- **Responsive layout** – Works seamlessly on all devices
- **Smooth animations** – Subtle interactions enhance the experience
- **Static site** – No build process, works perfectly on GitHub Pages

## Project structure

```
portfolio-site/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # JavaScript for content loading
├── content/            # Markdown content files
│   ├── about.md
│   ├── art-intro.md
│   ├── simulations-intro.md
│   ├── contact.md
│   ├── gallery.json
│   └── simulations.json
├── images/             # Your artwork images
│   └── *.jpeg
└── README.md
```

## Deploying to GitHub Pages

### Step 1: Create a GitHub repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** button in the top right and select "New repository"
3. Name it: `simone-conradi-portfolio` (or any name you prefer)
4. Make it **Public**
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Upload your site

**Option A: Using GitHub's web interface (easiest)**

1. In your new repository, click "uploading an existing file"
2. Drag and drop ALL files and folders from your `portfolio-site` directory
3. Scroll down and click "Commit changes"

**Option B: Using Git command line**

```bash
cd /path/to/portfolio-site

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: portfolio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/simone-conradi-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, click **Settings**
2. In the left sidebar, click **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 1-2 minutes, then refresh the page
6. You'll see: "Your site is live at `https://YOUR-USERNAME.github.io/simone-conradi-portfolio/`"

### Step 4: Custom domain (optional)

If you want to use a custom domain like `simoneconradi.com`:

1. Buy a domain from a registrar (Namecheap, Google Domains, etc.)
2. In your DNS settings, add a CNAME record:
   - Type: `CNAME`
   - Name: `www` (or `@` for apex domain)
   - Value: `YOUR-USERNAME.github.io`
3. In GitHub Pages settings, enter your custom domain
4. Enable "Enforce HTTPS"

## Updating content

### Editing text content

All text is in Markdown files in the `content/` directory. Edit these files directly on GitHub or locally:

**About section:** `content/about.md`
```markdown
Your bio and background here...
```

**Math art intro:** `content/art-intro.md`

**Simulations intro:** `content/simulations-intro.md`

**Contact:** `content/contact.md`
- Don't forget to replace `your-email@example.com` with your actual email!

### Adding artwork

1. Add new artwork to `content/gallery.json`:

```json
{
  "title": "Your artwork title",
  "image": "your-image-filename.jpg",
  "equation": "Mathematical equation (optional)",
  "description": "Description of the piece"
}
```

2. Upload the image to the `images/` directory
3. Commit and push changes

### Adding simulations

Edit `content/simulations.json`:

```json
{
  "title": "Simulation name",
  "description": "What it does",
  "url": "https://link-to-simulation.com"
}
```

### Adding more images

1. Place images in the `images/` directory
2. Reference them in JSON files using just the filename
3. Commit and push

## Updating the site

### Via GitHub web interface (easiest)

1. Navigate to the file you want to edit
2. Click the pencil icon (Edit this file)
3. Make your changes
4. Scroll down, add commit message
5. Click "Commit changes"
6. Changes go live in 1-2 minutes

### Via Git command line

```bash
# Make your changes to files

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new artwork piece"

# Push to GitHub
git push

# Changes go live in 1-2 minutes
```

## Customizing the design

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --color-bg: #fafaf8;           /* Background */
    --color-text: #1a1a1a;         /* Main text */
    --color-accent: #2d4a5e;       /* Links, highlights */
    --color-highlight: #d4a574;    /* Hover states */
}
```

### Typography

Change fonts by modifying:

```css
:root {
    --font-serif: 'Your Font', serif;
    --font-sans: 'Your Font', sans-serif;
}
```

To use custom fonts, add to `<head>` in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

### Spacing

Adjust spacing scale:

```css
:root {
    --space-unit: 1rem;
}
```

## Browser compatibility

- Modern browsers: Full support
- Safari 12+: Full support
- Firefox 60+: Full support
- Chrome 60+: Full support
- Edge 79+: Full support

## File size optimization

### Optimizing images

Before uploading images, optimize them:

```bash
# Using ImageMagick
convert input.jpg -quality 85 -resize 1200x1200\> output.jpg

# Or use online tools:
# - TinyJPG.com
# - Squoosh.app
```

Target sizes:
- Gallery images: 1200px × 1200px, ~200KB
- Hero/featured: 1920px wide, ~300KB

## Troubleshooting

### Site not showing after deployment
- Wait 2-3 minutes after pushing
- Check GitHub Pages settings are correct
- Make sure repository is public

### Images not loading
- Check image filenames match exactly (case-sensitive)
- Ensure images are in the `images/` directory
- Check file extensions are correct (.jpg vs .jpeg)

### Content not updating
- Clear browser cache (Ctrl/Cmd + Shift + R)
- Check file was actually uploaded to GitHub
- Verify JSON syntax is valid (use JSONLint.com)

### Markdown not rendering
- Ensure the marked.js CDN link is working
- Check browser console for errors (F12)

## Support

For issues or questions:
- GitHub Issues: Create an issue in your repository
- Email: your-email@example.com

## License

© 2025 Simone Conradi. All rights reserved.
