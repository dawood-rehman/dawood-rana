import { NextResponse } from 'next/server';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { verifyAdminSession } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function GET(request) {
  const session = verifyAdminSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rangeParam = searchParams.get('range') || '7d';
  const days = rangeParam === '30d' ? 30 : rangeParam === '14d' ? 14 : 7;

  if (!isMongoConfigured()) {
    // Generate graceful placeholder data if MongoDB is in offline dev mode
    const today = new Date();
    const timeline = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      timeline.push({ date: dateStr, views: 0, uniques: 0 });
    }

    return NextResponse.json({
      success: true,
      data: {
        range: rangeParam,
        kpis: {
          totalViews: 0,
          uniqueVisitors: 0,
          todayViews: 0,
          todayUniques: 0,
        },
        timeline,
        referrers: [{ name: 'Direct', count: 0, percentage: 100 }],
        devices: [
          { name: 'desktop', count: 0, percentage: 100 },
          { name: 'mobile', count: 0, percentage: 0 },
        ],
        browsers: [{ name: 'Chrome', count: 0, percentage: 100 }],
        events: [],
        recentActivity: [],
      },
    });
  }

  try {
    await connectToDatabase();

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Parallel aggregate queries for max speed
    const [
      totalViews,
      uniqueHashes,
      todayViews,
      todayUniqueHashes,
      timelineRaw,
      referrersRaw,
      devicesRaw,
      browsersRaw,
      eventsRaw,
      recentRaw,
      identifiedVisitorsRaw,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ timestamp: { $gte: startDate } }),
      AnalyticsEvent.distinct('visitorHash', { timestamp: { $gte: startDate } }),
      AnalyticsEvent.countDocuments({ timestamp: { $gte: todayStart } }),
      AnalyticsEvent.distinct('visitorHash', { timestamp: { $gte: todayStart } }),

      // Timeline aggregation by date
      AnalyticsEvent.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            views: { $sum: 1 },
            uniqueSet: { $addToSet: '$visitorHash' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Referrers
      AnalyticsEvent.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),

      // Devices
      AnalyticsEvent.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Browsers
      AnalyticsEvent.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // Custom events (downloads, contact clicks)
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
            type: { $ne: 'pageview' },
          },
        },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Recent 20 activity records
      AnalyticsEvent.find()
        .sort({ timestamp: -1 })
        .limit(20)
        .select('type path referrer browser device os country visitorName timestamp')
        .lean(),

      // Named / Identified visitors (from personalized links or contact forms)
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
            visitorName: { $exists: true, $ne: '' },
          },
        },
        {
          $group: {
            _id: '$visitorName',
            visits: { $sum: 1 },
            device: { $first: '$device' },
            browser: { $first: '$browser' },
            referrer: { $first: '$referrer' },
            lastSeen: { $max: '$timestamp' },
          },
        },
        { $sort: { lastSeen: -1 } },
        { $limit: 15 },
      ]),
    ]);

    // Build complete daily timeline with zero-fill for missing dates
    const timelineMap = new Map();
    timelineRaw.forEach((entry) => {
      timelineMap.set(entry._id, {
        views: entry.views,
        uniques: entry.uniqueSet ? entry.uniqueSet.length : 0,
      });
    });

    const timeline = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const stats = timelineMap.get(dateStr) || { views: 0, uniques: 0 };
      timeline.push({
        date: dateStr,
        views: stats.views,
        uniques: stats.uniques,
      });
    }

    const safeTotal = Math.max(1, totalViews);

    const referrers = referrersRaw.map((r) => ({
      name: r._id || 'Direct',
      count: r.count,
      percentage: Math.round((r.count / safeTotal) * 100),
    }));

    const devices = devicesRaw.map((d) => ({
      name: d._id || 'desktop',
      count: d.count,
      percentage: Math.round((d.count / safeTotal) * 100),
    }));

    const browsers = browsersRaw.map((b) => ({
      name: b._id || 'Unknown',
      count: b.count,
      percentage: Math.round((b.count / safeTotal) * 100),
    }));

    const events = eventsRaw.map((e) => ({
      type: e._id,
      count: e.count,
    }));

    const identifiedVisitors = (identifiedVisitorsRaw || []).map((v) => ({
      name: v._id,
      visits: v.visits,
      device: v.device,
      browser: v.browser,
      referrer: v.referrer,
      lastSeen: v.lastSeen,
    }));

    return NextResponse.json({
      success: true,
      data: {
        range: rangeParam,
        kpis: {
          totalViews,
          uniqueVisitors: uniqueHashes.length,
          todayViews,
          todayUniques: todayUniqueHashes.length,
        },
        timeline,
        referrers: referrers.length > 0 ? referrers : [{ name: 'Direct', count: 0, percentage: 100 }],
        devices: devices.length > 0 ? devices : [{ name: 'desktop', count: 0, percentage: 100 }],
        browsers: browsers.length > 0 ? browsers : [{ name: 'Chrome', count: 0, percentage: 100 }],
        events,
        identifiedVisitors,
        recentActivity: recentRaw,
      },
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to compute analytics statistics' },
      { status: 500 }
    );
  }
}
