import { NextResponse } from 'next/server';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import PortfolioContent from '@/models/PortfolioContent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import {
  extractClientIp,
  extractCountry,
  generateVisitorHash,
  isBot,
  parseUserAgent,
  sanitizeReferrer,
} from '@/lib/analyticsUtils';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const userAgent = request.headers.get('user-agent') || '';

    // Ignore known bots & search crawlers to keep human analytics accurate
    if (isBot(userAgent)) {
      return NextResponse.json({ success: true, ignored: 'bot' }, { status: 200 });
    }

    // Check Do-Not-Track / Global Privacy Control headers
    const dnt =
      request.headers.get('dnt') === '1' ||
      request.headers.get('sec-gpc') === '1';

    let body = {};
    try {
      body = await request.json();
    } catch (_) {
      // Body may be empty on beacon
    }

    let { type = 'pageview', path = '/', referrer = '', visitorName = '' } = body;

    // Also extract visitorName if passed in query string (e.g. /?name=Hamza or ?client=Ali)
    if (!visitorName && path.includes('?')) {
      try {
        const search = path.split('?')[1];
        const urlParams = new URLSearchParams(search);
        visitorName =
          urlParams.get('name') ||
          urlParams.get('client') ||
          urlParams.get('lead') ||
          urlParams.get('ref') ||
          urlParams.get('from') ||
          '';
      } catch (_) {}
    }

    const cleanVisitorName = (visitorName || '').trim().slice(0, 50);

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { success: true, note: 'storage-skipped' },
        { status: 200 }
      );
    }

    await connectToDatabase();

    // Check if analytics is enabled in CMS
    const content = await PortfolioContent.findOne({ singleton: 'main' })
      .select('analyticsConfig')
      .lean();

    const config = content?.analyticsConfig || { enabled: true, respectDnt: true };
    if (config.enabled === false) {
      return NextResponse.json(
        { success: true, ignored: 'disabled' },
        { status: 200 }
      );
    }

    if (dnt && config.respectDnt !== false) {
      return NextResponse.json(
        { success: true, ignored: 'dnt' },
        { status: 200 }
      );
    }

    const ip = extractClientIp(request);
    const country = extractCountry(request);
    const { device, browser, os } = parseUserAgent(userAgent);
    const visitorHash = generateVisitorHash(ip, userAgent);
    const cleanReferrer = sanitizeReferrer(referrer);

    // Save event asynchronously
    await AnalyticsEvent.create({
      type: type || 'pageview',
      path: (path || '/').slice(0, 100),
      referrer: cleanReferrer,
      browser,
      os,
      device,
      country,
      visitorHash,
      visitorName: cleanVisitorName,
      timestamp: new Date(),
    });

    // If visitor is identified with a name, retroactively label previous events from this visitorHash
    if (cleanVisitorName) {
      AnalyticsEvent.updateMany(
        { visitorHash, visitorName: { $in: ['', null] } },
        { $set: { visitorName: cleanVisitorName } }
      ).catch(() => {});
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Always return 200 OK so client performance / beacons are never disrupted
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
