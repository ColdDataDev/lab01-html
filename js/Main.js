document.addEventListener('DOMContentLoaded', init);

function init() {
    initActiveNav();
    initThemeToggle();
    initBackToTop();
    initContactForm();
    initAccordion();
    initFilters();
    initModal();
}

function initActiveNav() {
    const links = document.querySelectorAll('.nav-list a');

    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('is-active');
        }
    });
}

function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    const body = document.body;

    if (!btn) return;

    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme === 'dark') {
        body.classList.add('theme-dark');
    }

    btn.addEventListener('click', () => {
        body.classList.toggle('theme-dark');

        const isDark = body.classList.contains('theme-dark');
        localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
    });
}

function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.hidden = window.scrollY < 200;
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;
    
    const textarea = form.querySelector('textarea');
    const counter = document.getElementById('char-count');

    textarea?.addEventListener('input', () => {
    counter.textContent = textarea.value.length + ' символів';
    });
    
    const draftKey = 'contactDraft';

    const saved = JSON.parse(localStorage.getItem(draftKey) || '{}');
    Object.keys(saved).forEach(key => {
        if (form.elements[key]) {
            form.elements[key].value = saved[key];
        }
    });

    form.addEventListener('input', () => {
        const data = new FormData(form);
        const obj = Object.fromEntries(data.entries());
        localStorage.setItem(draftKey, JSON.stringify(obj));
    });

    // submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const obj = Object.fromEntries(data.entries());

        if (obj.name.length < 2) {
            console.log('Імʼя коротке');
            return;
        }

        if (!obj.email.includes('@')) {
            console.log('Email некоректний');
            return;
        }

        console.log('Успішно!');

        localStorage.removeItem(draftKey);
        form.reset();
    });
}

function initAccordion() {
    const buttons = document.querySelectorAll('.accordion-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            content.hidden = !content.hidden;
        });
    });
}

function initFilters() {
    const buttons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;

            cards.forEach(card => {
                const match = category === 'all' || card.dataset.category === category;
                card.hidden = !match;
            });
        });
    });
}

function initModal() {
    const open = document.querySelector('.open-modal');
    const modal = document.querySelector('.modal');
    const close = document.querySelector('.close-modal');

    if (!open || !modal) return;

    open.addEventListener('click', () => modal.hidden = false);
    close.addEventListener('click', () => modal.hidden = true);

    modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.hidden = true;
    }
});
}

const yearEl = document.getElementById('year');

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}