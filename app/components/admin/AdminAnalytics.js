'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FaChartLine,
  FaEye,
  FaUsers,
  FaCalendarDay,
  FaUserCheck,
  FaSyncAlt,
  FaTrashAlt,
  FaGlobe,
  FaDesktop,
  FaMobileAlt,
  FaChrome,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaLink,
  FaCopy,
} from 'react-icons/fa';
import {
  getFromStorage,
  saveContentSection,
  STORAGE_KEYS,
  DEFAULT_DATA,
} from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminAnalytics() {
  const [range, setRange] = useState('7d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [config, setConfig] = useState(DEFAULT_DATA.analyticsConfig);
  const [savingConfig, setSavingConfig] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [customLeadName, setCustomLeadName] = useState('');

  const fetchStats = useCallback(
    async (showToast = false) => {
      try {
        if (showToast) setRefreshing(true);
        const res = await fetch(`/api/analytics/stats?range=${range}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to load analytics statistics');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          if (showToast) toast.success('Analytics data refreshed!');
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
        if (showToast) toast.error(err.message || 'Failed to refresh analytics');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [range]
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const saved = getFromStorage(
      STORAGE_KEYS.ANALYTICS_CONFIG,
      DEFAULT_DATA.analyticsConfig
    );
    if (saved) {
      setConfig({ ...DEFAULT_DATA.analyticsConfig, ...saved });
    }
  }, []);

  const handleToggleSetting = async (key, val) => {
    const updated = { ...config, [key]: val };
    setConfig(updated);
    setSavingConfig(true);

    try {
      await saveContentSection('analyticsConfig', updated);
      toast.success('Analytics configuration saved!');
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleClearData = async () => {
    if (
      !window.confirm(
        'Are you sure you want to purge all analytics tracking data? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/analytics/clear', { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || 'Analytics data cleared');
        fetchStats();
      } else {
        toast.error(json.message || 'Failed to clear data');
      }
    } catch (err) {
      toast.error(err.message || 'Network error clearing analytics');
    }
  };

  const handleCopyTrackedLink = () => {
    if (!customLeadName.trim()) {
      toast.error('Please enter a person or client name first');
      return;
    }

    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://dawoodrana.com';
    const cleanParam = encodeURIComponent(customLeadName.trim());
    const generatedUrl = `${origin}/?name=${cleanParam}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(generatedUrl).then(() => {
        toast.success(
          `Tracked link for "${customLeadName.trim()}" copied to clipboard!`
        );
      }).catch(() => {
        toast.success(`Generated: ${generatedUrl}`);
      });
    } else {
      toast.success(`Generated: ${generatedUrl}`);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const kpis = data?.kpis || {
    totalViews: 0,
    uniqueVisitors: 0,
    todayViews: 0,
    todayUniques: 0,
  };

  const timeline = data?.timeline || [];
  const maxViews = Math.max(1, ...timeline.map((t) => t.views));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
              <FaChartLine />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Traffic & Live Analytics
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                GDPR-compliant, cookieless traffic analytics with daily salted IP anonymization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Range Selector */}
            <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-1">
              {['7d', '14d', '30d'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    range === r
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : '30 Days'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Refresh Analytics"
            >
              <FaSyncAlt className={`text-xs ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Page Views */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Views</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <FaEye className="text-sm" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {kpis.totalViews.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Past {range === '7d' ? '7' : range === '14d' ? '14' : '30'} days</p>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Unique Visitors</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <FaUsers className="text-sm" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {kpis.uniqueVisitors.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Anonymized daily visitors</p>
        </div>

        {/* Today's Views */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today Views</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <FaCalendarDay className="text-sm" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {kpis.todayViews.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Active day volume</p>
        </div>

        {/* Today's Uniques */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today Uniques</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <FaUserCheck className="text-sm" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {kpis.todayUniques.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Distinct humans today</p>
        </div>
      </div>

      {/* Interactive Timeline Chart */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <FaChartLine className="text-blue-400" />
            <h3 className="text-base font-bold text-white">Daily Traffic Trend</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Page Views
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span> Unique Visitors
            </span>
          </div>
        </div>

        {/* Chart Container */}
        {loading ? (
          <div className="h-56 flex items-center justify-center text-slate-400 text-sm">
            Loading traffic analytics...
          </div>
        ) : timeline.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-slate-500 text-sm">
            No visitor traffic recorded yet in this time window.
          </div>
        ) : (
          <div className="relative pt-6">
            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="pointer-events-none absolute top-0 z-20 -translate-x-1/2 rounded bg-slate-950 px-3 py-1.5 text-xs text-white shadow-xl border border-slate-700"
                style={{ left: `${hoveredPoint.x}%` }}
              >
                <div className="font-bold text-slate-200">{hoveredPoint.date}</div>
                <div className="text-blue-400">{hoveredPoint.views} page views</div>
                <div className="text-emerald-400">{hoveredPoint.uniques} unique visitors</div>
              </div>
            )}

            {/* Bar Chart Grid */}
            <div className="grid h-48 items-end gap-1 sm:gap-2 grid-flow-col auto-cols-fr">
              {timeline.map((item, idx) => {
                const heightPercent = Math.max(4, Math.round((item.views / maxViews) * 100));
                const uniqueHeightPercent = Math.max(
                  3,
                  Math.round((item.uniques / maxViews) * 100)
                );
                const xPercent = ((idx + 0.5) / timeline.length) * 100;

                return (
                  <div
                    key={item.date}
                    onMouseEnter={() =>
                      setHoveredPoint({ ...item, x: xPercent })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="group relative flex h-full flex-col justify-end items-center cursor-pointer"
                  >
                    <div className="relative w-full max-w-[28px] flex items-end justify-center gap-0.5">
                      {/* Views Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-1/2 rounded-t bg-blue-500/80 group-hover:bg-blue-400 transition-all duration-300"
                      />
                      {/* Uniques Bar */}
                      <div
                        style={{ height: `${uniqueHeightPercent}%` }}
                        className="w-1/2 rounded-t bg-emerald-500/80 group-hover:bg-emerald-400 transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis Labels */}
            <div className="grid grid-flow-col auto-cols-fr pt-2 border-t border-slate-700 text-center text-[10px] text-slate-400">
              {timeline.map((item, idx) => {
                const shouldShow =
                  range === '7d' || idx % (range === '14d' ? 2 : 4) === 0;
                return (
                  <span key={item.date} className="truncate">
                    {shouldShow ? item.date.slice(5) : ''}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Referrers */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
            <FaGlobe className="text-blue-400" /> Top Referrers
          </h3>
          <div className="space-y-3">
            {(!data?.referrers || data.referrers.length === 0) && (
              <p className="text-xs text-slate-400">No referrer data yet.</p>
            )}
            {data?.referrers?.map((ref) => (
              <div key={ref.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{ref.name}</span>
                  <span className="text-slate-400">{ref.count} ({ref.percentage}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-700">
                  <div
                    className="h-1.5 rounded-full bg-blue-500"
                    style={{ width: `${Math.min(100, Math.max(5, ref.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
            <FaDesktop className="text-emerald-400" /> Devices & Hardware
          </h3>
          <div className="space-y-3">
            {(!data?.devices || data.devices.length === 0) && (
              <p className="text-xs text-slate-400">No device data yet.</p>
            )}
            {data?.devices?.map((dev) => (
              <div key={dev.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold capitalize">
                  <span className="text-slate-200">{dev.name}</span>
                  <span className="text-slate-400">{dev.count} ({dev.percentage}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-700">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(100, Math.max(5, dev.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
            <FaChrome className="text-amber-400" /> Browsers
          </h3>
          <div className="space-y-3">
            {(!data?.browsers || data.browsers.length === 0) && (
              <p className="text-xs text-slate-400">No browser data yet.</p>
            )}
            {data?.browsers?.map((br) => (
              <div key={br.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{br.name}</span>
                  <span className="text-slate-400">{br.count} ({br.percentage}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-700">
                  <div
                    className="h-1.5 rounded-full bg-amber-500"
                    style={{ width: `${Math.min(100, Math.max(5, br.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Link Generator Tool */}
      <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2">
            <FaLink className="text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Create Personalized Tracked Link for Client / Lead
            </h3>
          </div>
          <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
            Solution 1: Name Tracker
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Want to know whenever a specific client, friend, or recruiter opens your portfolio? Enter their name below to generate a tracked link. When they open it, their exact name, device, and referrer will be logged in the live stream!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={customLeadName}
              onChange={(e) => setCustomLeadName(e.target.value)}
              placeholder="e.g. Hamza, Upwork Client, Google Recruiter"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleCopyTrackedLink}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 active:scale-95 transition-all w-full sm:w-auto shrink-0"
          >
            <FaCopy className="text-xs" /> Copy Tracked Link
          </button>
        </div>

        {customLeadName.trim() && (
          <p className="text-xs font-mono text-indigo-300 bg-slate-900/60 p-2.5 rounded border border-indigo-500/20 break-all">
            Target Link: {typeof window !== 'undefined' ? window.location.origin : 'https://dawoodrana.com'}/?name={encodeURIComponent(customLeadName.trim())}
          </p>
        )}
      </div>

      {/* Identified Visitors & Named Leads */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FaUserCheck className="text-emerald-400" /> Identified Named Visitors & Clients
          </h3>
          <span className="rounded bg-emerald-500/10 text-emerald-300 px-2 py-0.5 text-xs font-mono font-bold">
            {(data?.identifiedVisitors || []).length} Named Visitors
          </span>
        </div>

        {(!data?.identifiedVisitors || data.identifiedVisitors.length === 0) ? (
          <p className="text-xs text-slate-400 py-3">
            No named visitors yet. Share a personalized link above or wait for visitors to send a note via the Contact form to see them here!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-700 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Visitor Name</th>
                  <th className="py-2.5 px-3">Total Visits</th>
                  <th className="py-2.5 px-3">Device / Hardware</th>
                  <th className="py-2.5 px-3">Origin Referrer</th>
                  <th className="py-2.5 px-3 text-right">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium">
                {data.identifiedVisitors.map((v, i) => (
                  <tr key={v.name || i} className="hover:bg-slate-700/30">
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <FaUser className="text-[10px]" />
                      </span>
                      {v.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-slate-700 px-2 py-0.5 font-mono text-slate-200">
                        {v.visits} visits
                      </span>
                    </td>
                    <td className="py-2.5 px-3 capitalize text-slate-300">
                      {v.device} • {v.browser}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      via {v.referrer || 'Direct'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {formatTimeAgo(v.lastSeen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conversion Goals & Actions */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
          <FaCheckCircle className="text-emerald-400" /> Conversion Goals & High-Intent Actions
        </h3>
        {(!data?.events || data.events.length === 0) ? (
          <p className="text-xs text-slate-400">
            No goal conversion events logged yet in this time range (e.g., Resume Downloads, WhatsApp Chats, Contact Submissions).
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.events.map((evt) => (
              <div
                key={evt.type}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/60 p-3"
              >
                <span className="text-xs font-semibold capitalize text-slate-200">
                  {evt.type.replace(/_/g, ' ')}
                </span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400 font-mono">
                  {evt.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Activity Feed */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FaClock className="text-indigo-400" /> Real-Time Visitor Activity (Latest 20)
          </h3>
          <span className="rounded bg-slate-700 px-2 py-0.5 text-[11px] font-mono text-slate-300">
            Live Stream
          </span>
        </div>

        {(!data?.recentActivity || data.recentActivity.length === 0) ? (
          <p className="text-xs text-slate-400 py-4">No recent activity logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-700/60 overflow-x-auto">
            {data.recentActivity.map((event, idx) => (
              <div
                key={event._id || idx}
                className="flex items-center justify-between py-2.5 text-xs text-slate-300 gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="rounded bg-blue-500/10 text-blue-400 px-2 py-0.5 font-mono text-[11px] shrink-0 uppercase">
                    {event.type}
                  </span>

                  {event.visitorName ? (
                    <span className="rounded bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 text-xs flex items-center gap-1 shrink-0 border border-emerald-500/30">
                      <FaUser className="text-[10px]" /> {event.visitorName}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs flex items-center gap-1 shrink-0">
                      <FaUser className="text-[10px] text-slate-500" /> Guest
                    </span>
                  )}

                  <span className="font-semibold text-white truncate max-w-[180px]">
                    {event.path}
                  </span>
                  <span className="text-slate-400 truncate hidden sm:inline">
                    via {event.referrer || 'Direct'}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded bg-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300 hidden md:inline">
                    {event.browser} • {event.device}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {formatTimeAgo(event.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy & Settings Controls */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
          <FaShieldAlt className="text-emerald-400" /> Privacy & Telemetry Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/70 transition-colors">
            <div>
              <p className="text-sm font-semibold text-white">Enable Analytics Tracking</p>
              <p className="text-xs text-slate-400">Collects anonymous pageviews and goal events</p>
            </div>
            <input
              type="checkbox"
              checked={config.enabled}
              disabled={savingConfig}
              onChange={(e) => handleToggleSetting('enabled', e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/40 p-3 cursor-pointer hover:bg-slate-700/70 transition-colors">
            <div>
              <p className="text-sm font-semibold text-white">Respect Do-Not-Track (DNT)</p>
              <p className="text-xs text-slate-400">Obeys browser DNT and Global Privacy Control headers</p>
            </div>
            <input
              type="checkbox"
              checked={config.respectDnt}
              disabled={savingConfig}
              onChange={(e) => handleToggleSetting('respectDnt', e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleClearData}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <FaTrashAlt className="text-xs" /> Purge Analytics History
          </button>
        </div>
      </div>
    </div>
  );
}
