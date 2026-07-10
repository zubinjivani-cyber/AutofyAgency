// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const animateElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for grid items
            const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
            const siblingIndex = Array.from(siblings).indexOf(entry.target);
            
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, siblingIndex * 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// ===== PRICING CARD HOVER INTERACTION =====
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Add subtle tilt effect based on mouse position
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        if (!card.classList.contains('popular')) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('popular')) {
            card.style.transform = '';
        } else {
            card.style.transform = 'scale(1.03)';
        }
    });
});

// ===== COMPARISON TABLE ROW HOVER =====
const tableRows = document.querySelectorAll('.comparison-table tbody tr');

tableRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.background = 'rgba(108, 99, 255, 0.03)';
    });
    row.addEventListener('mouseleave', () => {
        row.style.background = '';
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
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

// ===== PARALLAX SUBTLE EFFECT ON HERO =====
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    }
});

// ===== COUNTER ANIMATION FOR PRICING =====
function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeOut);
        element.textContent = '$' + current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Animate prices when they come into view
const priceElements = document.querySelectorAll('.price');
const priceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const value = parseInt(text.replace(/[$,]/g, ''));
            entry.target.textContent = '$0';
            animateValue(entry.target, 0, value, 1200);
            priceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

priceElements.forEach(el => priceObserver.observe(el));

// ===== STRATEGY CALL FORM (Formspree AJAX submission) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const endpoint = contactForm.action;

        formStatus.textContent = '';
        formStatus.className = 'form-status';

        submitButton.disabled = true;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            formStatus.textContent = "Thanks! We've got your message and will be in touch shortly.";
            formStatus.classList.add('success');
            contactForm.reset();
        } catch (error) {
            console.error(error);
            formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
            formStatus.classList.add('error');
        } finally {
            submitButton.disabled = false;
        }
    });
}
