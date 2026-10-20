(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');

  /* 1. Revelar secções ao fazer scroll (para de observar depois de revelar) */
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((el) => revealObserver.observe(el));
  }

  /* 2. Header com estado "scrolled" + barra de progresso */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const arrow = document.querySelector('.scroll-down');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (arrow) arrow.classList.toggle('hide', y > 80);
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 3. Menu móvel */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) setOpen(false);
    });
  }

  /* 4. Link ativo no menu conforme a secção visível */
  const anchorLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const targets = anchorLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (targets.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        anchorLinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach((t) => spy.observe(t));
  }

  /* 5. Luz nos cards que segue o cursor (funciona também em cards criados por artigos.js) */
  if (!reduceMotion) {
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, { passive: true });
  }

  /* 6. Copiar email */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = 'Copiado ✓';
        btn.classList.add('copied');
      } catch {
        btn.textContent = 'Erro';
      }
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1800);
    });
  });
})();
