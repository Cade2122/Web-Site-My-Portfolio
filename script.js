// ==================== Анимация фона (canvas) с учётом производительности ====================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas?.getContext('2d');
let width, height;
let particles = [];
let animationFrame;

function initParticles() {
    particles = [];
    const particleCount = Math.min(100, Math.floor(width * height / 10000)); // адаптивное количество
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 1,
        });
    }
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
    initParticles();
}

function drawParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#00ff9d';
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.2)';
    ctx.lineWidth = 1;

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff9d';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 255, 157, ${1 - distance / 100})`;
                ctx.stroke();
            }
        }
    }

    animationFrame = requestAnimationFrame(drawParticles);
}

// Запускаем анимацию, если пользователь не против анимаций
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('resize', debounce(resizeCanvas, 200));
    resizeCanvas();
    drawParticles();
} else {
    // Если reduced motion, просто показываем статичный фон или ничего
    if (canvas) canvas.style.display = 'none';
}

// ==================== Debounce ====================
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

// ==================== Мобильное меню ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true' ? false : true;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', expanded);
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// ==================== Активный пункт меню при скролле ====================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
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

// ==================== Анимация появления при скролле ====================
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

// ==================== Фильтрация проектов ====================
const projectsData = [
    {
        id: 1,
        title: 'Интернет-магазин',
        description: 'Полноценный интернет-магазин на React + Redux.',
        image: 'linear-gradient(135deg, #6c5ce7, #00ff9d)',
        tech: ['React', 'Redux', 'Node.js', 'MongoDB'],
        category: 'webapp',
        link: '#',
        fullDesc: 'Разработал SPA с корзиной, фильтрацией, авторизацией.'
    },
    {
        id: 2,
        title: 'Лендинг для стартапа',
        description: 'Красивый лендинг с анимациями на чистом JS.',
        image: 'linear-gradient(135deg, #ff6b6b, #feca57)',
        tech: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
        category: 'landing',
        link: '#',
        fullDesc: 'Адаптивный, быстрый, с параллакс-эффектами.'
    },
    {
        id: 3,
        title: 'Панель управления',
        description: 'Админ-панель на Vue 3 и Tailwind.',
        image: 'linear-gradient(135deg, #48dbfb, #ff9ff3)',
        tech: ['Vue', 'Vuex', 'Tailwind', 'Chart.js'],
        category: 'webapp',
        link: '#',
        fullDesc: 'Дашборд с графиками, управлением пользователями.'
    }
];

const projectGrid = document.querySelector('.project-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderProjects(category = 'all') {
    if (!projectGrid) return;
    const filtered = category === 'all' ? projectsData : projectsData.filter(p => p.category === category);
    projectGrid.innerHTML = filtered.map(project => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-img" style="background: ${project.image};"></div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Добавляем обработчики для открытия модалки
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.id));
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.filter);
    });
});

renderProjects();

// ==================== Модальное окно проектов ====================
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');
const modalLink = document.getElementById('modal-link');
const closeModalBtn = document.querySelector('.close-modal');

function openModal(id) {
    const project = projectsData.find(p => p.id == id);
    if (!project) return;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.fullDesc || project.description;
    modalTech.textContent = project.tech.join(', ');
    modalLink.href = project.link;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // запрет прокрутки фона
}

function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ==================== Карусель отзывов ====================
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentIndex = 0;
const slides = document.querySelectorAll('.testimonial-card');

if (slides.length && track) {
    const slideWidth = () => slides[0].getBoundingClientRect().width;

    const setSlidePosition = () => {
        track.style.transform = `translateX(-${currentIndex * slideWidth()}px)`;
    };

    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            setSlidePosition();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            setSlidePosition();
        }
    });

    window.addEventListener('resize', setSlidePosition);
}

// ==================== Отправка формы ====================
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Введите корректный email');
        return;
    }

    alert(`Спасибо, ${name}! Сообщение отправлено (демо-режим).`);
    this.reset();
});

// ==================== Кнопка "Наверх" ====================
const scrollBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollBtn.style.display = 'flex';
    } else {
        scrollBtn.style.display = 'none';
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== Плавный скролл для якорей ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});