// Main JavaScript for portfolio site

// Configuration
const config = {
    contentPath: 'content/',
    imagesPath: 'images/'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    loadGallery();
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
    // SEO-optimized alt text with keywords
    img.alt = `${item.title} - Mathematical art visualization of ${item.equation || 'polynomial equations'} in the complex plane`;
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
