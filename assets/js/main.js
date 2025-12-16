// ============================================
// INVISIBLE UNIVERSE - Premium JavaScript
// Professional Space Background & Interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initSpaceBackground();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initStatRings();
    initParallaxEffect();
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
// PROFESSIONAL SPACE BACKGROUND
// Canvas-based starfield with particles
// ============================================

function initSpaceBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'spaceCanvas';
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

    // Configuration
    const config = {
        starCount: 400,
        particleCount: 50,
        nebulaCount: 3,
        shootingStarInterval: 4000,
        mouseInfluence: 0.02
    };

    // State
    let width, height, centerX, centerY;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let stars = [];
    let particles = [];
    let nebulae = [];
    let shootingStars = [];

    // Star class
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width * 2 - width;
            this.y = Math.random() * height * 2 - height;
            this.z = Math.random() * 1000;
            this.baseSize = Math.random() * 1.5 + 0.5;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.color = this.getStarColor();
        }

        getStarColor() {
            const colors = [
                'rgba(255, 255, 255, 1)',      // White
                'rgba(200, 220, 255, 1)',      // Blue-white
                'rgba(255, 240, 220, 1)',      // Warm white
                'rgba(180, 200, 255, 1)',      // Cool blue
                'rgba(255, 200, 150, 1)',      // Orange tint
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update(speed) {
            this.z -= speed;
            this.twinklePhase += this.twinkleSpeed;

            if (this.z <= 0) {
                this.z = 1000;
                this.x = Math.random() * width * 2 - width;
                this.y = Math.random() * height * 2 - height;
            }
        }

        draw() {
            const scale = 1000 / (1000 + this.z);
            const x = (this.x - mouse.x * 50) * scale + centerX;
            const y = (this.y - mouse.y * 50) * scale + centerY;

            if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return;

            const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
            const size = this.baseSize * scale * twinkle;
            const alpha = scale * twinkle;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('1)', `${alpha})`);
            ctx.fill();

            // Add glow to brighter stars
            if (size > 1.5) {
                ctx.beginPath();
                ctx.arc(x, y, size * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
                gradient.addColorStop(0, this.color.replace('1)', '0.3)'));
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }

    // Floating Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 100;
            this.x = centerX + Math.cos(angle) * distance;
            this.y = centerY + Math.sin(angle) * distance;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.life = 1;
            this.decay = Math.random() * 0.002 + 0.001;
            this.size = Math.random() * 3 + 1;
            this.hue = Math.random() * 60 + 240; // Purple to cyan range
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;

            // Drift outward
            const dx = this.x - centerX;
            const dy = this.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                this.x += (dx / dist) * 0.3;
                this.y += (dy / dist) * 0.3;
            }

            if (this.life <= 0) {
                this.reset();
            }
        }

        draw() {
            const alpha = this.life * 0.6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${alpha})`;
            ctx.fill();
        }
    }

    // Nebula class
    class Nebula {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 300 + 200;
            this.hue = Math.random() * 60 + 250; // Purple-cyan range
            this.alpha = Math.random() * 0.08 + 0.02;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.005 + 0.002;
        }

        update() {
            this.pulse += this.pulseSpeed;
        }

        draw() {
            const pulseAlpha = this.alpha * (Math.sin(this.pulse) * 0.3 + 0.7);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `hsla(${this.hue}, 70%, 50%, ${pulseAlpha})`);
            gradient.addColorStop(0.5, `hsla(${this.hue + 20}, 60%, 40%, ${pulseAlpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Shooting Star class
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width * 0.8;
            this.y = Math.random() * height * 0.3;
            this.length = Math.random() * 100 + 80;
            this.speed = Math.random() * 15 + 10;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
            this.life = 1;
            this.active = true;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life -= 0.02;

            if (this.life <= 0 || this.x > width + 100 || this.y > height + 100) {
                this.active = false;
            }
        }

        draw() {
            if (!this.active) return;

            const tailX = this.x - Math.cos(this.angle) * this.length;
            const tailY = this.y - Math.sin(this.angle) * this.length;

            const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.7, `rgba(150, 220, 255, ${this.life * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${this.life})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Head glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3 * this.life, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.life})`;
            ctx.fill();
        }
    }

    // Initialize
    function init() {
        resize();

        // Create stars
        stars = [];
        for (let i = 0; i < config.starCount; i++) {
            stars.push(new Star());
        }

        // Create particles
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }

        // Create nebulae
        nebulae = [];
        for (let i = 0; i < config.nebulaCount; i++) {
            nebulae.push(new Nebula());
        }
    }

    // Resize handler
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
        centerY = height / 2;
    }

    // Mouse tracking with easing
    document.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX - centerX) / centerX;
        mouse.targetY = (e.clientY - centerY) / centerY;
    });

    // Create shooting stars periodically
    setInterval(() => {
        if (shootingStars.length < 2) {
            shootingStars.push(new ShootingStar());
        }
    }, config.shootingStarInterval);

    // Animation loop
    function animate() {
        // Clear with slight trail effect
        ctx.fillStyle = 'rgba(3, 0, 20, 0.15)';
        ctx.fillRect(0, 0, width, height);

        // Clear fully for cleaner stars
        ctx.clearRect(0, 0, width, height);

        // Ease mouse position
        mouse.x += (mouse.targetX - mouse.x) * config.mouseInfluence;
        mouse.y += (mouse.targetY - mouse.y) * config.mouseInfluence;

        // Draw nebulae first (background)
        nebulae.forEach(nebula => {
            nebula.update();
            nebula.draw();
        });

        // Update and draw stars
        stars.forEach(star => {
            star.update(0.5);
            star.draw();
        });

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Update and draw shooting stars
        shootingStars = shootingStars.filter(star => {
            star.update();
            star.draw();
            return star.active;
        });

        requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', () => {
        resize();
        // Reposition nebulae on resize
        nebulae.forEach(nebula => {
            nebula.x = Math.random() * width;
            nebula.y = Math.random() * height;
        });
    });

    // Start
    init();
    animate();
}

// ============================================
// PARALLAX EFFECT
// ============================================

function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');
        const heroBackground = hero.querySelector('.hero-background');

        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrolled / 500);
        }

        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple items
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.topic-card, .gallery-card, .timeline-item, .reference-item, .team-member, .detail-block, .video-frame'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
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
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
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
                    // Trigger the CSS animation
                    progressCircle.style.animation = 'none';
                    progressCircle.offsetHeight; // Trigger reflow
                    progressCircle.style.animation = null;
                }

                // Animate the number
                const numberEl = entry.target.querySelector('.stat-number');
                if (numberEl) {
                    const targetValue = parseInt(numberEl.textContent);
                    animateValue(numberEl, 0, targetValue, 2000);
                }
            }
        });
    }, { threshold: 0.5 });

    statRings.forEach(ring => observer.observe(ring));
}

// Number animation helper
function animateValue(element, start, end, duration) {
    const suffix = element.innerHTML.includes('%') ? '<span>%</span>' : '';
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const current = Math.floor(easeProgress * (end - start) + start);
        element.innerHTML = current + suffix;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
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
%c ✦ Invisible Universe ✦
%c Team BomBSquad | Physics Project 2025
%c
95% of our universe is invisible.
Explore Dark Matter, Black Holes, and the Big Bang.

"We are made of star stuff." - Carl Sagan
`,
'color: #7c3aed; font-size: 24px; font-weight: bold; font-family: monospace; text-shadow: 0 0 10px #7c3aed;',
'color: #06b6d4; font-size: 14px; font-family: monospace;',
'color: #94a3b8; font-size: 12px; font-family: monospace;'
);
