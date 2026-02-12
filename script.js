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
    const dayText = row.querySelector('.day')?.textContent.trim();
    if (dayText === today) {
      row.classList.add('today');
    }
  });
})();
