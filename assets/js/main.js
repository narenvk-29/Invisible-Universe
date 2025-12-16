// ============================================
// UNREVEALED UNIVERSE - Professional JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initStarField();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initStatRings();
    createShootingStars();
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.remove('active');
    });
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
    const numStars = 150;

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
                radius: Math.random() * 1.2 + 0.3,
                alpha: Math.random(),
                delta: Math.random() * 0.015 + 0.003
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.alpha += star.delta;
            if (star.alpha > 1 || star.alpha < 0.1) {
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
            width: ${80 + Math.random() * 120}px;
            height: 1px;
            background: linear-gradient(90deg, white, transparent);
            top: ${Math.random() * 40}%;
            left: -200px;
            transform: rotate(-35deg);
            animation: shootingStar ${1.5 + Math.random() * 2}s linear forwards;
            opacity: 0;
        `;
        container.appendChild(star);
        setTimeout(() => star.remove(), 4000);
    }

    setInterval(createStar, 5000);
    setTimeout(createStar, 2000);
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.topic-card, .gallery-card, .timeline-item, .reference-item, .team-member, .detail-block').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// STAT RINGS ANIMATION
// ============================================

function initStatRings() {
    const statRings = document.querySelectorAll('.stat-ring');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressCircle = entry.target.querySelector('.stat-progress');
                if (progressCircle) {
                    progressCircle.style.strokeDashoffset = getComputedStyle(progressCircle).strokeDashoffset;
                }
            }
        });
    }, { threshold: 0.5 });

    statRings.forEach(ring => observer.observe(ring));
}

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log(`
%c UnRevealed Universe
%c Team BomBSquad | Physics Project 2025
%c
95% of our universe is invisible.
Explore Dark Matter, Black Holes, and the Big Bang.

"We are made of star stuff." - Carl Sagan
`,
'color: #7c3aed; font-size: 20px; font-weight: bold; font-family: monospace;',
'color: #06b6d4; font-size: 12px; font-family: monospace;',
'color: #94a3b8; font-size: 11px; font-family: monospace;'
);
