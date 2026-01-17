/* =====================================================
   INDIAN WEDDING WEBSITE - JAVASCRIPT
   Animations, Interactivity & Dynamic Features
   ===================================================== */

// =====================================================
// DOM ELEMENTS
// =====================================================
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const rsvpForm = document.getElementById('rsvpForm');

// =====================================================
// NAVBAR FUNCTIONALITY
// =====================================================
// Scroll effect for navbar
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Close mobile menu when clicking a link
function closeMobileMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

// =====================================================
// COUNTDOWN TIMER
// =====================================================
function updateCountdown() {
    // Wedding Date: February 15, 2026
    const weddingDate = new Date('February 15, 2026 10:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    if (timeLeft < 0) {
        // Wedding has passed
        countdownElements.days.textContent = '00';
        countdownElements.hours.textContent = '00';
        countdownElements.minutes.textContent = '00';
        countdownElements.seconds.textContent = '00';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownElements.days.textContent = String(days).padStart(2, '0');
    countdownElements.hours.textContent = String(hours).padStart(2, '0');
    countdownElements.minutes.textContent = String(minutes).padStart(2, '0');
    countdownElements.seconds.textContent = String(seconds).padStart(2, '0');
}

// =====================================================
// SCROLL ANIMATIONS
// =====================================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// =====================================================
// SMOOTH SCROLLING
// =====================================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// =====================================================
// GALLERY LIGHTBOX
// =====================================================
let currentImageIndex = 0;
let galleryImages = [];

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryImages = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Close lightbox events
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', showPreviousImage);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

// =====================================================
// RSVP FORM
// =====================================================
function initRSVPForm() {
    if (!rsvpForm) return;

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(rsvpForm);
        const data = Object.fromEntries(formData.entries());

        // Validate form
        if (!data.name || !data.email || !data.attendance) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = rsvpForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Success response
            showNotification('Thank you! Your RSVP has been received. We look forward to celebrating with you!', 'success');
            rsvpForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        max-width: 400px;
        padding: 20px 25px;
        background: ${type === 'success' ? '#046307' : '#C41E3A'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Outfit', sans-serif;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// =====================================================
// PARALLAX EFFECTS
// =====================================================
function initParallaxEffects() {
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (hero) {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        }
    });
}

// =====================================================
// ACTIVE NAV LINK HIGHLIGHTING
// =====================================================
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function highlightNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
}

// =====================================================
// FLOATING ELEMENTS ANIMATION
// =====================================================
function initFloatingElements() {
    const paisley1 = document.querySelector('.paisley-1');
    const paisley2 = document.querySelector('.paisley-2');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (paisley1) {
            paisley1.style.transform = `rotate(-30deg) translateY(${scrollY * 0.1}px)`;
        }
        if (paisley2) {
            paisley2.style.transform = `rotate(30deg) translateY(${-scrollY * 0.08}px)`;
        }
    });
}

// =====================================================
// TYPING EFFECT FOR HERO
// =====================================================
function initTypingEffect() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';

    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            tagline.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing after a delay
    setTimeout(typeWriter, 1500);
}

// =====================================================
// IMAGE LAZY LOADING
// =====================================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// =====================================================
// PETAL RAIN ANIMATION
// =====================================================
function initPetalRain() {
    const container = document.createElement('div');
    container.className = 'petal-container';
    document.body.appendChild(container);

    const petalCount = 30; // Number of petals active at once

    for (let i = 0; i < petalCount; i++) {
        setTimeout(() => {
            createPetal(container);
        }, i * 300); // Stagger creation
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    // Randomize starting position and properties
    const startLeft = Math.random() * 100;
    const duration = 6 + Math.random() * 6; // 6-12s fall time
    const size = 10 + Math.random() * 15; // 10-25px size

    petal.style.left = `${startLeft}vw`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;

    // Random sway (custom property for future sophistication or just used via CSS if updated)
    // For now we rely on the @keyframes defined in css

    container.appendChild(petal);

    // Remove and recreate after animation ends to prevent memory leaks? 
    // Actually infinite loop is better in CSS, but for random positions we should reset.
    // Let's use 'animationiteration' or just timeout.

    setTimeout(() => {
        petal.remove();
        createPetal(container);
    }, duration * 1000);
}

// =====================================================
// TEXT REVEAL ANIMATION
// =====================================================
function initTextReveal() {
    const splitTypes = document.querySelectorAll('.hero-title span');

    splitTypes.forEach(char => {
        // Simple manual character split if needed, but current HTML is <span> based words
        // Let's animate the main words nicely
        char.style.opacity = '0';
        char.style.transform = 'translateY(30px)';
        char.style.transition = 'all 1s cubic-bezier(0.2, 1, 0.3, 1)';
        char.style.display = 'inline-block';
    });

    setTimeout(() => {
        const bride = document.querySelector('.bride-name');
        if (bride) {
            bride.style.opacity = '1';
            bride.style.transform = 'translateY(0)';
        }
    }, 500);

    setTimeout(() => {
        const amp = document.querySelector('.ampersand');
        if (amp) {
            amp.style.opacity = '1';
            amp.style.transform = 'translateY(0)';
        }
    }, 1000);

    setTimeout(() => {
        const groom = document.querySelector('.groom-name');
        if (groom) {
            groom.style.opacity = '1';
            groom.style.transform = 'translateY(0)';
        }
    }, 1500);
}

// =====================================================
// 3D TILT EFFECT
// =====================================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.invitation-card, .couple-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });

        card.style.transition = 'transform 0.1s ease';
    });
}

