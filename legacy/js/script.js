// Cursor spotlight: a soft glow that follows the pointer around the page.
(function () {
  const spotlight = document.querySelector('.spotlight');
  if (!spotlight || window.matchMedia('(max-width: 900px)').matches) return;

  window.addEventListener('mousemove', e => {
    spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
    spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
})();

// Scroll-spy: highlights the nav link matching whichever section is
// currently most visible, fixing the "always highlighted on About" issue.
(function () {
  const sections = document.querySelectorAll('main#content .section');
  const navLinks = document.querySelectorAll('.side-nav a[data-section]');

  if (!sections.length || !navLinks.length) return;

  const linkFor = id =>
    document.querySelector(`.side-nav a[data-section="${id}"]`);

  const setActive = id => {
    navLinks.forEach(link => link.classList.remove('active'));
    const active = linkFor(id);
    if (active) active.classList.add('active');
  };

  // Default to the first section on load.
  setActive(sections[0].id);

  const observer = new IntersectionObserver(
    entries => {
      // Pick the entry closest to the top of the viewport among those visible.
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    {
      root: null,
      // Treat a section as "current" once it crosses the upper third of
      // the viewport, and until it leaves the lower third.
      rootMargin: '-15% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => observer.observe(section));

  // Smooth-scroll with a small offset so headings aren't flush to the edge.
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('data-section');
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    });
  });
})();
