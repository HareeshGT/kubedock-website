(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    document.body.classList.remove('mobile-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.setAttribute('title', 'Open navigation menu');
    if (restoreFocus) toggle.focus();
  };
  const mobileQuery = window.matchMedia('(max-width: 680px)');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (!open) { closeMenu(); return; }
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    toggle.setAttribute('title', 'Close navigation menu');
    nav?.classList.add('open');
    document.body.classList.add('mobile-nav-open');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeMenu({ restoreFocus: true });
  });
  mobileQuery.addEventListener?.('change', () => closeMenu());

  const tabs = [...document.querySelectorAll('.showcase-tab')];
  const panels = [...document.querySelectorAll('.showcase-content')];
  const activateTab = (tab) => {
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.id === tab.dataset.panel;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      activateTab(tabs[next]);
    });
  });

  // Old homepage video anchors now live on the Videos page.
  if (document.querySelector('.hero') && /^#(video|full-app-tour)$/.test(location.hash)) {
    location.replace('videos/#' + (location.hash === '#video' ? 'ai-workspace' : 'app-tour'));
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionTargets = document.querySelectorAll(
    '.feature-card, .section-head, .integration-rail > div, .ai-detail-list article, ' +
    '.faq-list details, .security-panel, .start-panel, .showcase-panel, .install-note, ' +
    '.platform-section, .releases-section'
  );
  motionTargets.forEach(element => element.classList.add('reveal'));
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 65 + 'ms';
      observer.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }
})();