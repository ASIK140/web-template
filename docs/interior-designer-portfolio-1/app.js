// DOM Elements
const header = document.getElementById('header');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__link');
const portfolioGrid = document.getElementById('portfolio-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupScrollEffects();
    setupMobileMenu();
    setupSmoothScrolling();
    setupPortfolioFilters();
    setupLightbox();
    setupContactForm();
    setupImageLoading();
    updateActiveNavLink();
    // Ensure portfolio items are visible on load
    showAllPortfolioItems();
}

// Ensure portfolio items are visible on page load
function showAllPortfolioItems() {
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.classList.remove('hidden');
    });
}

// Scroll Effects
function setupScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        
        // Header scroll effect
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Mobile Menu
function setupMobileMenu() {
    if (!mobileMenuToggle || !nav) return;
    
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = nav.classList.contains('open');
        
        if (isOpen) {
            nav.classList.remove('open');
            mobileMenuToggle.classList.remove('open');
            document.body.style.overflow = '';
        } else {
            nav.classList.add('open');
            mobileMenuToggle.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('open');
            mobileMenuToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('open') && 
            !nav.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            nav.classList.remove('open');
            mobileMenuToggle.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + header.offsetHeight + 50;
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = section.getAttribute('id');
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
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
            // Show the item
            item.classList.remove('hidden');
            item.style.display = 'block';
            
            // Add staggered animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, index * 100);
        } else {
            // Hide the item
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                item.style.display = 'none';
                item.classList.add('hidden');
            }, 300);
        }
    });
}

// Lightbox
function setupLightbox() {
    // Setup view project buttons
    const viewButtons = document.querySelectorAll('.portfolio-item__view');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const image = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            
            openLightbox(image, title, description);
        });
    });
    
    // Also allow clicking on portfolio items themselves
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('portfolio-item__view')) return;
            
            const viewBtn = this.querySelector('.portfolio-item__view');
            if (viewBtn) {
                const image = viewBtn.getAttribute('data-image');
                const title = viewBtn.getAttribute('data-title');
                const description = viewBtn.getAttribute('data-description');
                
                openLightbox(image, title, description);
            }
        });
    });
    
    // Close lightbox events
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });
}

function openLightbox(imageSrc, title, description) {
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription) return;
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    
    lightbox.classList.remove('hidden');
    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    
    lightbox.classList.remove('show');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        if (lightboxImage) lightboxImage.src = '';
    }, 300);
    
    // Restore body scrolling
    document.body.style.overflow = '';
}

// Contact Form
function setupContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors and success messages
        clearFormErrors();
        
        // Validate form
        const isValid = validateContactForm();
        
        if (isValid) {
            // Simulate form submission
            simulateFormSubmission();
        }
    });
}

function validateContactForm() {
    let isValid = true;
    
    // Name validation
    const nameField = document.getElementById('name');
    const name = nameField ? nameField.value.trim() : '';
    if (!name) {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    const emailField = document.getElementById('email');
    const email = emailField ? emailField.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Message validation
    const messageField = document.getElementById('message');
    const message = messageField ? messageField.value.trim() : '';
    if (!message) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Add error styling to field
    const field = document.getElementById(fieldName);
    if (field) {
        field.style.borderColor = 'var(--color-error)';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
    
    // Clear success message
    if (formSuccess) {
        formSuccess.classList.remove('show');
    }
    
    // Reset field styling
    const fields = ['name', 'email', 'message'];
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.style.borderColor = '';
        }
    });
}

function simulateFormSubmission() {
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        if (formSuccess) {
            formSuccess.classList.add('show');
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

// Image Loading
function setupImageLoading() {
    const images = document.querySelectorAll('img');
    
    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load the image
                if (img.src) {
                    img.addEventListener('load', function() {
                        this.classList.add('loaded');
                    });
                    
                    // If image is already loaded (cached)
                    if (img.complete) {
                        img.classList.add('loaded');
                    }
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-triggered animations
function addScrollAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Add animation to service cards, testimonials, etc.
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(element);
    });
}

// Initialize scroll animations after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addScrollAnimations, 500);
});

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        if (nav) nav.classList.remove('open');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('open');
        document.body.style.overflow = '';
    }
}, 250));

// Performance optimization: Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Add keyboard navigation support for accessibility
document.addEventListener('keydown', function(e) {
    // Handle Enter key on portfolio items
    if (e.key === 'Enter' && e.target.classList.contains('portfolio-item__view')) {
        e.target.click();
    }
    
    // Handle keyboard navigation in lightbox
    if (lightbox && lightbox.classList.contains('show')) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            // Could implement next/previous functionality here
            e.preventDefault();
        }
    }
});

// Add focus management for better accessibility
function manageFocus() {
    // Trap focus in mobile menu when open
    if (nav) {
        nav.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && nav.classList.contains('open')) {
                const focusableElements = nav.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // Trap focus in lightbox when open
    if (lightbox) {
        lightbox.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && lightbox.classList.contains('show')) {
                const focusableElements = lightbox.querySelectorAll('button');
                if (focusableElements.length > 0) {
                    e.preventDefault();
                    focusableElements[0].focus();
                }
            }
        });
    }
}

// Initialize focus management
document.addEventListener('DOMContentLoaded', manageFocus);

// Fix social media links - make them functional
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        // Ensure the links have proper href attributes and target="_blank"
        if (!link.getAttribute('href') || link.getAttribute('href').startsWith('#')) {
            // Set proper URLs based on the text content
            const text = link.textContent.toLowerCase();
            if (text.includes('instagram')) {
                link.href = 'https://instagram.com/alexmorgan.design';
            } else if (text.includes('pinterest')) {
                link.href = 'https://pinterest.com/alexmorgandesign';
            } else if (text.includes('linkedin')) {
                link.href = 'https://linkedin.com/in/alex-morgan-interior-design';
            }
            
            // Ensure they open in new tab
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// Add a subtle loading animation for the page
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in effect to main sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});