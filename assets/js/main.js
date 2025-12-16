// ============================================
// UNREVEALED UNIVERSE - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all effects
    initStarField();
    initScrollAnimations();
    initNavbarScroll();
    initParallax();
    initGalleryHover();
    createShootingStars();
});

// ============================================
// DYNAMIC STAR FIELD
// ============================================

function initStarField() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 200;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                alpha: Math.random(),
                delta: Math.random() * 0.02 + 0.005
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.alpha += star.delta;
            if (star.alpha > 1 || star.alpha < 0) {
                star.delta = -star.delta;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// ============================================
// SHOOTING STARS
// ============================================

function createShootingStars() {
    const container = document.querySelector('.shooting-stars');
    if (!container) return;

    function createStar() {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${50 + Math.random() * 100}px;
            height: 2px;
            background: linear-gradient(90deg, white, transparent);
            top: ${Math.random() * 50}%;
            left: -150px;
            transform: rotate(-45deg);
            animation: shootingStar ${2 + Math.random() * 3}s linear forwards;
            opacity: 0;
        `;
        container.appendChild(star);

        setTimeout(() => star.remove(), 5000);
    }

    // Create shooting stars periodically
    setInterval(createStar, 4000);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.topic-card, .gallery-item, .timeline-item, .reference-item, .team-member').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animation class handler
document.addEventListener('scroll', function() {
    document.querySelectorAll('.animate-in').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(139, 92, 246, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================

function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        hero.style.backgroundPositionY = rate + 'px';
    });
}

// ============================================
// GALLERY HOVER EFFECTS
// ============================================

function initGalleryHover() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// TYPING EFFECT FOR HERO (Optional)
// ============================================

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================

function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(num => {
        const target = parseInt(num.textContent);
        const suffix = num.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                num.textContent = target + suffix;
                clearInterval(counter);
            } else {
                num.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    });
}

// Trigger number animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log(`
%c🌌 UnRevealed Universe 🌌
%cTeam BomBSquad
%c
95% of our universe is invisible.
You're exploring the mysteries of Dark Matter, Black Holes, and the Big Bang.

"We are made of star stuff." - Carl Sagan
`,
'color: #8b5cf6; font-size: 24px; font-weight: bold;',
'color: #06b6d4; font-size: 14px;',
'color: #94a3b8; font-size: 12px;'
);
