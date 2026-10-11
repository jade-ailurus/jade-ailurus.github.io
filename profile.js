(() => {
  const header = document.querySelector('.site-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coursework = document.getElementById('coursework');
  const navLinks = [...header.querySelectorAll('[data-nav-key]')];
  const sections = [...document.querySelectorAll('main > section[data-nav-section]')];
  let courseworkAnimation = null;
  let courseworkTargetOpen = Boolean(coursework?.open);
  let scrollFrame = null;

  const updateCurrent = () => {
    scrollFrame = null;
    let key = document.body.dataset.navPage || 'home';
    if (sections.length) {
      const readingLine = header.getBoundingClientRect().bottom + 30;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) key = section.dataset.navSection;
      }
      if (coursework?.open) {
        const bounds = coursework.getBoundingClientRect();
        if (bounds.top <= readingLine && bounds.bottom > readingLine) key = 'coursework';
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) key = 'posts';
    }
    navLinks.forEach((link) => {
      if (link.dataset.navKey === key) link.setAttribute('aria-current', sections.length ? 'location' : 'page');
      else link.removeAttribute('aria-current');
    });
  };
  const queueCurrent = () => {
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateCurrent);
  };
  const updateHeaderOffset = () => {
    document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight + 24}px`);
    queueCurrent();
  };
  updateHeaderOffset();
  new ResizeObserver(updateHeaderOffset).observe(header);
  new ResizeObserver(queueCurrent).observe(document.querySelector('main'));
  window.addEventListener('scroll', queueCurrent, {passive: true});
  window.addEventListener('resize', queueCurrent);

  const setCoursework = (open, instant = false) => {
    if (!coursework) return;
    const summary = coursework.querySelector('summary');
    const content = coursework.querySelector('.group-content');
    if (courseworkTargetOpen === open && coursework.open === open && !courseworkAnimation) return;
    const startHeight = coursework.getBoundingClientRect().height;
    if (courseworkAnimation) {
      courseworkAnimation.onfinish = null;
      courseworkAnimation.cancel();
      courseworkAnimation = null;
    }
    courseworkTargetOpen = open;
    summary.setAttribute('aria-expanded', String(open));
    content.inert = !open;
    const finish = () => {
      coursework.open = open;
      coursework.style.overflow = '';
      courseworkAnimation = null;
      queueCurrent();
    };
    if (instant || reducedMotion.matches || !coursework.animate) {
      finish();
      return;
    }
    coursework.open = true;
    const style = getComputedStyle(coursework);
    const collapsedHeight = summary.getBoundingClientRect().height +
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const endHeight = open ? coursework.getBoundingClientRect().height : collapsedHeight;
    coursework.style.overflow = 'hidden';
    courseworkAnimation = coursework.animate(
      [{height: `${startHeight}px`}, {height: `${endHeight}px`}],
      {duration: 380, easing: 'cubic-bezier(.22, 1, .36, 1)'}
    );
    courseworkAnimation.onfinish = finish;
  };
  if (coursework) {
    const summary = coursework.querySelector('summary');
    const content = coursework.querySelector('.group-content');
    summary.setAttribute('aria-expanded', String(coursework.open));
    content.inert = !coursework.open;
    coursework.addEventListener('toggle', () => {
      if (courseworkAnimation) return;
      courseworkTargetOpen = coursework.open;
      summary.setAttribute('aria-expanded', String(coursework.open));
      content.inert = !coursework.open;
      queueCurrent();
    });
    summary.addEventListener('click', (event) => {
      event.preventDefault();
      setCoursework(!courseworkTargetOpen);
    });
    window.addEventListener('resize', () => {
      if (courseworkAnimation) setCoursework(courseworkTargetOpen, true);
    });
  }
  const scrollToCoursework = () => {
    requestAnimationFrame(() => {
      updateHeaderOffset();
      coursework.scrollIntoView({block: 'start'});
      queueCurrent();
    });
  };
  document.querySelectorAll('a[href="#coursework"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setCoursework(true);
      if (location.hash !== '#coursework') history.pushState(null, '', '#coursework');
      scrollToCoursework();
    });
  });
  const followHash = () => {
    if (coursework && location.hash === '#coursework') {
      setCoursework(true, true);
      scrollToCoursework();
    }
    queueCurrent();
  };
  window.addEventListener('hashchange', followHash);
  followHash();
  updateCurrent();
})();