// =====================================================
// INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize features
    initScrollAnimations();
    initSmoothScrolling();
    initGalleryLightbox();
    initRSVPForm();
    // Initialize Mandala Tunnel
    initMandalaTunnel();

    // Initialize Rocket Timeline
    initRocketTimeline();
    initActiveNavHighlight();
    initFloatingElements();
    initLazyLoading();
    initPetalRain();
    initTextReveal();
    initTiltEffect();

    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Event listeners
    window.addEventListener('scroll', handleNavbarScroll);
    navToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu on nav link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
});

// =====================================================
// PRELOADER (OPTIONAL)
// =====================================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
    }
});

// =====================================================
// 3D MANDALA TUNNEL ANIMATION
// =====================================================
function initMandalaTunnel() {
    const tunnel = document.getElementById('mandala-tunnel');
    if (!tunnel) return;

    const rings = tunnel.querySelectorAll('.tunnel-ring');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        rings.forEach((ring, index) => {
            // Speed increases for inner rings (further back perceptually, but we want them to rotate faster)
            // Actually, usually closer things move faster in parallax.
            // Let's make the index 0 (smallest) move slowest, index 4 (largest) move fastest?
            // Or rotate them in alternating directions for hypnosis.

            const speed = (index + 1) * 0.05;
            const direction = index % 2 === 0 ? 1 : -1;
            const rotation = scrolled * speed * direction;

            // Standard loop opacity trigger? 
            // Let's just do rotation and scale.

            // Subtle zoom effect
            const scale = 1 + (scrolled * 0.0002 * (index + 1));

            ring.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
        });
    });
}

// =====================================================
// BACKGROUND MUSIC PLAYER (AUTOPLAY + TOGGLE)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const musicBtn = document.getElementById('music-btn');
    const music = document.getElementById('wedding-music');
    let isPlaying = false;

    if (music) {
        // Toggle Function
        const togglePlay = () => {
            if (isPlaying) {
                music.pause();
                if (musicBtn) {
                    musicBtn.textContent = '▶'; // Play symbol
                    musicBtn.classList.remove('playing');
                }
            } else {
                music.play().then(() => {
                    if (musicBtn) {
                        musicBtn.textContent = '⏸'; // Pause symbol
                        musicBtn.classList.add('playing');
                    }
                }).catch(e => console.error(e));
            }
            isPlaying = !isPlaying;
        };

        if (musicBtn) {
            musicBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay();
            });
        }

        // Attempt Autoplay
        music.play().then(() => {
            console.log("Autoplay successful");
            isPlaying = true;
            if (musicBtn) {
                musicBtn.textContent = '⏸';
                musicBtn.classList.add('playing');
            }
        }).catch(error => {
            console.log("Autoplay blocked");
            const startInteraction = () => {
                if (!isPlaying) {
                    music.play().then(() => {
                        isPlaying = true;
                        if (musicBtn) {
                            musicBtn.textContent = '⏸';
                            musicBtn.classList.add('playing');
                        }
                    });
                }
                document.removeEventListener('click', startInteraction);
                document.removeEventListener('touchstart', startInteraction);
            };
            document.addEventListener('click', startInteraction);
            document.addEventListener('touchstart', startInteraction);
        });
    }

    // Ensure animations run
    if (typeof initMandalaTunnel === 'function') initMandalaTunnel();
    if (typeof initRocketTimeline === 'function') initRocketTimeline();
});

function initRocketTimeline() {
    const container = document.querySelector('.timeline-container');
    const rocket = document.querySelector('#rocket');
    const line = document.querySelector('.timeline-line');
    const events = document.querySelectorAll('.timeline-event');

    if (!container || !rocket || !line) return;

    window.addEventListener('scroll', () => {
        const containerRect = container.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        const windowHeight = window.innerHeight;

        // Calculate progress (0 to 1)
        // Start moving when container hits middle of screen
        let progress = (windowHeight / 2 - containerTop) / (containerHeight - windowHeight / 2);

        // Clamp progress
        progress = Math.max(0, Math.min(1, progress));

        // Update Rocket Position
        const travelDistance = containerHeight - 150; // Leave some buffer
        const rocketTop = travelDistance * progress;

        rocket.style.top = `${rocketTop}px`;

        // Update Line Trail
        line.style.setProperty('--scroll-percent', `${rocketTop}px`);

        // Trigger Events based on Rocket Position
        events.forEach(event => {
            const eventTop = event.offsetTop;
            // When rocket reaches the event's top position (plus buffer)
            if (rocketTop > eventTop - 100) {
                event.classList.add('active');
            } else {
                event.classList.remove('active');
            }
        });
    });
}
