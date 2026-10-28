(() => {
  'use strict';

  // Keep the already-printed QR URL and CV behavior. Forward campaign codes,
  // not arbitrary query strings, names, or email addresses, to the landing page.
  const target = new URL('index.html', location.href);
  target.searchParams.set('from', 'card');
  const params = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
  const token = /^[a-z0-9][a-z0-9_.-]{0,79}$/i;
  let hasCampaign = false;
  for (const key of keys) {
    const value = params.get(key);
    if (value && token.test(value)) {
      target.searchParams.set(key, value);
      hasCampaign = true;
    }
  }
  if (!hasCampaign) {
    target.searchParams.set('utm_source', 'business_card');
    target.searchParams.set('utm_medium', 'qr');
    target.searchParams.set('utm_campaign', 'printed_card');
  }
  target.hash = 'about';
  location.replace(target.href);
})();
