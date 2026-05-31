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
        initVoiceRelatedSlider();
        initStaffMobilePagination();
        initStaffModal();
        initVoiceFilter();
        initRecruitGallery();
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
            if (grid.isAnimating) return;
            grid.isAnimating = true;

            const firstCard = grid.firstElementChild;
            const gap = parseInt(window.getComputedStyle(grid).gap) || 0;
            const cardWidth = firstCard.offsetWidth + gap;

            grid.style.transition = 'transform 0.5s ease';
            grid.style.transform = `translateX(-${cardWidth}px)`;

            grid.addEventListener('transitionend', function() {
                grid.style.transition = 'none';
                grid.style.transform = 'translateX(0)';
                grid.appendChild(firstCard);
                grid.isAnimating = false;
            }, { once: true });
        });

        prevBtn.addEventListener('click', () => {
            if (grid.isAnimating) return;
            grid.isAnimating = true;

            const lastCard = grid.lastElementChild;
            const gap = parseInt(window.getComputedStyle(grid).gap) || 0;
            const cardWidth = lastCard.offsetWidth + gap;

            grid.style.transition = 'none';
            grid.insertBefore(lastCard, grid.firstElementChild);
            grid.style.transform = `translateX(-${cardWidth}px)`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    grid.style.transition = 'transform 0.5s ease';
                    grid.style.transform = 'translateX(0)';
                    
                    grid.addEventListener('transitionend', function() {
                        grid.isAnimating = false;
                    }, { once: true });
                });
            });
        });

        window.addEventListener('resize', () => {
            // No action needed on resize for transform resetting now
        });
    }

    // Voice Detail Related Slider Logic
    function initVoiceRelatedSlider() {
        const grid = document.querySelector('.voice-related-slider .voice-grid');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const cards = document.querySelectorAll('.voice-related-slider .voice-card');
        
        if (!grid || !prevBtn || !nextBtn || cards.length === 0) return;

        nextBtn.addEventListener('click', () => {
            if (grid.isAnimating) return;
            grid.isAnimating = true;

            const firstCard = grid.firstElementChild;
            const gap = parseInt(window.getComputedStyle(grid).gap) || 0;
            const cardWidth = firstCard.offsetWidth + gap;

            grid.style.transition = 'transform 0.5s ease';
            grid.style.transform = `translateX(-${cardWidth}px)`;

            grid.addEventListener('transitionend', function() {
                grid.style.transition = 'none';
                grid.style.transform = 'translateX(0)';
                grid.appendChild(firstCard);
                grid.isAnimating = false;
            }, { once: true });
        });

        prevBtn.addEventListener('click', () => {
            if (grid.isAnimating) return;
            grid.isAnimating = true;

            const lastCard = grid.lastElementChild;
            const gap = parseInt(window.getComputedStyle(grid).gap) || 0;
            const cardWidth = lastCard.offsetWidth + gap;

            grid.style.transition = 'none';
            grid.insertBefore(lastCard, grid.firstElementChild);
            grid.style.transform = `translateX(-${cardWidth}px)`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    grid.style.transition = 'transform 0.5s ease';
                    grid.style.transform = 'translateX(0)';
                    
                    grid.addEventListener('transitionend', function() {
                        grid.isAnimating = false;
                    }, { once: true });
                });
            });
        });

        window.addEventListener('resize', () => {
            // No action needed on resize for transform resetting now
        });
    }

    // Staff Page Mobile Pagination Logic
    function initStaffMobilePagination() {
        const staffGrid = document.querySelector('.staff-grid');
        const paginationBlock = document.querySelector('.mobile-only-pagination');
        if (!staffGrid || !paginationBlock) return;

        const cards = Array.from(staffGrid.querySelectorAll('.staff-card'));
        const pageLinks = paginationBlock.querySelectorAll('.page-link:not(.next)');
        const nextBtn = paginationBlock.querySelector('.page-link.next');
        
        const itemsPerPage = 10;
        let currentPage = 1;
        const totalPages = Math.ceil(cards.length / itemsPerPage);

        function updatePagination() {
            if (window.innerWidth > 768) {
                // Desktop: show all cards
                cards.forEach(card => card.classList.remove('hidden-by-pagination'));
                return;
            }

            // Mobile: handle pagination display
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            cards.forEach((card, index) => {
                if (index >= startIndex && index < endIndex) {
                    card.classList.remove('hidden-by-pagination');
                } else {
                    card.classList.add('hidden-by-pagination');
                }
            });

            // Update active state on pagination links
            pageLinks.forEach((link, index) => {
                if (index + 1 === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        // Add event listeners to page numbers
        pageLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = index + 1;
                updatePagination();
                // Scroll to top of grid smoothly so user sees the new cards
                const offset = staffGrid.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            });
        });

        // Add event listener to Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                    const offset = staffGrid.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            });
        }

        // Initial setup and window resize listener
        updatePagination();
        window.addEventListener('resize', updatePagination);
    }

    // Staff Page 3D Flip & Modal Logic
    function initStaffModal() {
        const staffGrid = document.querySelector('.staff-grid');
        const modal = document.getElementById('staff-modal');
        if (!staffGrid) return;
        
        let cards = Array.from(staffGrid.querySelectorAll('.staff-card'));
        if (cards.length === 0) return;

        const modalClose = document.getElementById('staff-modal-close');
        const modalName = document.getElementById('staff-modal-name');
        const modalDept = document.getElementById('staff-modal-dept');

        // Restructure cards for 3D flip
        cards.forEach(card => {
            // Check if already restructured to avoid double wrap
            if (card.querySelector('.staff-card-inner')) return;

            const nameEl = card.querySelector('.staff-name');
            const deptEl = card.querySelector('.staff-department');
            const nameStr = nameEl ? nameEl.textContent.trim() : '';
            const deptStr = deptEl ? deptEl.textContent.trim() : '';
            
            const hobbyEl = card.querySelector('.detail-hobby');
            const worryEl = card.querySelector('.detail-worry');
            const messageEl = card.querySelector('.detail-message');

            const hobbyStr = hobbyEl ? hobbyEl.innerHTML : '';
            const worryStr = worryEl ? worryEl.innerHTML : '';
            const messageStr = messageEl ? messageEl.innerHTML : '';

            let themeClass = 'theme-cyan';
            let leafColor = '#0ABAB5';
            if (deptEl) {
                if (deptEl.classList.contains('tag-blue')) {
                    themeClass = 'theme-blue';
                    leafColor = '#50BAF7';
                }
                if (deptEl.classList.contains('tag-orange')) {
                    themeClass = 'theme-orange';
                    leafColor = '#EF5407';
                }
            }

            const existingAccent = card.querySelector('.staff-card-accent');
            if (existingAccent) existingAccent.remove();

            const frontContent = card.innerHTML;
            card.innerHTML = ''; // clear original contents

            const inner = document.createElement('div');
            inner.className = 'staff-card-inner';

            const front = document.createElement('div');
            front.className = 'staff-card-front';
            front.innerHTML = frontContent;
            
            const accent = document.createElement('div');
            accent.className = 'staff-card-accent';
            accent.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 47 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.5 4.56153C23.105 12.9314 8.66667 17.7283 0 19.5616C24.5 16.5615 27.5 19.5616 45.5 11.0615C49.1451 9.34019 36.5001 13.0615 31 5.56153C28.4334 2.06163 26 -4.43844 24.5 4.56153Z" fill="${leafColor}"/>
</svg>`;
            front.appendChild(accent);

            const back = document.createElement('div');
            back.className = `staff-card-back ${themeClass}`;
            back.innerHTML = `
                <div class="staff-card-back-content">
                    <div class="staff-modal-section">
                        <span class="staff-modal-label">趣味</span>
                        <p class="staff-modal-text">${hobbyStr}</p>
                    </div>
                    <div class="staff-modal-section">
                        <span class="staff-modal-label">最近の悩み</span>
                        <p class="staff-modal-text">${worryStr}</p>
                    </div>
                    <div class="staff-modal-section">
                        <span class="staff-modal-label">メッセージ</span>
                        <p class="staff-modal-text">${messageStr}</p>
                    </div>
                </div>
                <div class="staff-card-back-footer">
                    <h4 class="staff-card-back-name">${nameStr}</h4>
                    <p class="staff-card-back-dept">${deptStr}</p>
                </div>
            `;

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);
            
            // Add pointer cursor
            card.style.cursor = 'pointer';

            card.addEventListener('click', () => {
                const updatedNameEl = card.querySelector('.staff-name');
                const updatedDeptEl = card.querySelector('.staff-department');

                if (window.innerWidth > 768) {
                    // Desktop: Flip the card
                    cards.forEach(c => {
                        if (c !== card) c.classList.remove('flipped');
                    });
                    card.classList.toggle('flipped');
                } else {
                    // Mobile: Open Modal
                    if (modal) {
                        if (updatedNameEl) modalName.textContent = updatedNameEl.textContent;
                        if (updatedDeptEl) modalDept.textContent = updatedDeptEl.textContent;

                        const modalHobby = modal.querySelector('.staff-modal-section:nth-child(1) .staff-modal-text');
                        const modalWorry = modal.querySelector('.staff-modal-section:nth-child(2) .staff-modal-text');
                        const modalMessage = modal.querySelector('.staff-modal-section:nth-child(3) .staff-modal-text');

                        if (modalHobby) modalHobby.innerHTML = hobbyStr;
                        if (modalWorry) modalWorry.innerHTML = worryStr;
                        if (modalMessage) modalMessage.innerHTML = messageStr;

                        modal.classList.remove('theme-cyan', 'theme-blue', 'theme-orange');
                        modal.classList.add(themeClass);

                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        });

        // Close button logic
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close on background click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // Voice Page Filter & Pagination Logic
    function initVoiceFilter() {
        const tabs = document.querySelectorAll('.voice-section .voice-tab');
        const cards = Array.from(document.querySelectorAll('.voice-section .voice-card'));
        const paginationContainer = document.querySelector('.voice-section .pagination');
        
        if (tabs.length === 0 || cards.length === 0) return;

        const itemsPerPage = 9;
        let currentPage = 1;
        let currentFilter = 'すべて';

        function renderCards() {
            // Filter cards based on current tag
            const filteredCards = cards.filter(card => {
                if (currentFilter === 'すべて') return true;
                const tags = Array.from(card.querySelectorAll('.voice-card-tag')).map(t => t.textContent.trim());
                return tags.includes(currentFilter);
            });

            // Hide all cards first
            cards.forEach(card => card.style.display = 'none');

            // Calculate pagination
            const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
            
            // Ensure currentPage is valid after filtering
            if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

            // Show cards for the current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            filteredCards.slice(startIndex, endIndex).forEach(card => {
                card.style.display = '';
            });

            if (paginationContainer) {
                renderPagination(totalPages);
            }
        }

        function renderPagination(totalPages) {
            paginationContainer.innerHTML = '';
            
            if (totalPages <= 1) return; // Hide pagination if only 1 page

            for (let i = 1; i <= totalPages; i++) {
                const link = document.createElement(i === currentPage ? 'span' : 'a');
                link.className = 'page-link' + (i === currentPage ? ' active' : '');
                if (i !== currentPage) link.href = '#';
                link.textContent = i;
                
                if (i !== currentPage) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        currentPage = i;
                        renderCards();
                        scrollToTop();
                    });
                }
                paginationContainer.appendChild(link);
            }

            // Add Next button if not on last page
            if (currentPage < totalPages) {
                const nextBtn = document.createElement('a');
                nextBtn.href = '#';
                nextBtn.className = 'page-link next';
                nextBtn.setAttribute('aria-label', 'Next');
                nextBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
                
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage++;
                    renderCards();
                    scrollToTop();
                });
                
                paginationContainer.appendChild(nextBtn);
            }
        }

        function scrollToTop() {
            const section = document.querySelector('.voice-section');
            if (section) {
                const offset = section.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab styling
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                currentFilter = tab.textContent.trim();
                currentPage = 1; // Reset to page 1 on filter change
                renderCards();
            });
        });

        // Initial render on load
        renderCards();
    }

    // Recruit Gallery Pause Logic
    function initRecruitGallery() {
        const grids = document.querySelectorAll('.recruit-gallery-grid');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.recruit-gallery-item img');
            if (items.length === 0) return;

            items.forEach(img => {
                img.style.cursor = 'pointer';
                
                // Pause on hover
                img.addEventListener('mouseenter', () => {
                    grid.classList.add('is-paused');
                });
                
                // Resume when mouse leaves the image
                img.addEventListener('mouseleave', () => {
                    grid.classList.remove('is-paused');
                });
            });
        });
    }
});
