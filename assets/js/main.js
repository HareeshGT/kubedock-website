(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

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

  const videoPlayers = [
    { videoId: 'full-app-video', fallbackId: 'full-app-video-unavailable' },
    { videoId: 'product-video', fallbackId: 'video-unavailable' }
  ];
  videoPlayers.forEach(({ videoId, fallbackId }) => {
    const video = document.getElementById(videoId);
    const fallback = document.getElementById(fallbackId);
    if (!video || !fallback) return;

    // The player stays visible during metadata loading; show the fallback only
    // when the browser reports a media error.
    video.addEventListener('loadedmetadata', () => {
      fallback.hidden = true;
    });
    video.addEventListener('error', () => {
      fallback.hidden = false;
    });

    // Handle a media error that happened before this deferred script ran.
    if (video.error) fallback.hidden = false;
  });

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