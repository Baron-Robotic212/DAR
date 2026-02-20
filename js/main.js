/**
 * DAR FUNDACIÓN — main.js
 * 
 * FUNCIONALIDADES:
 * 1. Header scroll shadow
 * 2. Menú móvil hamburguesa
 * 3. Smooth scroll para links de ancla
 * 4. Intersection Observer para animaciones fade-in
 * 5. Parallax sutil en hero (opcional)
 *
 * PRUEBA DE ANIMACIONES:
 * Las animaciones se activan al hacer scroll. Para probarlas
 * rápidamente abre DevTools > Elements y añade la clase "visible"
 * manualmente a cualquier elemento con "fade-in-up", o simplemente
 * haz scroll en la página.
 */

'use strict';

// ---- 1. Header shadow on scroll --------------------------------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// ---- 2. Menú móvil hamburguesa ---------------------------------
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Animación de las 3 líneas → X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Cerrar menú al seleccionar un link
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ---- 3. Smooth scroll para anclas de navegación ----------------
// Ya lo maneja html { scroll-behavior: smooth } en CSS,
// pero este JS agrega compatibilidad extra y compensa el header fijo.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header ? header.offsetHeight : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- 4. Intersection Observer — animaciones scroll ---------------
/**
 * Para añadir animación a un elemento:
 * - Agrega la clase "fade-in-up", "fade-in-left" o "fade-in-right"
 * - Opcionalmente añade "delay-1" a "delay-5" para escalonar
 * El observer añadirá "visible" cuando el elemento entre al viewport.
 */
const animatedEls = document.querySelectorAll(
  '.fade-in-up, .fade-in-left, .fade-in-right'
);

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Dejar de observar para no re-disparar
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedEls.forEach(el => observer.observe(el));

// ---- 5. Contador animado (Impact Numbers) ----------------------
// Si en el futuro agregas un contador tipo "50 familias ayudadas",
// usa esta función:
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Ejemplo de uso: animateCounter(document.querySelector('.counter'), 150);

// ---- 6. Parallax suave en el hero bg ---------------------------
// Activa un parallax muy sutil al hacer scroll para dar profundidad.
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // Mover el bg a la mitad de velocidad del scroll
    heroBg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
  }, { passive: true });
}

// ---- 7. Año dinámico en footer ---------------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();