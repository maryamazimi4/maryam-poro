/* ═══════════════════════════════════════════════════════
   Maryam Azimi Portfolio — script.js
   Handles: Navbar, Scroll Animations, Skill Bars,
            Active Nav Links, Back-to-Top, Contact Form
═══════════════════════════════════════════════════════ */

/* ─── NAVBAR SCROLL EFFECT ──────────────────────────── */
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
  updateActiveNav();
  handleBackToTop();
});

/* ─── ACTIVE NAV LINK HIGHLIGHT ─────────────────────── */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active-nav');
          link.style.color = 'var(--gold)';
        } else {
          link.style.color = '';
        }
      });
    }
  });
}

/* ─── SMOOTH SCROLL FOR NAV LINKS ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    e.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;

    const navHeight = mainNav.offsetHeight;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

    window.scrollTo({ top: targetPos, behavior: 'smooth' });

    // Close mobile nav if open
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && navCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

/* ─── SCROLL ANIMATION OBSERVER ─────────────────────── */
const animatedElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, parseInt(delay));

      // Animate skill bars when skills section is visible
      if (entry.target.closest('#skills')) {
        animateSkillBars();
      }

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

animatedElements.forEach(el => observer.observe(el));

/* ─── SKILL BAR ANIMATION ────────────────────────────── */
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;

  document.querySelectorAll('.skill-fill').forEach(bar => {
    const targetWidth = bar.getAttribute('data-width') + '%';
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 200);
  });
}

// Also trigger on scroll past skills section
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateSkillBars();
      skillObserver.disconnect();
    }
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

/* ─── BACK TO TOP ────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── CONTACT FORM FEEDBACK ─────────────────────────── */
function sendMessage() {
  const nameInput    = document.querySelector('input[placeholder="John Doe"]');
  const emailInput   = document.querySelector('input[placeholder="john@example.com"]');
  const messageInput = document.querySelector('textarea');
  const feedback     = document.getElementById('formFeedback');

  const name    = nameInput?.value.trim();
  const email   = emailInput?.value.trim();
  const message = messageInput?.value.trim();

  feedback.innerHTML = '';

  if (!name || !email || !message) {
    feedback.innerHTML = `
      <div class="alert-custom alert-error">
        <i class="bi bi-exclamation-circle-fill"></i>
        Please fill in all required fields.
      </div>`;
    return;
  }

  if (!isValidEmail(email)) {
    feedback.innerHTML = `
      <div class="alert-custom alert-error">
        <i class="bi bi-exclamation-circle-fill"></i>
        Please enter a valid email address.
      </div>`;
    return;
  }

  // Simulate sending (no real backend — this is a portfolio demo)
  const btn = document.querySelector('#contact .btn-gold');
  btn.innerHTML = '<span class="spinner"></span> Sending...';
  btn.disabled  = true;

  setTimeout(() => {
    feedback.innerHTML = `
      <div class="alert-custom alert-success">
        <i class="bi bi-check-circle-fill"></i>
        Message sent! I'll get back to you soon ✨
      </div>`;
    btn.innerHTML = 'Send Message <i class="bi bi-send-fill ms-2"></i>';
    btn.disabled  = false;

    // Clear inputs
    nameInput.value    = '';
    emailInput.value   = '';
    messageInput.value = '';
    document.querySelector('input[placeholder="Project Inquiry"]').value = '';
  }, 1800);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Inject alert styles dynamically */
const alertStyles = document.createElement('style');
alertStyles.textContent = `
  .alert-custom {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.9rem 1.2rem;
    border-radius: 10px;
    font-size: 0.82rem;
    font-family: var(--font-mono);
    margin-top: 0.5rem;
  }
  .alert-success {
    background: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.3);
    color: #4ade80;
  }
  .alert-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
  }
  .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.3);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(alertStyles);

/* ─── TYPING EFFECT FOR HERO ROLES ──────────────────── */
const roles = ['Web Developer', 'UI/UX Designer', 'Problem Solver', 'Code Artist'];
const roleEls = document.querySelectorAll('.hero-subtitle-role');

// Subtle sequential fade-in for roles
roleEls.forEach((el, i) => {
  const originalText = el.textContent;
  el.textContent = '';
  setTimeout(() => {
    el.textContent = originalText;
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.5s ease';
  }, 800 + i * 300);
});

/* ─── CURSOR TRAIL (subtle gold dots) ───────────────── */
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.85) { // Only spawn occasionally
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 4px;
      height: 4px;
      background: var(--gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.6;
      transform: translate(-50%, -50%);
      transition: opacity 0.8s ease, transform 0.8s ease;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%, -50%) scale(0)';
    });
    setTimeout(() => dot.remove(), 800);
  }
});

/* ─── INIT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  handleBackToTop();
  console.log('%c Maryam Azimi Portfolio 🚀 ', 'background:#c9a84c;color:#0a0a0f;font-size:14px;font-weight:bold;padding:6px 12px;border-radius:4px;');
});

/* ===== Project video hover play ===== */

document.querySelectorAll(".project-card").forEach(card => {

const video = card.querySelector("video");

if(!video) return;

card.addEventListener("mouseenter", () => {

video.play();

});

card.addEventListener("mouseleave", () => {

video.pause();

video.currentTime = 0;

});

});