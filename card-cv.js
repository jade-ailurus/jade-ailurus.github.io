(() => {
  'use strict';

  // The already-printed business card opens about.html, which adds this query.
  // This selects a CV version; it is not authentication or access control.
  if (new URLSearchParams(location.search).get('from') !== 'card') return;

  const link = document.querySelector('.cv-link');
  if (!link) return;
  link.href = 'docs/cv-full.pdf';
  link.firstChild.textContent = 'Curriculum vitae (full) ';

  // Fragment-only navigation retains the selected version, including refresh.
  const wordmark = document.querySelector('.wordmark');
  if (wordmark) wordmark.setAttribute('href', '#about');
})();
