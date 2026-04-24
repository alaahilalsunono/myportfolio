/* Scroll reveal */
const revealSections = document.querySelectorAll('.reveal-section');

revealSections.forEach((section) => {
    const items = section.querySelectorAll(
        'h2, h3, p, img, a, button, .skill-card, .project-card, .project-filters, .social-media-buttons'
    );

    items.forEach((item, index) => {
        item.classList.add('reveal-item');
        item.style.transitionDelay = `${Math.min(index * 0.07, 0.45)}s`;
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const items = entry.target.querySelectorAll('.reveal-item');

        if (entry.isIntersecting) {
            items.forEach((item) => item.classList.add('show'));
        }
    });
}, {
    threshold: 0.22
});

revealSections.forEach((section) => revealObserver.observe(section));

/* Active project filter UI only */
const filterButtons = document.querySelectorAll('.filter-button');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

/* Stars background */
const canvas = document.getElementById('starsCanvas');
const hero = document.querySelector('.hero-section');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && hero && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let mouse = { x: null, y: null };
    let animationFrameId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createStars();
    }

    function createStars() {
        stars = [];
        const area = canvas.width * canvas.height;
        const count = Math.min(120, Math.max(65, Math.floor(area / 14000)));

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.6 + 0.65,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22
            });
        }
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];

            star.x += star.vx;
            star.y += star.vy;

            if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
            if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(251, 255, 87, 0.72)';
            ctx.fill();

            for (let j = i + 1; j < stars.length; j++) {
                const nextStar = stars[j];
                const dx = star.x - nextStar.x;
                const dy = star.y - nextStar.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 92) {
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(nextStar.x, nextStar.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.42 * (1 - distance / 92)})`;
                    ctx.lineWidth = 0.45;
                    ctx.stroke();
                }
            }

            if (mouse.x !== null && mouse.y !== null) {
                const dx = star.x - mouse.x;
                const dy = star.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 145) {
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(251, 255, 87, ${0.65 * (1 - distance / 145)})`;
                    ctx.lineWidth = 0.9;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId);
        resizeCanvas();
        drawStars();
    });

    resizeCanvas();
    drawStars();
}
