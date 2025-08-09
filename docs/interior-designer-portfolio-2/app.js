// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const sidebarLinks = document.querySelectorAll('.sidebar__link');
const scrollToTopBtn = document.getElementById('scrollToTop');
const heroBackground = document.querySelector('.hero__background');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const testimonialsSlider = document.getElementById('testimonialsSlider');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const sliderDots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const servicesContainer = document.getElementById('servicesContainer');

// Global Variables
let currentSlide = 0;
let sliderInterval;
let isSliderPaused = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupSidebar();
    setupSmoothScrolling();
    setupScrollEffects();
    setupParallaxEffect();
    setupPortfolioFilters();
    setupPortfolioAnimations();
    setupTestimonialsSlider();
    setupContactForm();
    setupImageLazyLoading();
    setupScrollToTop();
    startPortfolioStaggerAnimation();
    
    // Add fade-in animation to sections
    animateSectionsOnLoad();
}

// Sidebar Navigation
function setupSidebar() {
    // Toggle sidebar on mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    // Close sidebar when clicking overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeSidebar);
    }
    
    // Handle sidebar link clicks
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close sidebar on mobile after clicking
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
                
                // Smooth scroll to section
                smoothScrollTo(targetSection);
            }
        });
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            sidebar && sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            closeSidebar();
        }
    });
}

function toggleSidebar() {
    if (sidebar && mobileOverlay) {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

function openSidebar() {
    sidebar.classList.add('open');
    mobileOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Smooth Scrolling
function setupSmoothScrolling() {
    // Handle all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
            }
        });
    });
}

function smoothScrollTo(target) {
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Scroll Effects
function setupScrollEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
    
    function updateScrollEffects() {
        updateActiveNavLink();
        updateScrollToTopButton();
        ticking = false;
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.pageYOffset + window.innerHeight / 3;
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = section.getAttribute('id');
        }
    });
    
    // Update sidebar links
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// Parallax Effect
function setupParallaxEffect() {
    window.addEventListener('scroll', function() {
        if (heroBackground) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
    });
}

// Portfolio Filters
function setupPortfolioFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(filter);
        });
    });
}

function filterPortfolioItems(filter) {
    portfolioItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            // Show the item with staggered animation
            item.classList.remove('hidden');
            item.style.display = 'block';
            
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 100);
        } else {
            // Hide the item
            item.classList.remove('animate-in');
            
            setTimeout(() => {
                item.style.display = 'none';
                item.classList.add('hidden');
            }, 300);
        }
    });
}

// Portfolio Animations
function setupPortfolioAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    portfolioItems.forEach(item => {
        observer.observe(item);
    });
}

function startPortfolioStaggerAnimation() {
    setTimeout(() => {
        portfolioItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 150);
        });
    }, 500);
}

// Testimonials Slider
function setupTestimonialsSlider() {
    if (!testimonialSlides.length) return;
    
    // Initialize slider
    showSlide(0);
    
    // Auto-play functionality
    startSliderAutoplay();
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            previousSlide();
            resetSliderAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSliderAutoplay();
        });
    }
    
    // Dots navigation
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSliderAutoplay();
        });
    });
    
    // Pause on hover
    if (testimonialsSlider) {
        testimonialsSlider.addEventListener('mouseenter', pauseSliderAutoplay);
        testimonialsSlider.addEventListener('mouseleave', resumeSliderAutoplay);
    }
    
    // Touch/swipe support for mobile
    setupSliderTouchEvents();
}

function showSlide(index) {
    // Hide all slides
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    sliderDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide
    if (testimonialSlides[index]) {
        testimonialSlides[index].classList.add('active');
        currentSlide = index;
    }
    
    // Update dots
    if (sliderDots[index]) {
        sliderDots[index].classList.add('active');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
    showSlide(currentSlide);
}

function startSliderAutoplay() {
    sliderInterval = setInterval(nextSlide, 5000);
}

function pauseSliderAutoplay() {
    if (sliderInterval) {
        clearInterval(sliderInterval);
        isSliderPaused = true;
    }
}

function resumeSliderAutoplay() {
    if (isSliderPaused) {
        startSliderAutoplay();
        isSliderPaused = false;
    }
}

function resetSliderAutoplay() {
    pauseSliderAutoplay();
    setTimeout(() => {
        if (!isSliderPaused) {
            startSliderAutoplay();
        }
    }, 1000);
}

function setupSliderTouchEvents() {
    if (!testimonialsSlider) return;
    
    let startX = 0;
    let startY = 0;
    
    testimonialsSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    testimonialsSlider.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
            resetSliderAutoplay();
        }
    });
}

