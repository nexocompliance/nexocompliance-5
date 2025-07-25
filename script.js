// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerLines = document.querySelectorAll('.hamburger-line');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger to X
    hamburgerLines.forEach((line, index) => {
        if (mobileMenu.classList.contains('active')) {
            if (index === 0) {
                line.style.transform = 'rotate(45deg) translate(5px, 5px)';
            } else if (index === 1) {
                line.style.opacity = '0';
            } else {
                line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            }
        } else {
            line.style.transform = 'none';
            line.style.opacity = '1';
        }
    });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Close mobile menu if open
    mobileMenu.classList.remove('active');
    hamburgerLines.forEach(line => {
        line.style.transform = 'none';
        line.style.opacity = '1';
    });
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = ['inicio', 'servicios', 'nosotros', 'equipo', 'contacto'];
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    let currentSection = 'inicio';
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= navHeight + 100 && rect.bottom >= navHeight + 100) {
                currentSection = sectionId;
            }
        }
    });
    
    // Update desktop nav links
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (section === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update mobile nav links
    mobileNavLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (section === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Add click event listeners to navigation links
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        scrollToSection(sectionId);
    });
});

// Contact form handling with enhanced validation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form elements
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"]');
    const companyInput = contactForm.querySelectorAll('input[type="text"]')[1];
    const phoneInput = contactForm.querySelector('input[type="tel"]');
    const typeSelect = contactForm.querySelector('select');
    const messageTextarea = contactForm.querySelector('textarea');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Get form data
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        company: companyInput.value.trim(),
        phone: phoneInput.value.trim(),
        type: typeSelect.value,
        message: messageTextarea.value.trim()
    };
    
    // Enhanced validation
    const errors = [];
    
    if (!formData.name) {
        errors.push('El nombre es obligatorio');
        nameInput.style.borderColor = '#ef4444';
    } else {
        nameInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    if (!formData.email) {
        errors.push('El email es obligatorio');
        emailInput.style.borderColor = '#ef4444';
    } else if (!isValidEmail(formData.email)) {
        errors.push('Por favor ingrese un email válido');
        emailInput.style.borderColor = '#ef4444';
    } else {
        emailInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    if (!formData.message) {
        errors.push('El mensaje es obligatorio');
        messageTextarea.style.borderColor = '#ef4444';
    } else {
        messageTextarea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success
        showNotification('¡Gracias por su consulta! Nos pondremos en contacto con usted pronto.', 'success');
        contactForm.reset();
        
        // Reset form styles
        [nameInput, emailInput, messageTextarea].forEach(input => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
        
    } catch (error) {
        showNotification('Hubo un error al enviar su consulta. Por favor intente nuevamente.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 24px;
                max-width: 400px;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease-out;
                backdrop-filter: blur(20px);
            }
            
            .notification-success {
                background: rgba(16, 185, 129, 0.95);
                color: white;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .notification-error {
                background: rgba(239, 68, 68, 0.95);
                color: white;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }
            
            .notification-info {
                background: rgba(59, 130, 246, 0.95);
                color: white;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.2s;
                margin-left: auto;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Scroll event listener for active nav highlighting and navbar background
let ticking = false;
function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNavLink();
            updateNavbarBackground();
            ticking = false;
        });
        ticking = true;
    }
}

// Navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
}

window.addEventListener('scroll', onScroll);

// Initialize active nav link on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavLink();
    updateNavbarBackground();
});

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for grid items
            if (entry.target.classList.contains('service-card') || 
                entry.target.classList.contains('team-card') ||
                entry.target.classList.contains('feature-card')) {
                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.service-card, .team-card, .testimonial-card, .feature-card, .contact-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Smooth reveal animations for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionVisible = 150;
        
        if (sectionTop < window.innerHeight - sectionVisible) {
            section.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealSections);
document.addEventListener('DOMContentLoaded', revealSections);

// Add CSS for section reveals
const style = document.createElement('style');
style.textContent = `
    section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    #inicio {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Testimonials slider functionality (simple version)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        if (i === index) {
            testimonial.classList.add('active');
            testimonial.style.display = 'block';
        } else {
            testimonial.classList.remove('active');
            testimonial.style.display = 'none';
        }
    });
}

// Auto-rotate testimonials
if (testimonials.length > 1) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Initialize first testimonial
if (testimonials.length > 0) {
    showTestimonial(0);
}

// Enhanced form interactions
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    const heroFloatingCards = document.querySelectorAll('.hero-floating-card');
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    heroFloatingCards.forEach((card, index) => {
        const speed = 0.05 + (index * 0.02);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Service card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('featured')) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburgerLines.forEach(line => {
            line.style.transform = 'none';
            line.style.opacity = '1';
        });
    }
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedRevealSections = debounce(revealSections, 10);
window.addEventListener('scroll', debouncedRevealSections);

// Preload critical images
document.addEventListener('DOMContentLoaded', () => {
    const criticalImages = [
        'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Add loading states for better UX
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add CSS for loading states
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        body:not(.loaded) .hero-image,
        body:not(.loaded) .about-image,
        body:not(.loaded) .team-image {
            opacity: 0;
            transition: opacity 0.5s ease-out;
        }
        
        body.loaded .hero-image,
        body.loaded .about-image,
        body.loaded .team-image {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyles);
});