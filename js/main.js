document.addEventListener('DOMContentLoaded', () => {
    // Component Loader — uses DOMParser instead of innerHTML so SVG paths parse correctly
    async function loadComponent(elementId, filePath) {
        try {
            const response = await fetch(filePath + '?v=' + new Date().getTime());
            if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
            let html = await response.text();
            // Strip Live Server injected scripts before parsing
            html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/g, '');

            // Use DOMParser so SVG elements (path, circle, etc.) parse with correct namespace
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const target = document.getElementById(elementId);
            if (!target) return; // Ignore if placeholder doesn't exist on page
            target.innerHTML = '';
            
            // Move all parsed child nodes into the target element
            Array.from(doc.body.childNodes).forEach(node => {
                target.appendChild(document.adoptNode(node));
            });

            // Specific logic for dynamic components like subpage-hero
            if (elementId === 'subpage-hero-placeholder' || elementId === 'subpage-hero-simple-placeholder') {
                const title = target.getAttribute('data-title');
                const subtitle = target.getAttribute('data-subtitle');
                const breadcrumb = target.getAttribute('data-breadcrumb');
                
                if (title) {
                    const titleEl = target.querySelector('#subpage-hero-title');
                    if (titleEl) titleEl.textContent = title;
                }
                if (subtitle) {
                    const subtitleEl = target.querySelector('#subpage-hero-en');
                    if (subtitleEl) subtitleEl.textContent = subtitle;
                }
                if (breadcrumb) {
                    const breadcrumbEl = target.querySelector('#subpage-breadcrumb-current');
                    if (breadcrumbEl) breadcrumbEl.textContent = breadcrumb;
                }
                const image = target.getAttribute('data-image');
                if (image) {
                    const imageEl = target.querySelector('#subpage-hero-image');
                    if (imageEl) imageEl.style.backgroundImage = `url('${image}')`;
                }
            }

        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    // Load Header and Footer, then initialize scripts
    Promise.all([
        loadComponent('header-placeholder', 'components/header.html'),
        loadComponent('footer-placeholder', 'components/footer.html'),
        loadComponent('subpage-hero-placeholder', 'components/subpage-hero.html'),
        loadComponent('subpage-hero-simple-placeholder', 'components/subpage-hero-simple.html')
    ]).then(() => {
        initMobileMenu();
        initHeroSlider();
        initScrollToTop();
        initFAQ();
        initCVSlider();
    });

    // FAQ Accordion Logic
    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.closest('.faq-item');
                // Close other open FAQs if desired (optional, here we allow multiple open)
                item.classList.toggle('active');
            });
        });
    }

    // Hero Slider Logic
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slider .slide');
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Crossfades every 5 seconds
    }

    // Mobile Menu Toggle Logic
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const desktopNav = document.querySelector('.desktop-nav');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                document.body.classList.toggle('menu-open', !isExpanded);
            });
        }
    }

    // Scroll to Top behavior
    function initScrollToTop() {
        const scrollTopBtn = document.getElementById('footer-action-scroll');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Customer Voice Slider Logic
    function initCVSlider() {
        const grid = document.querySelector('.cv-grid');
        const prevBtn = document.querySelector('.cv-arrow.prev');
        const nextBtn = document.querySelector('.cv-arrow.next');
        const cards = document.querySelectorAll('.cv-card');
        
        if (!grid || !prevBtn || !nextBtn || cards.length === 0) return;

        nextBtn.addEventListener('click', () => {
            // Get the width of one card plus its margin/gap
            const cardStyle = window.getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight) || parseInt(window.getComputedStyle(grid).gap) || 30;
            
            grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const cardStyle = window.getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight) || parseInt(window.getComputedStyle(grid).gap) || 30;
            
            grid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }
});
