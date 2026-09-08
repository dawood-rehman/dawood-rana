import crypto from 'crypto';

const BOT_PATTERNS = [
  /bot\b/i,
  /spider\b/i,
  /crawl\b/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baiduspider/i,
  /duckduckbot/i,
  /slurp/i,
  /twitterbot/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /whatsapp/i,
  /slackbot/i,
  /telegrambot/i,
  /pinterest/i,
  /lighthouse/i,
  /headlesschrome/i,
  /curl\b/i,
  /wget\b/i,
  /python-requests/i,
  /axios/i,
  /node-fetch/i,
  /postman/i,
];

export function isBot(userAgent = '') {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function parseUserAgent(userAgent = '') {
  if (!userAgent) {
    return { device: 'desktop', browser: 'Unknown', os: 'Unknown' };
  }

  // Device detection
  let device = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    device = 'tablet';
  } else if (
    /mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/i.test(
      userAgent
    )
  ) {
    device = 'mobile';
  }

  // OS detection
  let os = 'Unknown';
  if (/windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = 'iOS';
  } else if (/macintosh|mac os x/i.test(userAgent)) {
    os = 'macOS';
  } else if (/android/i.test(userAgent)) {
    os = 'Android';
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux';
  }

  // Browser detection
  let browser = 'Unknown';
  if (/edg\//i.test(userAgent)) {
    browser = 'Edge';
  } else if (/opr\/|opera/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/chrome|crios/i.test(userAgent) && !/edg\//i.test(userAgent)) {
    browser = 'Chrome';
  } else if (
    /safari/i.test(userAgent) &&
    !/chrome|crios|android/i.test(userAgent)
  ) {
    browser = 'Safari';
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/msie|trident/i.test(userAgent)) {
    browser = 'Internet Explorer';
  }

  return { device, browser, os };
}

export function extractClientIp(request) {
  if (!request) return '127.0.0.1';

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may contain comma-separated list of proxies
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}

export function extractCountry(request) {
  if (!request) return 'Unknown';
  return (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    'Unknown'
  );
}

/**
 * Generate privacy-compliant daily rotating salted visitor hash.
 * Cannot be reversed into raw IP; changes every 24h to prevent cross-day tracking.
 */
export function generateVisitorHash(ip, userAgent = '', dateOverride = null) {
  const salt =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'portfolio-analytics-salt-98124';

  const today =
    dateOverride || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  return crypto
    .createHash('sha256')
    .update(`${ip}|${userAgent.slice(0, 80)}|${today}|${salt}`)
    .digest('hex')
    .slice(0, 32);
}

export function sanitizeReferrer(rawReferrer = '') {
  if (!rawReferrer) return 'Direct';

  try {
    const url = new URL(rawReferrer);
    let host = url.hostname.replace(/^www\./, '');
    if (!host) return 'Direct';

    // Normalize popular platforms
    if (host.includes('google.')) return 'Google';
    if (host.includes('github.')) return 'GitHub';
    if (host.includes('linkedin.')) return 'LinkedIn';
    if (host.includes('twitter.') || host.includes('x.com')) return 'Twitter / X';
    if (host.includes('facebook.')) return 'Facebook';
    if (host.includes('instagram.')) return 'Instagram';
    if (host.includes('whatsapp.')) return 'WhatsApp';
    if (host.includes('reddit.')) return 'Reddit';
    if (host.includes('youtube.')) return 'YouTube';

    return host;
  } catch (_) {
    return 'Direct';
  }
}
