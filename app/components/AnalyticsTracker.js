'use client';

import { useEffect } from 'react';
import { DEFAULT_DATA, getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export function trackCustomEvent(type, metadata = {}) {
  if (typeof window === 'undefined') return;

  const detail =
    typeof metadata === 'string' ? { path: metadata } : { ...metadata };

  const eventPath =
    detail.path ||
    (window.location.pathname + window.location.search + window.location.hash) ||
    '/';

  if (detail.visitorName) {
    try {
      localStorage.setItem('analytics_visitor_name', detail.visitorName);
    } catch (_) {}
  }

  window.dispatchEvent(
    new CustomEvent('track-custom-event', {
      detail: {
        type,
        path: eventPath,
        visitorName: detail.visitorName,
      },
    })
  );
}

export default function AnalyticsTracker({
  initialConfig = DEFAULT_DATA.analyticsConfig,
}) {
  useEffect(() => {
    const getConfig = () => {
      const saved = getFromStorage(
        STORAGE_KEYS.ANALYTICS_CONFIG,
        DEFAULT_DATA.analyticsConfig
      );
      return saved ? { ...DEFAULT_DATA.analyticsConfig, ...saved } : initialConfig;
    };

    // Extract visitor name from URL query parameter (e.g. ?name=Hamza or ?client=Ali)
    const getVisitorName = () => {
      if (typeof window === 'undefined') return '';

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryName =
          urlParams.get('name') ||
          urlParams.get('client') ||
          urlParams.get('lead') ||
          urlParams.get('ref') ||
          urlParams.get('from');

        if (queryName) {
          const sanitized = queryName.trim().slice(0, 50);
          localStorage.setItem('analytics_visitor_name', sanitized);
          return sanitized;
        }

        return localStorage.getItem('analytics_visitor_name') || '';
      } catch (_) {
        return '';
      }
    };

    const sendEvent = (type = 'pageview', customPath = null, explicitName = null) => {
      const config = getConfig();
      if (config.enabled === false) return;

      // Check Do-Not-Track
      const dnt =
        typeof navigator !== 'undefined' &&
        (navigator.doNotTrack === '1' ||
          window.doNotTrack === '1' ||
          navigator.msDoNotTrack === '1');

      if (dnt && config.respectDnt !== false) return;

      const path =
        customPath ||
        (window.location.pathname + window.location.search + window.location.hash) ||
        '/';
      const referrer = document.referrer || '';
      const visitorName = explicitName || getVisitorName();

      const payload = JSON.stringify({ type, path, referrer, visitorName });

      // Prefer non-blocking sendBeacon
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/track', blob);
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Track initial page view after window loads / paints
    const timer = setTimeout(() => {
      sendEvent('pageview');
    }, 300);

    // Listen for custom events (e.g. resume download, whatsapp click, contact submit)
    const handleCustomEvent = (e) => {
      const detail = e?.detail;
      if (detail && detail.type) {
        sendEvent(detail.type, detail.path, detail.visitorName);
      }
    };

    window.addEventListener('track-custom-event', handleCustomEvent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('track-custom-event', handleCustomEvent);
    };
  }, [initialConfig]);

  return null;
}
