(() => {
  'use strict';

  // A QR link may reuse an already-open homepage instead of loading a new tab.
  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith('#card=')) location.reload();
  });

  // The key is provided only by the business card, never by public site assets.
  if (!location.hash.startsWith('#card=')) return;
  const link = document.querySelector('.cv-link');
  if (!link) return;
  const encodedKey = location.hash.slice(6);
  let ready = false;
  link.removeAttribute('href');
  link.setAttribute('aria-disabled', 'true');
  link.setAttribute('aria-busy', 'true');
  link.textContent = 'Loading full CV…';
  link.addEventListener('click', (event) => {
    if (!ready) event.preventDefault();
  });

  // Keep the card access alive when returning to the introduction on this page.
  const wordmark = document.querySelector('.wordmark');
  if (wordmark) wordmark.setAttribute('href', '#about');
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  status.style.fontSize = '0.875em';
  status.style.flexBasis = '100%';
  link.parentElement.append(status);

  (async () => {
    try {
      if (!/^[A-Za-z0-9_-]{43}$/.test(encodedKey)) throw new Error('Invalid card link');
      if (!globalThis.crypto?.subtle) throw new Error('Secure browser required');
      const rawKey = Uint8Array.from(atob(encodedKey.replace(/-/g, '+').replace(/_/g, '/') + '='), c => c.charCodeAt(0));
      const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);
      const response = await fetch('docs/card-cv.enc', {cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer'});
      if (!response.ok) throw new Error('CV unavailable');
      const payload = new Uint8Array(await response.arrayBuffer());
      if (payload.length < 33) throw new Error('Invalid encrypted CV');
      const plaintext = await crypto.subtle.decrypt({name: 'AES-GCM', iv: payload.slice(0, 12), tagLength: 128}, key, payload.slice(12));
      const header = new TextDecoder().decode(new Uint8Array(plaintext, 0, 5));
      if (header !== '%PDF-') throw new Error('Invalid PDF');
      const file = new File([plaintext], 'Jaehyun_Park_CV.pdf', {type: 'application/pdf'});
      link.href = URL.createObjectURL(file);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Curriculum vitae (full) ↗';
      link.removeAttribute('aria-disabled');
      link.removeAttribute('aria-busy');
      ready = true;
      status.remove();
      // Keep the Blob available for PDF viewers and browser back/forward cache.
    } catch {
      link.textContent = 'Full CV unavailable';
      link.removeAttribute('aria-busy');
      status.textContent = 'Please scan the business card QR code again, or contact me by email.';
    }
  })();
})();
