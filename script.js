// ===== FAQ ACCORDION =====
(function () {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ===== MENU TAB SWITCHING =====
(function () {
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById('panel-' + tab.getAttribute('data-target'));
      if (target) target.classList.add('active');
    });
  });

  // Keyboard arrow navigation for tabs
  const menuNav = document.getElementById('menuNav');
  if (menuNav) {
    menuNav.addEventListener('keydown', (e) => {
      const tabsArray = Array.from(tabs);
      const currentIndex = tabsArray.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let newIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabsArray.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabsArray.length - 1;
      }

      if (newIndex !== undefined) {
        tabsArray[newIndex].focus();
        tabsArray[newIndex].click();
      }
    });
  }
})();

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE HAMBURGER =====
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ===== HIGHLIGHT TODAY'S HOURS =====
(function () {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  document.querySelectorAll('.hours-row').forEach(row => {
    const dayEl = row.querySelector('.day');
    const dayText = dayEl ? dayEl.textContent.trim() : '';
    if (dayText && dayText === today) {
      row.classList.add('today');
    }
  });
})();

// ===== HERO DISH CAROUSEL + STEAM PARTICLES =====
(function () {
  const hero = document.getElementById('hero');
  const stage = document.getElementById('heroStage');
  if (!stage) return;

  const track = document.getElementById('dishTrack');
  const canvas = document.getElementById('steamCanvas');
  const ctx = canvas.getContext('2d');
  const dots = document.querySelectorAll('.dish-dot');
  const slides = document.querySelectorAll('.dish-slide');

  let current = 0;
  let isAnimating = false;
  let autoTimer = null;
  // --- Advance to next dish ---
  function nextDish() {
    const next = (current + 1) % slides.length;
    goToSlide(next);
  }

  function goToSlide(index) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    const prev = slides[current];
    const next = slides[index];

    // Position incoming slide off-screen right (no transition yet)
    next.style.transition = 'none';
    next.style.transform = 'translateX(110%)';
    next.style.opacity = '0';
    next.offsetHeight; // force reflow

    // Restore transitions
    next.style.transition = '';

    // Animate: old slides left, new slides in from right
    prev.classList.remove('active');
    prev.classList.add('exit-left');

    next.classList.add('active');
    next.style.transform = '';
    next.style.opacity = '';

    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');

    current = index;

    // Cleanup after animation
    setTimeout(() => {
      prev.classList.remove('exit-left');
      prev.style.transform = '';
      prev.style.opacity = '';
      isAnimating = false;
    }, 700);

    resetAutoplay();
  }

  // --- CLICK anywhere on hero to advance ---
  hero.addEventListener('click', (e) => {
    // Don't trigger on buttons/links/dots
    if (e.target.closest('a, button')) return;
    nextDish();
  });

  // --- SCROLL (wheel) on the hero to advance (desktop only) ---
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    let scrollCooldown = false;
    hero.addEventListener('wheel', (e) => {
      if (scrollCooldown) return;
      if (Math.abs(e.deltaX) > 30) {
        e.preventDefault();
        scrollCooldown = true;
        nextDish();
        setTimeout(() => { scrollCooldown = false; }, 900);
      }
    }, { passive: false });
  }

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(parseInt(dot.dataset.index, 10));
    });
  });

  // Swipe support (touch) — only horizontal swipes, doesn't block vertical scrolling
  let startX = 0;
  let startY = 0;
  let swipeTracking = false;

  hero.addEventListener('touchstart', (e) => {
    if (e.target.closest('a, button')) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    swipeTracking = true;
  }, { passive: true });

  hero.addEventListener('touchend', (e) => {
    if (!swipeTracking) return;
    swipeTracking = false;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    // Only trigger on clear horizontal swipes (2:1 ratio, min 60px)
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
      if (dx < 0) {
        nextDish();
      } else {
        const prev = (current - 1 + slides.length) % slides.length;
        goToSlide(prev);
      }
    }
  }, { passive: true });

  // Desktop pointer swipe (non-touch only)
  if (!isTouchDevice) {
    let pointerStartX = 0;
    hero.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button')) return;
      pointerStartX = e.clientX;
    });
    hero.addEventListener('pointerup', (e) => {
      const dx = e.clientX - pointerStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) nextDish();
        else goToSlide((current - 1 + slides.length) % slides.length);
      }
    });
  }

  // Autoplay every 5s
  function resetAutoplay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextDish, 5000);
  }
  resetAutoplay();

  hero.addEventListener('mouseenter', () => clearInterval(autoTimer));
  hero.addEventListener('mouseleave', resetAutoplay);

  // --- STEAM PARTICLE SYSTEM ---
  let particles = [];
  let mouseX = -1000;
  let mouseY = -1000;
  let rafId = null;

  const MOUSE_RADIUS_SQ = 6400; // 80^2, avoid sqrt
  const MOUSE_FORCE = 2.5;

  function getParticleCount() {
    if (window.innerWidth <= 768) return isTouchDevice ? 18 : 30;
    return 50;
  }

  // Throttled resize
  let resizeTimer = null;
  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    if (resizeTimer) return;
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      resizeTimer = null;
    }, 150);
  });

  function createParticle(x, y) {
    return {
      x: x + (Math.random() - 0.5) * 40,
      y: y,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 1.2 + 0.3),
      size: Math.random() * 14 + 4,
      alpha: Math.random() * 0.2 + 0.05,
      decay: Math.random() * 0.002 + 0.001,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.008,
    };
  }

  function getEmitPosition() {
    const w = canvas.width;
    const h = canvas.height;
    if (w <= 768) {
      return {
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.25,
        y: h * 0.58 + (Math.random() - 0.5) * h * 0.06
      };
    }
    return {
      x: w * 0.7 + (Math.random() - 0.5) * w * 0.2,
      y: h * 0.35 + (Math.random() - 0.5) * h * 0.08
    };
  }

  function initParticles() {
    const count = getParticleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      const pos = getEmitPosition();
      const p = createParticle(pos.x, pos.y);
      p.y -= Math.random() * canvas.height * 0.35;
      p.alpha *= Math.random();
      particles.push(p);
    }
  }

  // Mouse repulsion — desktop only (no cursor on phones)
  if (!isTouchDevice) {
    function updateMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    hero.addEventListener('mousemove', updateMousePos);
    hero.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });
  }

  // Throttle mobile to ~30fps to save battery and prevent lag
  const frameDuration = isTouchDevice ? 33 : 0;
  let lastFrame = 0;

  function animateSteam(timestamp) {
    if (frameDuration && timestamp - lastFrame < frameDuration) {
      rafId = requestAnimationFrame(animateSteam);
      return;
    }
    lastFrame = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.5;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.size += 0.12;

      // Mouse repulsion (squared distance to avoid sqrt)
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const distSq = dx * dx + dy * dy;
      if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / 80) * MOUSE_FORCE;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx *= 0.98;
      p.vy *= 0.99;

      if (p.alpha <= 0) {
        const pos = getEmitPosition();
        particles[i] = createParticle(pos.x, pos.y);
        continue;
      }

      // Simplified rendering — single soft circle instead of gradient per particle
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Outer glow
      ctx.globalAlpha = p.alpha * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(animateSteam);
  }

  // Only animate when hero is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!rafId) { initParticles(); rafId = requestAnimationFrame(animateSteam); }
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(hero);
})();

// ===== VIDEO PLAY/PAUSE ON VISIBILITY =====
(function () {
  const videos = document.querySelectorAll('.video-card video');
  if (!videos.length) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach(v => videoObserver.observe(v));
})();

// ===== MOBILE CONVEYOR BELT — DUPLICATE CARDS FOR SEAMLESS LOOP =====
(function () {
  if (window.innerWidth > 768) return;

  const showcase = document.querySelector('.video-showcase');
  if (!showcase) return;

  const cards = showcase.querySelectorAll('.video-card');
  if (cards.length < 2) return;

  // Duplicate all cards for seamless infinite scroll
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    // Re-trigger autoplay on cloned videos
    const video = clone.querySelector('video');
    if (video) video.play().catch(() => {});
    showcase.appendChild(clone);
  });

  // Pause on touch, resume on release
  showcase.addEventListener('touchstart', () => {
    showcase.classList.add('paused');
  }, { passive: true });

  showcase.addEventListener('touchend', () => {
    showcase.classList.remove('paused');
  }, { passive: true });
})();
