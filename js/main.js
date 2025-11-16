// Main JavaScript for portfolio site

// Configuration
const config = {
    contentPath: 'content/',
    imagesPath: 'images/'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    loadArticles();
    loadGallery();
    loadSimulations();
    initSmoothScroll();
});

// Load markdown content for sections
async function loadContent() {
    try {
        // Load about section
        const aboutResponse = await fetch(`${config.contentPath}about.md`);
        if (aboutResponse.ok) {
            const aboutText = await aboutResponse.text();
            const aboutHtml = marked.parse(aboutText);
            document.getElementById('about-content').innerHTML = aboutHtml;
        }

        // Load art intro
        const artIntroResponse = await fetch(`${config.contentPath}art-intro.md`);
        if (artIntroResponse.ok) {
            const artIntroText = await artIntroResponse.text();
            const artIntroHtml = marked.parse(artIntroText);
            document.getElementById('art-intro').innerHTML = artIntroHtml;
        }

        // Load simulations intro
        const simsIntroResponse = await fetch(`${config.contentPath}simulations-intro.md`);
        if (simsIntroResponse.ok) {
            const simsIntroText = await simsIntroResponse.text();
            const simsIntroHtml = marked.parse(simsIntroText);
            document.getElementById('simulations-intro').innerHTML = simsIntroHtml;
        }

        // Load contact
        const contactResponse = await fetch(`${config.contentPath}contact.md`);
        if (contactResponse.ok) {
            const contactText = await contactResponse.text();
            const contactHtml = marked.parse(contactText);
            document.getElementById('contact-content').innerHTML = contactHtml;
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Load articles
async function loadArticles() {
    try {
        const response = await fetch(`${config.contentPath}articles.json`);
        if (!response.ok) return;

        const articles = await response.json();
        const articlesContainer = document.getElementById('articles-grid');

        articles.items.forEach(item => {
            const articleCard = createArticleCard(item);
            articlesContainer.appendChild(articleCard);
        });
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

// Create article card element
function createArticleCard(item) {
    const article = document.createElement('article');
    article.className = 'article-card';

    const header = document.createElement('div');
    header.className = 'article-header';

    const date = document.createElement('time');
    date.className = 'article-date';
    date.textContent = formatDate(item.date);
    date.setAttribute('datetime', item.date);

    const tags = document.createElement('div');
    tags.className = 'article-tags';
    if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'article-tag';
            tagSpan.textContent = tag;
            tags.appendChild(tagSpan);
        });
    }

    header.appendChild(date);
    if (item.readTime) {
        const readTime = document.createElement('span');
        readTime.className = 'article-read-time';
        readTime.textContent = ` · ${item.readTime}`;
        header.appendChild(readTime);
    }

    const title = document.createElement('h3');
    title.className = 'article-title';
    title.textContent = item.title;

    const summary = document.createElement('p');
    summary.className = 'article-summary';
    summary.textContent = item.summary;

    const link = document.createElement('a');
    link.href = `article.html?id=${item.slug}`;
    link.className = 'article-link';
    link.textContent = 'Read article →';

    article.appendChild(header);
    article.appendChild(tags);
    article.appendChild(title);
    article.appendChild(summary);
    article.appendChild(link);

    return article;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Load gallery items
async function loadGallery() {
    try {
        const response = await fetch(`${config.contentPath}gallery.json`);
        if (!response.ok) return;
        
        const gallery = await response.json();
        const galleryContainer = document.getElementById('math-art-gallery');
        
        gallery.items.forEach(item => {
            const galleryItem = createGalleryItem(item);
            galleryContainer.appendChild(galleryItem);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Create gallery item element
function createGalleryItem(item) {
    const article = document.createElement('article');
    article.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = `${config.imagesPath}${item.image}`;
    img.alt = item.title;
    img.className = 'gallery-image';
    
    const info = document.createElement('div');
    info.className = 'gallery-info';
    
    const title = document.createElement('h3');
    title.className = 'gallery-title';
    title.textContent = item.title;
    
    const equation = document.createElement('div');
    equation.className = 'gallery-equation';
    equation.textContent = item.equation || '';
    
    const description = document.createElement('p');
    description.className = 'gallery-description';
    description.textContent = item.description;
    
    info.appendChild(title);
    if (item.equation) info.appendChild(equation);
    info.appendChild(description);
    
    article.appendChild(img);
    article.appendChild(info);
    
    return article;
}

// Load simulations
async function loadSimulations() {
    try {
        const response = await fetch(`${config.contentPath}simulations.json`);
        if (!response.ok) return;
        
        const simulations = await response.json();
        const simsContainer = document.getElementById('simulations-grid');
        
        simulations.items.forEach(item => {
            const simItem = createSimulationItem(item);
            simsContainer.appendChild(simItem);
        });
    } catch (error) {
        console.error('Error loading simulations:', error);
    }
}

// Create simulation item element
function createSimulationItem(item) {
    const article = document.createElement('article');
    article.className = 'simulation-item';
    
    const title = document.createElement('h3');
    title.className = 'simulation-title';
    title.textContent = item.title;
    
    const description = document.createElement('p');
    description.className = 'simulation-description';
    description.textContent = item.description;
    
    if (item.url) {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'simulation-link';
        link.textContent = 'View simulation';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        article.appendChild(title);
        article.appendChild(description);
        article.appendChild(link);
    } else {
        article.appendChild(title);
        article.appendChild(description);
    }
    
    return article;
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
