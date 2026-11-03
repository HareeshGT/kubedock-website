(() => {
  const video = document.getElementById('stage-video');
  if (!video) return;

  const library = [
    {
      id: 'app-tour',
      kicker: '01 · FULL APP TOUR',
      title: 'The complete KubeDock experience',
      desc: 'Explore KubeDock as a whole — from the desktop workspace and infrastructure tools to the workflows that bring your day-to-day operations together.',
      src: '../assets/video/kubedock-explainer-web.mp4',
      poster: '../assets/img/poster-app-tour.jpg',
      file: 'kubedock-app-tour.mp4'
    },
    {
      id: 'ai-workspace',
      kicker: '02 · AI WORKSPACE',
      title: 'See how KubeDock fits together',
      desc: 'Watch the walkthrough to understand the AI Workspace, evidence-based investigations, Watch mode, runbooks, resource right-sizing and human-reviewed remediation.',
      src: '../assets/video/kubedock-ai-workspace.mp4?v=20261102',
      poster: '../assets/img/poster-ai-workspace.jpg',
      file: 'kubedock-ai-workspace.mp4'
    }
  ];

  const $ = (id) => document.getElementById(id);
  const fallback = $('stage-fallback');
  const kicker = $('now-kicker');
  const title = $('now-title');
  const desc = $('now-desc');
  const download = $('now-download');
  const openLink = $('now-open');
  const copyBtn = $('now-copy');
  const nextBtn = $('now-next');
  const copyStatus = $('copy-status');
  const items = [...document.querySelectorAll('.playlist-item')];

  const byId = (id) => library.find((item) => item.id === id);
  let current = 'app-tour'; // matches the markup served without JavaScript

  const render = (entry) => {
    kicker.textContent = entry.kicker;
    title.textContent = entry.title;
    desc.textContent = entry.desc;
    download.href = entry.src;
    download.setAttribute('download', entry.file);
    openLink.href = entry.src;
    items.forEach((btn) => btn.setAttribute('aria-current', String(btn.dataset.video === entry.id)));
    const next = library[(library.indexOf(entry) + 1) % library.length];
    nextBtn.dataset.next = next.id;
    nextBtn.hidden = true;
    document.title = entry.title + ' — KubeDock Videos';
  };

  const select = (id, { autoplay = false, updateHash = true } = {}) => {
    const entry = byId(id) || library[0];
    const changed = entry.id !== current;
    current = entry.id;
    render(entry);
    if (changed) {
      fallback.hidden = true;
      video.pause();
      video.poster = entry.poster;
      video.src = entry.src;
      video.load();
    }
    if (updateHash && location.hash !== '#' + entry.id) {
      history.replaceState(null, '', '#' + entry.id);
    }
    if (autoplay) {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    }
  };

  // Playlist cards
  items.forEach((btn) => btn.addEventListener('click', () => {
    select(btn.dataset.video, { autoplay: true });
    video.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }));

  // "Play this video" links in the cards below the player
  document.querySelectorAll('[data-play]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    select(link.dataset.play, { autoplay: true });
    video.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }));

  // Watch next, shown when a video finishes
  video.addEventListener('ended', () => { nextBtn.hidden = false; });
  video.addEventListener('play', () => { nextBtn.hidden = true; });
  nextBtn.addEventListener('click', () => select(nextBtn.dataset.next, { autoplay: true }));

  // Share the current video's deep link
  copyBtn.addEventListener('click', async () => {
    const url = location.origin + location.pathname + '#' + current;
    try {
      await navigator.clipboard.writeText(url);
      copyStatus.textContent = 'Link copied';
    } catch {
      copyStatus.textContent = 'Copy failed — use the address bar instead';
    }
    const label = copyBtn.firstChild;
    const original = label.textContent;
    label.textContent = copyStatus.textContent.startsWith('Link') ? 'Copied ' : original;
    setTimeout(() => { label.textContent = original; copyStatus.textContent = ''; }, 2000);
  });

  // Load errors: the player stays visible while metadata loads and the
  // fallback appears only when the browser reports a media error.
  video.addEventListener('loadedmetadata', () => { fallback.hidden = true; });
  video.addEventListener('error', () => { fallback.hidden = false; });
  if (video.error) fallback.hidden = false;

  render(byId(current));

  // Deep links: videos/#ai-workspace
  const fromHash = () => {
    const id = location.hash.slice(1);
    if (byId(id)) select(id, { updateHash: false });
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
