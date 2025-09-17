// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Particle system
function createParticles() {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    
    // Violet family only
    const colors = ['#a1a1ff', '#7c4dff', '#b0b7ff', '#d9ddff'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    particlesContainer.appendChild(particle);
  }
}

// Floating shapes
function createFloatingShapes() {
  const shapesContainer = document.querySelector('.floating-shapes');
  if (!shapesContainer) return;
  
  for (let i = 0; i < 4; i++) {
    const shape = document.createElement('div');
    shape.className = 'shape';
    shapesContainer.appendChild(shape);
  }
}

// Cursor trail and magnetic buttons
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  if (cursor) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  }
  requestAnimationFrame(animateCursor);
}

function makeMagnetic(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    const strength = 20;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx / strength}px, ${dy / strength}px) scale(1.05)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// Copy to clipboard
function attachCopyHandlers() {
  document.querySelectorAll('.copy').forEach((el) => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(text);
        el.textContent = '✅ Copied!';
        el.style.background = 'linear-gradient(135deg, rgba(161, 161, 255, 0.2), rgba(124, 77, 255, 0.1))';
        setTimeout(() => {
          el.textContent = el.dataset.original || el.textContent;
          el.style.background = '';
        }, 1500);
      } catch {}
    });
    if (!el.dataset.original) el.dataset.original = el.textContent;
  });
}

// IntersectionObserver for reveal animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Project filtering (scoped to projects section)
const projectFilterButtons = document.querySelectorAll('#projects .filter');
const projectCards = document.querySelectorAll('#projects .project');
projectFilterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    projectFilterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.dataset.filter;
    projectCards.forEach((card) => {
      const tags = (card.getAttribute('data-tags') || '').split(/\s+/);
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  });
});

// Gallery filtering (scoped to gallery section)
const galleryFilterButtons = document.querySelectorAll('#gallery .filter');
const galleryCardItems = document.querySelectorAll('#gallery .gallery-item');
galleryFilterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    galleryFilterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const project = btn.dataset.filter;
    galleryCardItems.forEach((item) => {
      const itemProject = item.getAttribute('data-project');
      const show = project === 'all' || itemProject === project;
      item.style.display = show ? '' : 'none';
    });
  });
});

// Gallery Lightbox
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');
const btnPrev = document.querySelector('.lightbox-prev');
const btnNext = document.querySelector('.lightbox-next');
const btnClose = document.querySelector('.lightbox-close');
let currentIndex = -1;

function openLightbox(index) {
  currentIndex = index;
  const img = galleryItems[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxCaption.textContent = galleryItems[currentIndex].dataset.caption || '';
  lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  btnClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  currentIndex = -1;
}

function show(delta) {
  if (currentIndex < 0) return;
  currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
  const img = galleryItems[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxCaption.textContent = galleryItems[currentIndex].dataset.caption || '';
  lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
}

// Gallery event listeners
galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
  item.addEventListener('keypress', (e) => { if (e.key === 'Enter') openLightbox(idx); });
  item.tabIndex = 0;
});

btnPrev?.addEventListener('click', () => show(-1));
btnNext?.addEventListener('click', () => show(1));
btnClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') show(-1);
  if (e.key === 'ArrowRight') show(1);
});

// Touch swipe for lightbox
let touchStartX = 0;
lightbox?.addEventListener('touchstart', (e) => { 
  touchStartX = e.changedTouches[0].clientX; 
}, { passive: true });
lightbox?.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) show(dx > 0 ? -1 : 1);
}, { passive: true });

// Enhanced gallery hover effects
galleryItems.forEach((item) => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `rotateX(${ -y * 8 }deg) rotateY(${ x * 8 }deg) translateY(-8px)`;
  });
  item.addEventListener('mouseleave', () => { item.style.transform = ''; });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Ensure project cards are visible on load by selecting 'All'
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  createFloatingShapes();
  animateCursor();
  makeMagnetic('.btn');
  makeMagnetic('.logo');
  attachCopyHandlers();
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  // Reset project filters to 'All' on load
  projectFilterButtons.forEach(btn => btn.classList.remove('active'));
  projectCards.forEach(card => card.style.display = ''); // Show all projects
});