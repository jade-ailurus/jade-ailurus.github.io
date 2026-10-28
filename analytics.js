(() => {
  'use strict';

  const config = window.JP_ANALYTICS || {};
  const validId = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  const dnt = [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack]
    .some(value => value === 1 || value === '1' || value === 'yes');
  let optedOut = false;
  try { optedOut = Boolean(localStorage.getItem('umami.disabled')); } catch { /* Storage can be unavailable. */ }
  if (!validId.test(config.websiteId || '') || config.scriptUrl !== 'https://cloud.umami.is/script.js' ||
      location.hostname !== config.hostname || config.hostname !== 'jade-ailurus.github.io' ||
      location.protocol !== 'https:' || dnt || optedOut || navigator.globalPrivacyControl === true) return;
  if (window.jpAnalyticsLoaded || document.querySelector('meta[http-equiv="refresh" i]')) return;
  window.jpAnalyticsLoaded = true;

  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
  const token = /^[a-z0-9][a-z0-9_.-]{0,79}$/i;
  const storageKey = 'jp.analytics.entry.v1';
  const timeout = 30 * 60 * 1000;
  const allowed = (params) => {
    const result = {};
    for (const key of keys) {
      const value = params.get(key);
      if (value && token.test(value)) result[key] = value;
    }
    return result;
  };
  const incoming = allowed(new URLSearchParams(location.search));
  if (!Object.keys(incoming).length && new URLSearchParams(location.search).get('from') === 'card') {
    Object.assign(incoming, {utm_source: 'business_card', utm_medium: 'qr', utm_campaign: 'printed_card'});
  }
  let saved;
  try { saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); } catch { /* Continue without storage. */ }
  let referral = '';
  try {
    const source = new URL(document.referrer);
    if (source.origin !== location.origin) referral = source.hostname;
  } catch { /* No usable referrer. */ }
  const externalEntry = Boolean(referral);
  const now = Date.now();
  const canResume = saved && Number.isFinite(saved.lastAt) && now >= saved.lastAt && now - saved.lastAt < timeout && !externalEntry;
  let entry = {
    params: Object.keys(incoming).length ? incoming : canResume ? allowed(new URLSearchParams(saved.params)) : {},
    referral: referral || (canResume && /^[a-z0-9.-]{1,253}$/i.test(saved.referral || '') ? saved.referral : ''),
    lastAt: now
  };
  const touch = () => {
    const time = Date.now();
    if (time - entry.lastAt >= timeout) entry.params = {...incoming};
    entry.lastAt = time;
    try { sessionStorage.setItem(storageKey, JSON.stringify(entry)); } catch { /* Keep the in-memory entry. */ }
  };
  touch();

  const pagePath = (pathname) => pathname === '/index.html' ? '/' : pathname;
  const reportedUrl = (value) => {
    try {
      const url = new URL(value, location.origin);
      const query = new URLSearchParams(entry.params).toString();
      return pagePath(url.pathname) + (query ? '?' + query : '');
    } catch { return pagePath(location.pathname); }
  };
  const cleanReferrer = (value) => {
    if (!value) return '';
    try {
      const url = new URL(value, location.origin);
      return url.origin === location.origin ? url.origin + pagePath(url.pathname) : url.origin;
    } catch { return ''; }
  };
  let lastPageview = '';
  window.jpAnalyticsBeforeSend = (type, payload) => {
    if (type !== 'event') return payload;
    touch();
    const result = {...payload, url: reportedUrl(payload.url), referrer: cleanReferrer(payload.referrer)};
    // Section/hash navigation should not inflate pageview counts.
    if (!payload.name) {
      if (result.url === lastPageview) return false;
      lastPageview = result.url;
    }
    return result;
  };

  const eventData = () => ({
    source: entry.params.utm_source || (entry.params.ref ? 'shared_link' : entry.referral || 'direct'),
    medium: entry.params.utm_medium || (entry.params.ref ? 'link' : entry.referral ? 'referral' : 'none'),
    ...(entry.params.utm_campaign ? {campaign: entry.params.utm_campaign} : {}),
    ...(entry.params.utm_content ? {content: entry.params.utm_content} : {}),
    ...(entry.params.ref ? {link_code: entry.params.ref} : {})
  });
  const send = (name, data) => {
    touch();
    try {
      const result = window.umami?.track(name, {...eventData(), ...data});
      if (result?.catch) result.catch(() => {});
    } catch { /* Analytics must never interfere with a link. */ }
  };
  document.addEventListener('click', (event) => {
    if (event.button !== 0) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) { send('email_click', {}); return; }
    let target;
    try { target = new URL(link.href, location.href); } catch { return; }
    if (target.origin !== location.origin) return;
    if (target.pathname === '/docs/cv.pdf' || target.pathname === '/docs/cv-full.pdf') {
      send('cv_click', {version: target.pathname.endsWith('cv-full.pdf') ? 'full' : 'public'});
    } else if (/^\/projects\/[^/]+\.html$/.test(target.pathname)) {
      send('project_click', {page: target.pathname});
    } else if (/^\/(?:blog|letters|philosophy)\/[^/]+\.html$/.test(target.pathname)) {
      send('post_click', {page: target.pathname});
    }
  }, true);

  const script = document.createElement('script');
  script.defer = true;
  script.src = config.scriptUrl;
  script.setAttribute('data-website-id', config.websiteId);
  script.setAttribute('data-domains', config.hostname);
  script.setAttribute('data-exclude-hash', 'true');
  script.setAttribute('data-do-not-track', 'true');
  script.setAttribute('data-before-send', 'jpAnalyticsBeforeSend');
  script.referrerPolicy = 'strict-origin';
  document.head.appendChild(script);
})();
