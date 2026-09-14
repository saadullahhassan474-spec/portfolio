const menuButton = document.getElementById("menuButton");
const mobileNav = document.getElementById("mobile-navigation");

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "Open navigation menu" : "Close navigation menu");
  mobileNav.hidden = open;
  menuButton.innerHTML = open ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
});

mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");

  mobileNav.hidden = true;

  menuButton.innerHTML = `
    <svg viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true">
      <path d="M4 6h16"/>
      <path d="M4 12h16"/>
      <path d="M4 18h16"/>
    </svg>
  `;

}));
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else { revealItems.forEach(item => item.classList.add("is-visible")); }

(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const targets = [
    ...document.querySelectorAll('.code-workspace, .hero-portrait'),
    ...document.querySelectorAll('.skill-card, .project-card, .cert-card, .fact-card, .explore-card, .achievement-card, .timeline-card')
  ];

  targets.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const strength = element.matches('.code-workspace, .hero-portrait') ? 7 : 4;
      element.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateZ(8px)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
})();

(() => {
  const links = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
})();


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".timeline-card");

  const animateCard = (card) => {
    if (card.dataset.animated) return;
    card.dataset.animated = "true";

    const badge = card.querySelector("[data-percentage]");
    if (!badge) return;

    const targetPercentage = parseFloat(badge.dataset.percentage);
    if (Number.isNaN(targetPercentage)) return;

    let start = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = (targetPercentage * easeProgress).toFixed(2);

      card.style.setProperty("--card-percentage", `${currentVal}%`);
      badge.textContent = `${currentVal}%`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        card.style.setProperty("--card-percentage", `${targetPercentage}%`);
        badge.textContent = `${targetPercentage}%`;
      }
    };

    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCard(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach((card) => animateCard(card));
  }
});

(() => {
  const portrait = document.querySelector(".hero-portrait");
  if (!portrait) return;

  let animId = null;
  let currX = 50;
  let currY = 50;
  let currRx = 0;
  let currRy = 0;
  let targetX = 50;
  let targetY = 50;
  let targetRx = 0;
  let targetRy = 0;

  const render = () => {
    currX += (targetX - currX) * 0.16;
    currY += (targetY - currY) * 0.16;
    currRx += (targetRx - currRx) * 0.14;
    currRy += (targetRy - currRy) * 0.14;

    portrait.style.setProperty("--reveal-x", `${currX.toFixed(2)}%`);
    portrait.style.setProperty("--reveal-y", `${currY.toFixed(2)}%`);
    portrait.style.setProperty("--reveal-radius-x", `${currRx.toFixed(1)}px`);
    portrait.style.setProperty("--reveal-radius-y", `${currRy.toFixed(1)}px`);

    if (
      Math.abs(targetRx - currRx) > 0.1 ||
      Math.abs(targetRy - currRy) > 0.1 ||
      Math.abs(targetX - currX) > 0.1 ||
      Math.abs(targetY - currY) > 0.1
    ) {
      animId = requestAnimationFrame(render);
    } else {
      portrait.style.setProperty("--reveal-radius-x", `${targetRx}px`);
      portrait.style.setProperty("--reveal-radius-y", `${targetRy}px`);
      animId = null;
    }
  };

  portrait.addEventListener("pointermove", (e) => {
    const rect = portrait.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * 100;
    targetY = ((e.clientY - rect.top) / rect.height) * 100;

    targetRx = 380 + Math.sin(e.clientX * 0.04) * 60;
    targetRy = 320 + Math.cos(e.clientY * 0.04) * 60;

    if (!animId) {
      animId = requestAnimationFrame(render);
    }
  });

  portrait.addEventListener("pointerleave", () => {
    targetRx = 0;
    targetRy = 0;
    if (!animId) {
      animId = requestAnimationFrame(render);
    }
  });
})();