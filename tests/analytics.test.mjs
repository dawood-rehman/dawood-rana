import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBot,
  parseUserAgent,
  generateVisitorHash,
  sanitizeReferrer,
} from '../lib/analyticsUtils.js';
import { initialData } from '../lib/storage.js';
import { isContentSection } from '../lib/contentSections.js';

test('Analytics: Bot detection accurately identifies search crawlers and scripts', () => {
  assert.equal(
    isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
    true
  );
  assert.equal(
    isBot('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'),
    true
  );
  assert.equal(isBot('curl/7.81.0'), true);
  assert.equal(isBot('python-requests/2.28.1'), true);

  // Legitimate browsers should not be flagged as bots
  assert.equal(
    isBot(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ),
    false
  );
  assert.equal(
    isBot(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    ),
    false
  );
});

test('Analytics: User Agent parsing identifies devices, browsers, and OS', () => {
  const desktopChrome = parseUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  assert.equal(desktopChrome.device, 'desktop');
  assert.equal(desktopChrome.browser, 'Chrome');
  assert.equal(desktopChrome.os, 'Windows');

  const iphoneSafari = parseUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
  );
  assert.equal(iphoneSafari.device, 'mobile');
  assert.equal(iphoneSafari.browser, 'Safari');
  assert.equal(iphoneSafari.os, 'iOS');

  const ipadSafari = parseUserAgent(
    'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  );
  assert.equal(ipadSafari.device, 'tablet');

  const macFirefox = parseUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0'
  );
  assert.equal(macFirefox.device, 'desktop');
  assert.equal(macFirefox.browser, 'Firefox');
  assert.equal(macFirefox.os, 'macOS');
});

test('Analytics: Privacy-compliant daily salted visitor hashing', () => {
  const ip1 = '198.51.100.24';
  const ip2 = '203.0.113.195';
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

  const hashDay1 = generateVisitorHash(ip1, ua, '2026-09-08');
  const hashDay1Repeat = generateVisitorHash(ip1, ua, '2026-09-08');
  const hashDay2 = generateVisitorHash(ip1, ua, '2026-09-09');
  const hashDifferentIp = generateVisitorHash(ip2, ua, '2026-09-08');

  // Same visitor on same day gets same hash (accurate unique count)
  assert.equal(hashDay1, hashDay1Repeat);
  assert.equal(hashDay1.length, 32);

  // Different day rolls over hash (GDPR compliance: non-persistent cross-day tracking)
  assert.notEqual(hashDay1, hashDay2);

  // Different IP gets different hash
  assert.notEqual(hashDay1, hashDifferentIp);
});

test('Analytics: Referrer sanitization normalizes domains', () => {
  assert.equal(
    sanitizeReferrer('https://www.google.com/search?q=dawood+rehman'),
    'Google'
  );
  assert.equal(
    sanitizeReferrer('https://github.com/dawood-rehman/dawood-rana'),
    'GitHub'
  );
  assert.equal(
    sanitizeReferrer('https://www.linkedin.com/in/dawood-rehman'),
    'LinkedIn'
  );
  assert.equal(sanitizeReferrer(''), 'Direct');
  assert.equal(sanitizeReferrer(null), 'Direct');
  assert.equal(sanitizeReferrer('https://news.ycombinator.com/item?id=123'), 'news.ycombinator.com');
});

test('Analytics: CMS integration and configuration whitelist', () => {
  assert.ok(isContentSection('analyticsConfig'));
  assert.ok(initialData.analyticsConfig);
  assert.equal(initialData.analyticsConfig.enabled, true);
  assert.equal(initialData.analyticsConfig.respectDnt, true);
});