// Contact Form
function setupContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        const isValid = validateContactForm();
        
        if (isValid) {
            submitContactForm();
        }
    });
    
    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            const fieldName = this.name || this.id;
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement && errorElement.classList.contains('show')) {
                errorElement.classList.remove('show');
                this.style.borderColor = '';
            }
        });
    });
}

function validateContactForm() {
    let isValid = true;
    
    // Name validation
    const nameField = document.getElementById('name');
    if (!validateField(nameField)) {
        isValid = false;
    }
    
    // Email validation
    const emailField = document.getElementById('email');
    if (!validateField(emailField)) {
        isValid = false;
    }
    
    // Message validation
    const messageField = document.getElementById('message');
    if (!validateField(messageField)) {
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    if (!field) return true;
    
    const fieldName = field.name || field.id;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(fieldName, errorMessage);
        field.style.borderColor = '#ff6b6b';
    } else {
        hideFieldError(fieldName);
        field.style.borderColor = '';
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
    });
    
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.style.borderColor = '';
    });
    
    if (formSuccess) {
        formSuccess.classList.remove('show');
    }
}

function submitContactForm() {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    const originalContent = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
        
        // Show success message
        if (formSuccess) {
            formSuccess.classList.add('show');
            
            // Scroll to success message
            formSuccess.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        // Clear form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            if (formSuccess) {
                formSuccess.classList.remove('show');
            }
        }, 5000);
        
    }, 2000);
}

// Image Lazy Loading
function setupImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    
                    if (img.complete) {
                        img.style.opacity = '1';
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s';
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.style.opacity = '1';
        });
    }
}

// Scroll to Top Button - Fixed Implementation
function setupScrollToTop() {
    if (!scrollToTopBtn) return;
    
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function updateScrollToTopButton() {
    if (!scrollToTopBtn) return;
    
    if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}

// Section Animations
function animateSectionsOnLoad() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    sections.forEach((section, index) => {
        // Skip hero section
        if (section.id === 'home') return;
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        sectionObserver.observe(section);
    });
}

// Services Horizontal Scroll
function setupServicesScroll() {
    if (!servicesContainer) return;
    
    // Add mouse wheel horizontal scrolling
    servicesContainer.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY;
        }
    });
    
    // Add touch scrolling for mobile
    let isDown = false;
    let startX;
    let scrollLeft;
    
    servicesContainer.addEventListener('mousedown', function(e) {
        isDown = true;
        startX = e.pageX - this.offsetLeft;
        scrollLeft = this.scrollLeft;
        this.style.cursor = 'grabbing';
    });
    
    servicesContainer.addEventListener('mouseleave', function() {
        isDown = false;
        this.style.cursor = 'grab';
    });
    
    servicesContainer.addEventListener('mouseup', function() {
        isDown = false;
        this.style.cursor = 'grab';
    });
    
    servicesContainer.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - this.offsetLeft;
        const walk = (x - startX) * 2;
        this.scrollLeft = scrollLeft - walk;
    });
}

// Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes sidebar on mobile
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
        
        // Arrow keys for testimonials slider
        if (e.key === 'ArrowLeft') {
            previousSlide();
            resetSliderAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetSliderAutoplay();
        }
    });
}

// Window Resize Handler
function handleWindowResize() {
    window.addEventListener('resize', debounce(function() {
        // Close sidebar on desktop resize
        if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    }, 250));
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    setupServicesScroll();
    setupKeyboardNavigation();
    handleWindowResize();
    
    // Add loading class to body and remove after everything is loaded
    document.body.classList.add('loading');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 500);
    });
});

// Performance optimization
function preloadCriticalImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920',
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161f50110?w=800'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
document.addEventListener('DOMContentLoaded', preloadCriticalImages);

// Add focus trap for better accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });
}

// Apply focus trap to sidebar when it's open
if (sidebar) {
    sidebar.addEventListener('transitionend', function() {
        if (this.classList.contains('open')) {
            trapFocus(this);
            // Focus first link for keyboard users
            const firstLink = this.querySelector('.sidebar__link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    });
}