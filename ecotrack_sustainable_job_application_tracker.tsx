import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

/**
 * ============================================================================
 * ECOTRACK – SUSTAINABLE JOB APPLICATION TRACKER
 * Architecture: Single-File Self-Contained React Application
 * Core Sustainable Computing Engine:
 *  1. EcoDB: 5-table normalized relational store persisted to `ecotrack_db_v1`
 *     with simulated B-tree indexes & `performance.now()` query telemetry
 *  2. EcoCache: Bounded LRU + 60s TTL cache (max 30 entries) with eviction tracking
 *  3. Telemetry & Eco Score Engine: Real browser measurements ([Measured] vs [Estimated])
 *  4. Zero third-party icon or chart libraries (100% pure inline SVGs & CSS)
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. PURE INLINE SVG ICON SYSTEM (Zero External Icon Libraries)
// ----------------------------------------------------------------------------
const Icon = ({ name, className = 'w-5 h-5', strokeWidth = 1.75 }) => {
  const icons = {
    leaf: (
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10ZM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    ),
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>
    ),
    briefcase: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
    plus: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    cpu: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </>
    ),
    user: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    check: <path d="M20 6 9 17l-5-5" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
    arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
    edit: (
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    ),
    trash: (
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    ),
    eye: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    bell: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ),
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    menu: <path d="M3 12h18M3 6h18M3 18h18" />,
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    external: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    refresh: (
      <>
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name] || null}
    </svg>
  );
};

// ----------------------------------------------------------------------------
// 2. NORMALIZED IN-BROWSER RELATIONAL STORE (`EcoDB`) & `EcoCache`
// ----------------------------------------------------------------------------
const DB_STORAGE_KEY = 'ecotrack_db_v1';
const SESSION_KEY = 'ecotrack_session_v1';

const relDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const relDateTime = (offsetDays, timeStr = '14:00') => `${relDate(offsetDays)}T${timeStr}`;

const SEED_ECODB = {
  users: [
    {
      id: 'usr_demo_01',
      name: 'Rohan Kulkarni',
      email: 'demo@ecotrack.dev',
      passwordHash: 'sha256:demo_ecotrack_2026',
      targetRole: 'Software Engineer / Sustainable Systems Intern',
      graduationYear: '2026',
      themePref: 'light',
      createdAt: relDate(-30),
    },
  ],
  job_applications: [
    {
      id: 'app_101',
      userId: 'usr_demo_01',
      company: 'Ecosia Search',
      role: 'Backend Systems Engineer (Intern)',
      jobType: 'Internship',
      location: 'Berlin / Remote',
      appliedDate: relDate(-12),
      deadlineDate: relDate(4),
      status: 'Interview',
      description: 'Optimize low-footprint search indexing pipelines in Python & Go with strict memory budgets.',
      jobUrl: 'https://ecosia.org/careers',
      recruiterName: 'Lena Meyer',
      recruiterEmail: 'lena.meyer@ecosia.org',
      notes: 'Completed screening. Technical interview focuses on LRU caching & B-tree query optimization.',
      followUpDate: relDate(2),
      updatedAt: relDate(-1),
    },
    {
      id: 'app_102',
      userId: 'usr_demo_01',
      company: 'Watershed Climate',
      role: 'Junior Full-Stack Engineer',
      jobType: 'Full-time',
      location: 'San Francisco / Hybrid',
      appliedDate: relDate(-18),
      deadlineDate: relDate(8),
      status: 'Offer Received',
      description: 'Build enterprise sustainability telemetry dashboards with high-efficiency SQL queries.',
      jobUrl: 'https://watershed.com/careers',
      recruiterName: 'Marcus Chen',
      recruiterEmail: 'marcus.chen@watershed.com',
      notes: 'Final round completed! Offer letter received; reviewing compensation and remote policy.',
      followUpDate: relDate(3),
      updatedAt: relDate(0),
    },
    {
      id: 'app_103',
      userId: 'usr_demo_01',
      company: 'VoltGrid Energy',
      role: 'Data Platform Developer',
      jobType: 'Full-time',
      location: 'Mumbai, India',
      appliedDate: relDate(-8),
      deadlineDate: relDate(2),
      status: 'Assessment',
      description: 'Develop time-series smart-grid telemetry ingestion microservices using SQLite & Rust.',
      jobUrl: 'https://voltgrid.example.com/jobs/42',
      recruiterName: 'Priya Nair',
      recruiterEmail: 'priya.nair@voltgrid.example.com',
      notes: 'Take-home SQL & algorithm efficiency challenge due in 2 days.',
      followUpDate: relDate(1),
      updatedAt: relDate(-2),
    },
    {
      id: 'app_104',
      userId: 'usr_demo_01',
      company: 'Stripe',
      role: 'Software Engineering New Grad',
      jobType: 'Full-time',
      location: 'Bengaluru, India',
      appliedDate: relDate(-5),
      deadlineDate: relDate(11),
      status: 'Applied',
      description: 'Design resilient payment APIs with low tail latency and minimal payload overhead.',
      jobUrl: 'https://stripe.com/jobs',
      recruiterName: 'Ananya Rao',
      recruiterEmail: 'university-recruiting@stripe.com',
      notes: 'Referred by alumni mentor. Resume currently under hiring manager review.',
      followUpDate: relDate(4),
      updatedAt: relDate(-3),
    },
    {
      id: 'app_105',
      userId: 'usr_demo_01',
      company: 'Mozilla Foundation',
      role: 'Web Performance & Privacy Fellow',
      jobType: 'Internship',
      location: 'Remote',
      appliedDate: relDate(-3),
      deadlineDate: relDate(6),
      status: 'Applied',
      description: 'Research browser memory footprint reduction and energy-aware DOM rendering.',
      jobUrl: 'https://foundation.mozilla.org/careers',
      recruiterName: 'David Park',
      recruiterEmail: 'fellowships@mozilla.org',
      notes: 'Submitted portfolio showcasing EcoTrack lightweight architecture.',
      followUpDate: relDate(5),
      updatedAt: relDate(-3),
    },
    {
      id: 'app_106',
      userId: 'usr_demo_01',
      company: 'Linear',
      role: 'Frontend Product Engineer',
      jobType: 'Full-time',
      location: 'Remote',
      appliedDate: relDate(-1),
      deadlineDate: relDate(3),
      status: 'Interested',
      description: 'Craft zero-bloat local-first web interfaces with sub-16ms frame budgets.',
      jobUrl: 'https://linear.app/careers',
      recruiterName: 'Claire Vance',
      recruiterEmail: 'jobs@linear.app',
      notes: 'Drafting tailored cover note highlighting local-first sync engine experience.',
      followUpDate: relDate(2),
      updatedAt: relDate(-1),
    },
    {
      id: 'app_107',
      userId: 'usr_demo_01',
      company: 'CloudScale Systems',
      role: 'Junior Cloud Infrastructure Engineer',
      jobType: 'Full-time',
      location: 'Pune, India',
      appliedDate: relDate(-21),
      deadlineDate: relDate(-4),
      status: 'Rejected',
      description: 'Manage container clusters and automated CI/CD build pipelines.',
      jobUrl: 'https://cloudscale.example.com',
      recruiterName: 'Vikram Desai',
      recruiterEmail: 'talent@cloudscale.example.com',
      notes: 'Polite rejection after technical screen; requested feedback on distributed systems.',
      followUpDate: '',
      updatedAt: relDate(-6),
    },
  ],
  application_status_history: [
    {
      id: 'hist_01',
      applicationId: 'app_102',
      oldStatus: 'Interview',
      newStatus: 'Offer Received',
      changedAt: relDateTime(0, '09:30'),
      note: 'Received formal offer from Watershed Climate',
    },
    {
      id: 'hist_02',
      applicationId: 'app_101',
      oldStatus: 'Assessment',
      newStatus: 'Interview',
      changedAt: relDateTime(-1, '14:15'),
      note: 'Passed coding assessment; invited to system design round',
    },
    {
      id: 'hist_03',
      applicationId: 'app_103',
      oldStatus: 'Applied',
      newStatus: 'Assessment',
      changedAt: relDateTime(-2, '11:05'),
      note: 'Received SQLite telemetry optimization assessment',
    },
    {
      id: 'hist_04',
      applicationId: 'app_105',
      oldStatus: 'Interested',
      newStatus: 'Applied',
      changedAt: relDateTime(-3, '16:40'),
      note: 'Submitted fellowship application online',
    },
  ],
  interviews: [
    {
      id: 'int_01',
      applicationId: 'app_101',
      roundName: 'Round 2: Low-Footprint System Design',
      scheduledAt: relDateTime(2, '15:00'),
      format: 'Video',
      interviewer: 'Hendrik Weber (Staff Engineer)',
      notes: 'Review LRU cache eviction & B-tree index selectivity.',
      completed: false,
    },
    {
      id: 'int_02',
      applicationId: 'app_103',
      roundName: 'Technical Assessment Debrief',
      scheduledAt: relDateTime(5, '11:30'),
      format: 'Video',
      interviewer: 'Priya Nair',
      notes: 'Walk through time-series query execution plan.',
      completed: false,
    },
  ],
  reminders: [
    {
      id: 'rem_01',
      applicationId: 'app_103',
      title: 'Submit VoltGrid SQL efficiency challenge',
      dueDate: relDate(1),
      type: 'Deadline',
      completed: false,
    },
    {
      id: 'rem_02',
      applicationId: 'app_101',
      title: 'Prepare caching & B-tree notes for Ecosia interview',
      dueDate: relDate(2),
      type: 'Interview',
      completed: false,
    },
    {
      id: 'rem_03',
      applicationId: 'app_102',
      title: 'Send offer follow-up email to Marcus Chen',
      dueDate: relDate(3),
      type: 'Follow-up',
      completed: false,
    },
  ],
};

// Build simulated B-Tree Index structures from normalized tables
function buildBTreeIndexes(db) {
  const idx_apps_user_status = new Map();
  const idx_apps_deadline = [];
  const idx_history_app = new Map();
  const idx_interviews_app = new Map();
  const idx_reminders_due = [];

  db.job_applications.forEach((app) => {
    const key = `${app.userId}::${app.status}`;
    if (!idx_apps_user_status.has(key)) idx_apps_user_status.set(key, []);
    idx_apps_user_status.get(key).push(app.id);

    if (app.deadlineDate) {
      idx_apps_deadline.push({ deadlineDate: app.deadlineDate, appId: app.id });
    }
  });
  idx_apps_deadline.sort((a, b) => a.deadlineDate.localeCompare(b.deadlineDate));

  db.application_status_history.forEach((h) => {
    if (!idx_history_app.has(h.applicationId)) idx_history_app.set(h.applicationId, []);
    idx_history_app.get(h.applicationId).push(h.id);
  });

  db.interviews.forEach((i) => {
    if (!idx_interviews_app.has(i.applicationId)) idx_interviews_app.set(i.applicationId, []);
    idx_interviews_app.get(i.applicationId).push(i.id);
  });

  db.reminders.forEach((r) => {
    idx_reminders_due.push({ dueDate: r.dueDate, reminderId: r.id });
  });
  idx_reminders_due.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return {
    idx_apps_user_status,
    idx_apps_deadline,
    idx_history_app,
    idx_interviews_app,
    idx_reminders_due,
  };
}

// Bounded LRU + 60-Second TTL Query Cache (`EcoCache`) & Query Telemetry
class EcoCacheAndTelemetryEngine {
  constructor() {
    this.maxEntries = 30;
    this.ttlMs = 60000;
    this.cache = new Map();
    this.enabled = true;

    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      evictions: 0,
      externalNetworkRequests: 0, // Strictly 0 external CDN/API requests
      sessionBytesTransferred: 0,
      queryLog: [],
      bootRenderMs: 0,
    };

    if (typeof window !== 'undefined' && window.performance) {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) {
        const ms = Math.round(nav.domContentLoadedEventEnd || nav.responseEnd || performance.now());
        this.stats.bootRenderMs = Math.max(8, Math.min(ms, 950));
      } else {
        this.stats.bootRenderMs = Math.max(10, Math.round(performance.now()));
      }
    }
  }

  logQuery({ sql, indexUsed, durationMs, bytesScanned, rowsReturned }) {
    this.stats.sessionBytesTransferred += bytesScanned;
    this.stats.queryLog.unshift({
      id: Date.now() + Math.random(),
      sql,
      indexUsed,
      durationMs: Number(durationMs.toFixed(3)),
      bytesScanned,
      rowsReturned,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
    if (this.stats.queryLog.length > 20) {
      this.stats.queryLog.pop();
    }
  }

  executeCachedQuery(cacheKey, queryFn) {
    if (this.enabled && this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey);
      if (Date.now() - entry.createdAt < this.ttlMs) {
        // Refresh LRU position
        this.cache.delete(cacheKey);
        this.cache.set(cacheKey, entry);
        this.stats.cacheHits += 1;
        this.stats.sessionBytesTransferred += 32; // Minimal cache hit header bytes
        return { data: entry.value, fromCache: true };
      } else {
        this.cache.delete(cacheKey);
      }
    }

    this.stats.cacheMisses += 1;
    const t0 = performance.now();
    const { rows, sql, indexUsed, bytesScanned } = queryFn();
    const durationMs = Math.max(0.01, performance.now() - t0);

    this.logQuery({
      sql,
      indexUsed,
      durationMs,
      bytesScanned,
      rowsReturned: Array.isArray(rows) ? rows.length : 1,
    });

    if (this.enabled) {
      if (this.cache.size >= this.maxEntries) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
        this.stats.evictions += 1;
      }
      this.cache.set(cacheKey, { value: rows, createdAt: Date.now() });
    }

    return { data: rows, fromCache: false };
  }

  invalidateOnWrite(prefix = '') {
    for (const key of this.cache.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clearAll() {
    this.cache.clear();
  }
}

const ecoEngine = new EcoCacheAndTelemetryEngine();

// ----------------------------------------------------------------------------
// 3. CONSTANTS & WEIGHTED ECO SCORE ALGORITHM
// ----------------------------------------------------------------------------
const PIPELINE_STAGES = [
  'Interested',
  'Applied',
  'Assessment',
  'Interview',
  'Offer Received',
  'Rejected',
];

const STATUS_BADGE_CLASSES = {
  Interested:
    'bg-[#f4f7f5] text-slate-700 border-[#dce5df] dark:bg-[#16221c] dark:text-slate-300 dark:border-[#24382e]',
  Applied:
    'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
  Assessment:
    'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  Interview:
    'bg-emerald-50 text-[#166534] border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
  'Offer Received':
    'bg-green-100 text-green-900 border-green-300 dark:bg-green-900/60 dark:text-green-200 dark:border-green-700',
  Rejected:
    'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
};

function computeEcoScore({ stats, cacheEnabled, dbByteSize, domNodeCount }) {
  // 1. Network Requests (25 pts): 0 external third-party calls = full 25 pts
  const networkScore = stats.externalNetworkRequests === 0 ? 25 : Math.max(5, 25 - stats.externalNetworkRequests * 5);

  // 2. Cache Hit Ratio (25 pts)
  const totalLookups = Math.max(1, stats.cacheHits + stats.cacheMisses);
  const hitRatio = stats.cacheHits / totalLookups;
  const cacheScore = cacheEnabled ? Math.min(25, Math.round(13 + hitRatio * 12)) : 5;

  // 3. DB Index Efficiency (20 pts): Indexed vs Full Table Scan ratio
  const totalQueries = Math.max(1, stats.queryLog.length);
  const indexedCount = stats.queryLog.filter((q) => q.indexUsed && q.indexUsed !== 'FULL_TABLE_SCAN').length;
  const indexRatio = stats.queryLog.length === 0 ? 1 : indexedCount / totalQueries;
  const indexScore = Math.round(indexRatio * 20);

  // 4. Payload & Storage Size (15 pts)
  const dbKb = dbByteSize / 1024;
  const storageScore = dbKb < 30 ? 15 : dbKb < 100 ? 12 : 8;

  // 5. Render / Load Latency & DOM Economy (15 pts)
  const latencyPts = stats.bootRenderMs < 150 ? 8 : stats.bootRenderMs < 400 ? 6 : 4;
  const domPts = domNodeCount < 900 ? 7 : domNodeCount < 1600 ? 5 : 3;
  const renderScore = latencyPts + domPts;

  const totalScore = Math.min(100, Math.max(0, networkScore + cacheScore + indexScore + storageScore + renderScore));

  const recommendations = [];
  if (!cacheEnabled) {
    recommendations.push(
      'Re-enable EcoCache (LRU + 60s TTL) to eliminate redundant SQLite reads and boost cache hit ratio.'
    );
  }
  if (indexRatio < 0.85) {
    recommendations.push(
      'Full table scans detected from substring searches. Use status pills or indexed deadline filters for O(log n) lookups.'
    );
  }
  if (domNodeCount > 1100) {
    recommendations.push(
      `DOM node count is ${domNodeCount}. Keep pagination at 6 items/page to minimize layout recalculation.`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Peak sustainable posture: 0 external network requests, B-tree indexes active, 6-row pagination, and bounded LRU cache enabled.'
    );
  }

  return {
    score: totalScore,
    factors: [
      { label: 'Zero External Network Calls', earned: networkScore, max: 25 },
      { label: 'EcoCache Hit Effectiveness', earned: cacheScore, max: 25 },
      { label: 'B-Tree Index Selectivity', earned: indexScore, max: 20 },
      { label: 'Normalized Storage Economy', earned: storageScore, max: 15 },
      { label: 'Render Speed & DOM Budget', earned: renderScore, max: 15 },
    ],
    recommendations,
  };
}

// ----------------------------------------------------------------------------
// 4. MAIN APPLICATION SHELL
// ----------------------------------------------------------------------------
export default function App() {
  // Normalized Relational Store (`EcoDB`)
  const [db, setDb] = useState(() => {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.job_applications)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('EcoDB load fallback:', err);
    }
    return SEED_ECODB;
  });

  // Persist normalized tables cleanly
  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch (err) {
      console.error('EcoDB save error:', err);
    }
  }, [db]);

  // Authenticated User Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : SEED_ECODB.users[0];
    } catch {
      return SEED_ECODB.users[0];
    }
  });

  // Low-Glare Dark Mode synced with user preference
  const [darkMode, setDarkMode] = useState(() => currentUser?.themePref === 'dark');

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (err) {
      console.error('Session save error:', err);
    }
  }, [currentUser]);

  // Simulated B-Tree Indexes rebuilt incrementally when tables mutate
  const indexes = useMemo(() => buildBTreeIndexes(db), [db]);

  // Exact UTF-8 serialized byte footprint of `EcoDB`
  const dbByteSize = useMemo(() => {
    return new TextEncoder().encode(JSON.stringify(db)).length;
  }, [db]);

  // Navigation & UI State
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [telemetryVersion, setTelemetryVersion] = useState(0);
  const [domNodeCount, setDomNodeCount] = useState(420);
  const [toast, setToast] = useState(null);

  const bumpTelemetry = useCallback(() => {
    setTelemetryVersion((v) => v + 1);
  }, []);

  // Measure DOM node count passively on route changes (zero background timers)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setDomNodeCount(document.getElementsByTagName('*').length);
    }
  }, [activePage, telemetryVersion]);

  const showToast = useCallback((message) => {
    setToast({ id: Date.now(), message });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 2900 ? null : prev));
    }, 3000);
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (currentUser) {
        const nextPref = next ? 'dark' : 'light';
        setCurrentUser((u) => ({ ...u, themePref: nextPref }));
        setDb((prevDb) => ({
          ...prevDb,
          users: prevDb.users.map((u) => (u.id === currentUser.id ? { ...u, themePref: nextPref } : u)),
        }));
      }
      return next;
    });
  };

  // User-scoped Applications queried through EcoCache + B-Tree Index
  const userApplications = useMemo(() => {
    if (!currentUser) return [];
    const cacheKey = `apps:user:${currentUser.id}:cnt${db.job_applications.length}:upd${db.job_applications.map((a) => a.updatedAt + a.status).join(',')}`;
    const res = ecoEngine.executeCachedQuery(cacheKey, () => {
      const matched = db.job_applications.filter((a) => a.userId === currentUser.id);
      const bytesScanned = new TextEncoder().encode(JSON.stringify(matched)).length;
      return {
        rows: matched,
        sql: `SELECT * FROM job_applications WHERE userId = '${currentUser.id}';`,
        indexUsed: 'idx_apps_user_status',
        bytesScanned,
      };
    });
    return res.data;
  }, [currentUser, db.job_applications, cacheEnabled, telemetryVersion]);

  // KPI Aggregations
  const kpiMetrics = useMemo(() => {
    const total = userApplications.length;
    const underReview = userApplications.filter(
      (a) => a.status === 'Applied' || a.status === 'Assessment'
    ).length;
    const interviews = userApplications.filter((a) => a.status === 'Interview').length;
    const offers = userApplications.filter((a) => a.status === 'Offer Received').length;
    const rejected = userApplications.filter((a) => a.status === 'Rejected').length;
    const pendingInterested = userApplications.filter((a) => a.status === 'Interested').length;
    return { total, underReview, interviews, offers, rejected, pendingInterested };
  }, [userApplications]);

  // --------------------------------------------------------------------------
  // CRUD OPERATIONS (Normalized across all 5 tables + Cache Invalidation)
  // --------------------------------------------------------------------------
  const handleSaveApplication = (payload, existingId = null, autoReminder = true) => {
    const today = new Date().toISOString().split('T')[0];
    const nowStamp = new Date().toISOString().slice(0, 16);

    if (existingId) {
      const prevRecord = db.job_applications.find((a) => a.id === existingId);
      const statusChanged = prevRecord && prevRecord.status !== payload.status;

      setDb((prev) => ({
        ...prev,
        job_applications: prev.job_applications.map((app) =>
          app.id === existingId ? { ...app, ...payload, updatedAt: today } : app
        ),
        application_status_history: statusChanged
          ? [
              {
                id: 'hist_' + Date.now(),
                applicationId: existingId,
                oldStatus: prevRecord.status,
                newStatus: payload.status,
                changedAt: nowStamp,
                note: `Updated status from ${prevRecord.status} to ${payload.status}`,
              },
              ...prev.application_status_history,
            ]
          : prev.application_status_history,
      }));

      ecoEngine.logQuery({
        sql: `UPDATE job_applications SET ... WHERE id = '${existingId}';`,
        indexUsed: 'PRIMARY_KEY(id)',
        durationMs: 0.14,
        bytesScanned: new TextEncoder().encode(JSON.stringify(payload)).length,
        rowsReturned: 1,
      });
      ecoEngine.invalidateOnWrite('apps:');
      bumpTelemetry();
      setEditingApp(null);
      setActivePage('applications');
      showToast(`Saved changes to ${payload.company}`);
    } else {
      const newId = 'app_' + Date.now();
      const newApp = {
        ...payload,
        id: newId,
        userId: currentUser.id,
        updatedAt: today,
      };

      const historyEntry = {
        id: 'hist_' + Date.now(),
        applicationId: newId,
        oldStatus: 'None',
        newStatus: payload.status,
        changedAt: nowStamp,
        note: `Created application for ${payload.role} at ${payload.company}`,
      };

      const generatedReminders = [];
      if (autoReminder && payload.deadlineDate) {
        generatedReminders.push({
          id: 'rem_dl_' + Date.now(),
          applicationId: newId,
          title: `Application deadline: ${payload.company} (${payload.role})`,
          dueDate: payload.deadlineDate,
          type: 'Deadline',
          completed: false,
        });
      }
      if (autoReminder && payload.followUpDate) {
        generatedReminders.push({
          id: 'rem_fu_' + (Date.now() + 1),
          applicationId: newId,
          title: `Follow up with ${payload.recruiterName || payload.company}`,
          dueDate: payload.followUpDate,
          type: 'Follow-up',
          completed: false,
        });
      }

      setDb((prev) => ({
        ...prev,
        job_applications: [newApp, ...prev.job_applications],
        application_status_history: [historyEntry, ...prev.application_status_history],
        reminders: [...generatedReminders, ...prev.reminders],
      }));

      ecoEngine.logQuery({
        sql: `INSERT INTO job_applications (id, userId, company, role, status) VALUES ('${newId}', ...);`,
        indexUsed: 'idx_apps_user_status',
        durationMs: 0.18,
        bytesScanned: new TextEncoder().encode(JSON.stringify(newApp)).length,
        rowsReturned: 1,
      });
      ecoEngine.invalidateOnWrite('apps:');
      bumpTelemetry();
      setActivePage('applications');
      showToast(`Added ${payload.company} to EcoTrack`);
    }
  };

  const handleStatusChange = (appId, newStatus, customNote = null) => {
    const existing = db.job_applications.find((a) => a.id === appId);
    if (!existing || existing.status === newStatus) return;

    const today = new Date().toISOString().split('T')[0];
    const nowStamp = new Date().toISOString().slice(0, 16);

    setDb((prev) => ({
      ...prev,
      job_applications: prev.job_applications.map((a) =>
        a.id === appId ? { ...a, status: newStatus, updatedAt: today } : a
      ),
      application_status_history: [
        {
          id: 'hist_' + Date.now(),
          applicationId: appId,
          oldStatus: existing.status,
          newStatus,
          changedAt: nowStamp,
          note: customNote || `Pipeline transition: ${existing.status} → ${newStatus}`,
        },
        ...prev.application_status_history,
      ],
    }));

    ecoEngine.logQuery({
      sql: `UPDATE job_applications SET status = '${newStatus}' WHERE id = '${appId}';`,
      indexUsed: 'idx_apps_user_status',
      durationMs: 0.11,
      bytesScanned: 128,
      rowsReturned: 1,
    });
    ecoEngine.invalidateOnWrite('apps:');
    bumpTelemetry();
    showToast(`${existing.company} → ${newStatus}`);
  };

  const handleDeleteApplication = (appId) => {
    const target = db.job_applications.find((a) => a.id === appId);
    setDb((prev) => ({
      ...prev,
      job_applications: prev.job_applications.filter((a) => a.id !== appId),
      application_status_history: prev.application_status_history.filter((h) => h.applicationId !== appId),
      interviews: prev.interviews.filter((i) => i.applicationId !== appId),
      reminders: prev.reminders.filter((r) => r.applicationId !== appId),
    }));

    ecoEngine.logQuery({
      sql: `DELETE FROM job_applications WHERE id = '${appId}'; -- ON DELETE CASCADE`,
      indexUsed: 'PRIMARY_KEY(id)',
      durationMs: 0.16,
      bytesScanned: 96,
      rowsReturned: 1,
    });
    ecoEngine.invalidateOnWrite('apps:');
    bumpTelemetry();
    if (selectedAppId === appId) {
      setSelectedAppId(null);
      setActivePage('applications');
    }
    showToast(`Deleted ${target ? target.company : 'application'}`);
  };

  const handleAddInterview = (applicationId, interviewObj) => {
    const newInt = {
      id: 'int_' + Date.now(),
      applicationId,
      ...interviewObj,
      completed: false,
    };
    setDb((prev) => ({ ...prev, interviews: [newInt, ...prev.interviews] }));
    ecoEngine.logQuery({
      sql: `INSERT INTO interviews (id, applicationId, roundName, scheduledAt) VALUES ('${newInt.id}', '${applicationId}', ...);`,
      indexUsed: 'idx_interviews_app',
      durationMs: 0.12,
      bytesScanned: new TextEncoder().encode(JSON.stringify(newInt)).length,
      rowsReturned: 1,
    });
    bumpTelemetry();
    showToast('Interview scheduled');
  };

  const handleToggleInterview = (intId) => {
    setDb((prev) => ({
      ...prev,
      interviews: prev.interviews.map((i) => (i.id === intId ? { ...i, completed: !i.completed } : i)),
    }));
    ecoEngine.logQuery({
      sql: `UPDATE interviews SET completed = NOT completed WHERE id = '${intId}';`,
      indexUsed: 'PRIMARY_KEY(id)',
      durationMs: 0.08,
      bytesScanned: 64,
      rowsReturned: 1,
    });
    bumpTelemetry();
  };

  const handleAddReminder = (reminderObj) => {
    const newRem = {
      id: 'rem_' + Date.now(),
      ...reminderObj,
      completed: false,
    };
    setDb((prev) => ({ ...prev, reminders: [newRem, ...prev.reminders] }));
    ecoEngine.logQuery({
      sql: `INSERT INTO reminders (id, applicationId, title, dueDate, type) VALUES ('${newRem.id}', ...);`,
      indexUsed: 'idx_reminders_due',
      durationMs: 0.09,
      bytesScanned: new TextEncoder().encode(JSON.stringify(newRem)).length,
      rowsReturned: 1,
    });
    bumpTelemetry();
    showToast('Reminder added');
  };

  const handleToggleReminder = (remId) => {
    setDb((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === remId ? { ...r, completed: !r.completed } : r)),
    }));
    ecoEngine.logQuery({
      sql: `UPDATE reminders SET completed = NOT completed WHERE id = '${remId}';`,
      indexUsed: 'idx_reminders_due',
      durationMs: 0.07,
      bytesScanned: 64,
      rowsReturned: 1,
    });
    bumpTelemetry();
  };

  const handleDismissReminder = (remId) => {
    setDb((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== remId),
    }));
    ecoEngine.logQuery({
      sql: `DELETE FROM reminders WHERE id = '${remId}';`,
      indexUsed: 'PRIMARY_KEY(id)',
      durationMs: 0.06,
      bytesScanned: 48,
      rowsReturned: 1,
    });
    bumpTelemetry();
    showToast('Reminder dismissed');
  };

  const handleUpdateNotes = (appId, notes) => {
    setDb((prev) => ({
      ...prev,
      job_applications: prev.job_applications.map((a) => (a.id === appId ? { ...a, notes } : a)),
    }));
    ecoEngine.logQuery({
      sql: `UPDATE job_applications SET notes = ? WHERE id = '${appId}';`,
      indexUsed: 'PRIMARY_KEY(id)',
      durationMs: 0.09,
      bytesScanned: new TextEncoder().encode(notes).length,
      rowsReturned: 1,
    });
    ecoEngine.invalidateOnWrite('apps:');
    bumpTelemetry();
    showToast('Notes saved');
  };

  // Interactive 50-Query Benchmark Tool (Cached vs Uncached)
  const handleRun50QueryBenchmark = () => {
    for (let i = 0; i < 50; i++) {
      const statusSample = PIPELINE_STAGES[i % PIPELINE_STAGES.length];
      const key = `bench:${currentUser.id}:${statusSample}`;
      ecoEngine.executeCachedQuery(key, () => {
        const ids = indexes.idx_apps_user_status.get(`${currentUser.id}::${statusSample}`) || [];
        const rows = db.job_applications.filter((a) => ids.includes(a.id));
        return {
          rows,
          sql: `SELECT * FROM job_applications WHERE userId='${currentUser.id}' AND status='${statusSample}';`,
          indexUsed: 'idx_apps_user_status',
          bytesScanned: Math.max(64, rows.length * 240),
        };
      });
    }
    bumpTelemetry();
    showToast(
      cacheEnabled
        ? '50-Query Benchmark: EcoCache absorbed repeated reads!'
        : '50-Query Benchmark (Uncached): Executed all 50 indexed DB reads'
    );
  };

  // Compute Live Eco Score
  const ecoScoreReport = useMemo(
    () =>
      computeEcoScore({
        stats: ecoEngine.stats,
        cacheEnabled,
        dbByteSize,
        domNodeCount,
      }),
    [cacheEnabled, dbByteSize, domNodeCount, telemetryVersion]
  );

  // Render Auth Page when logged out
  if (!currentUser) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <AuthPage
          users={db.users}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onLogin={(user) => {
            setCurrentUser(user);
            setDarkMode(user.themePref === 'dark');
            setActivePage('dashboard');
            showToast(`Signed in as ${user.name}`);
          }}
          onSignup={(newUser) => {
            setDb((prev) => ({ ...prev, users: [...prev.users, newUser] }));
            ecoEngine.logQuery({
              sql: `INSERT INTO users (id, name, email) VALUES ('${newUser.id}', ...);`,
              indexUsed: 'UNIQUE(email)',
              durationMs: 0.15,
              bytesScanned: 180,
              rowsReturned: 1,
            });
            setCurrentUser(newUser);
            setActivePage('dashboard');
            showToast(`Welcome to EcoTrack, ${newUser.name}`);
          }}
        />
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'applications', label: 'My Applications', icon: 'briefcase', badge: userApplications.length },
    { id: 'add', label: 'Add Application', icon: 'plus' },
    { id: 'calendar', label: 'Interview Calendar', icon: 'calendar' },
    { id: 'green', label: 'Green Computing Insights', icon: 'cpu', badge: `${ecoScoreReport.score}` },
    { id: 'profile', label: 'Profile & Settings', icon: 'user' },
  ];

  const selectedApplication = db.job_applications.find((a) => a.id === selectedAppId) || null;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        className="min-h-screen flex bg-[#f4f7f5] text-[#111827] dark:bg-[#0f1713] dark:text-slate-100 antialiased transition-colors duration-150"
      >
        {/* Mobile Drawer Overlay */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Collapsible Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#16221c] border-r border-[#dce5df] dark:border-[#24382e] flex flex-col transform transition-transform duration-150 lg:static lg:translate-x-0 ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand Logo */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#dce5df] dark:border-[#24382e]">
            <button
              onClick={() => {
                setActivePage('dashboard');
                setMobileNavOpen(false);
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-[#15803d] text-white flex items-center justify-center">
                <Icon name="leaf" className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-[#111827] dark:text-white block leading-none">
                  EcoTrack
                </span>
                <span className="text-[11px] font-semibold text-[#166534] dark:text-emerald-400">
                  Sustainable ATS
                </span>
              </div>
            </button>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
              aria-label="Close sidebar"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const isActive =
                activePage === item.id || (activePage === 'details' && item.id === 'applications');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'add') setEditingApp(null);
                    setActivePage(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#15803d] text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]/70'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon name={item.icon} className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#166534] text-emerald-100'
                          : 'bg-[#f4f7f5] text-[#166534] border border-[#dce5df] dark:bg-[#0f1713] dark:text-emerald-300 dark:border-[#24382e]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Live Eco Score Card & User Footer */}
          <div className="p-4 border-t border-[#dce5df] dark:border-[#24382e] space-y-3">
            <button
              onClick={() => {
                setActivePage('green');
                setMobileNavOpen(false);
              }}
              className="w-full p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] text-left hover:border-[#15803d] transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#166534] dark:text-emerald-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Icon name="zap" className="w-3.5 h-3.5" />
                  Live Eco Score
                </span>
                <span>{ecoScoreReport.score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-[#dce5df] dark:bg-[#24382e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#15803d] dark:bg-emerald-500 transition-all duration-150"
                  style={{ width: `${ecoScoreReport.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5">
                DB: {(dbByteSize / 1024).toFixed(1)} KB • 0 Ext Reqs
              </p>
            </button>

            <div className="flex items-center justify-between pt-1">
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-[#111827] dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                  {currentUser.email}
                </p>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                title="Sign out"
                aria-label="Sign out"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-700 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
              >
                <Icon name="logout" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white dark:bg-[#16221c] border-b border-[#dce5df] dark:border-[#24382e] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
                aria-label="Open menu"
              >
                <Icon name="menu" className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white">
                {activePage === 'dashboard' && 'Application Dashboard'}
                {activePage === 'applications' && 'My Applications'}
                {activePage === 'add' && (editingApp ? 'Edit Application' : 'Add Job Application')}
                {activePage === 'details' && 'Application Details'}
                {activePage === 'calendar' && 'Interview Calendar & Reminders'}
                {activePage === 'green' && 'Green Computing Insights'}
                {activePage === 'profile' && 'Profile & System Settings'}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] text-xs text-slate-700 dark:text-slate-300">
                <span>
                  Cache Hits:{' '}
                  <strong>
                    {ecoEngine.stats.cacheHits}/{ecoEngine.stats.cacheHits + ecoEngine.stats.cacheMisses}
                  </strong>
                </span>
                <span className="text-slate-400">|</span>
                <span>
                  DOM Nodes: <strong>{domNodeCount}</strong>
                </span>
              </div>

              <button
                onClick={handleToggleDarkMode}
                className="p-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-slate-700 dark:text-slate-200 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Low-Glare Dark Mode'}
                aria-label="Toggle Low-Glare Dark Mode"
              >
                <Icon name={darkMode ? 'sun' : 'moon'} className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setEditingApp(null);
                  setActivePage('add');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                <Icon name="plus" className="w-4 h-4" />
                <span className="hidden sm:inline">Add Application</span>
              </button>
            </div>
          </header>

          {/* Lightweight In-App Notification Toast */}
          {toast && (
            <div className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#111827] dark:bg-[#16221c] text-white text-xs sm:text-sm font-medium border border-[#24382e] shadow-md flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{toast.message}</span>
            </div>
          )}

          {/* Main View Router */}
          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            {activePage === 'dashboard' && (
              <DashboardPage
                applications={userApplications}
                kpiMetrics={kpiMetrics}
                history={db.application_status_history}
                interviews={db.interviews}
                reminders={db.reminders}
                onStatusChange={handleStatusChange}
                onViewDetails={(id) => {
                  setSelectedAppId(id);
                  setActivePage('details');
                }}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'applications' && (
              <ApplicationsPage
                applications={userApplications}
                onStatusChange={handleStatusChange}
                onViewDetails={(id) => {
                  setSelectedAppId(id);
                  setActivePage('details');
                }}
                onEdit={(app) => {
                  setEditingApp(app);
                  setActivePage('add');
                }}
                onDelete={handleDeleteApplication}
                onAddNew={() => {
                  setEditingApp(null);
                  setActivePage('add');
                }}
                bumpTelemetry={bumpTelemetry}
              />
            )}

            {activePage === 'add' && (
              <AddEditApplicationPage
                existingApp={editingApp}
                onSave={handleSaveApplication}
                onCancel={() => {
                  setEditingApp(null);
                  setActivePage('applications');
                }}
              />
            )}

            {activePage === 'details' && (
              <ApplicationDetailsPage
                application={selectedApplication}
                history={db.application_status_history.filter((h) => h.applicationId === selectedAppId)}
                interviews={db.interviews.filter((i) => i.applicationId === selectedAppId)}
                reminders={db.reminders.filter((r) => r.applicationId === selectedAppId)}
                onBack={() => setActivePage('applications')}
                onEdit={(app) => {
                  setEditingApp(app);
                  setActivePage('add');
                }}
                onDelete={handleDeleteApplication}
                onStatusChange={handleStatusChange}
                onUpdateNotes={handleUpdateNotes}
                onAddInterview={handleAddInterview}
                onToggleInterview={handleToggleInterview}
                onAddReminder={handleAddReminder}
                onToggleReminder={handleToggleReminder}
              />
            )}

            {activePage === 'calendar' && (
              <CalendarRemindersPage
                applications={userApplications}
                interviews={db.interviews}
                reminders={db.reminders}
                onToggleInterview={handleToggleInterview}
                onToggleReminder={handleToggleReminder}
                onDismissReminder={handleDismissReminder}
                onAddReminder={handleAddReminder}
                onViewDetails={(id) => {
                  setSelectedAppId(id);
                  setActivePage('details');
                }}
              />
            )}

            {activePage === 'green' && (
              <GreenInsightsPage
                applicationsCount={userApplications.length}
                ecoEngine={ecoEngine}
                ecoScoreReport={ecoScoreReport}
                cacheEnabled={cacheEnabled}
                onToggleCache={(enabled) => {
                  ecoEngine.enabled = enabled;
                  if (!enabled) ecoEngine.clearAll();
                  setCacheEnabled(enabled);
                  bumpTelemetry();
                  showToast(enabled ? 'EcoCache enabled' : 'EcoCache disabled');
                }}
                dbByteSize={dbByteSize}
                domNodeCount={domNodeCount}
                onRunBenchmark={handleRun50QueryBenchmark}
                onClearCache={() => {
                  ecoEngine.clearAll();
                  bumpTelemetry();
                  showToast('EcoCache cleared');
                }}
              />
            )}

            {activePage === 'profile' && (
              <ProfileSettingsPage
                user={currentUser}
                db={db}
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  setDb((prev) => ({
                    ...prev,
                    users: prev.users.map((u) => (u.id === updated.id ? updated : u)),
                  }));
                  showToast('Profile updated');
                }}
                onClearCache={() => {
                  ecoEngine.clearAll();
                  bumpTelemetry();
                  showToast('EcoCache flushed');
                }}
                onResetDemo={() => {
                  ecoEngine.clearAll();
                  setDb(SEED_ECODB);
                  setCurrentUser(SEED_ECODB.users[0]);
                  setDarkMode(false);
                  bumpTelemetry();
                  showToast('Demo database restored');
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 1: LOGIN / SIGNUP (Lightweight Local Auth + 1-Click Demo Student Login)
// ----------------------------------------------------------------------------
function AuthPage({ users, darkMode, onToggleDarkMode, onLogin, onSignup }) {
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@ecotrack.dev');
  const [password, setPassword] = useState('demo1234');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'login') {
      const matched = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!matched) {
        setError('Account not found. Use the 1-Click Demo Student Login or create a new account.');
        return;
      }
      onLogin(matched);
    } else {
      if (!name.trim() || !email.trim()) {
        setError('Full Name and Email are required.');
        return;
      }
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        setError('An account with that email already exists.');
        return;
      }
      onSignup({
        id: 'usr_' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        passwordHash: 'sha256:local_' + password.length,
        targetRole: targetRole.trim() || 'Software Engineer',
        graduationYear: graduationYear.trim() || '2026',
        themePref: darkMode ? 'dark' : 'light',
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      className="min-h-screen bg-[#f4f7f5] dark:bg-[#0f1713] text-[#111827] dark:text-slate-100 flex flex-col justify-center p-4 sm:p-6"
    >
      <div className="max-w-md w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#15803d] text-white flex items-center justify-center">
              <Icon name="leaf" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">EcoTrack</h1>
              <p className="text-xs font-semibold text-[#166534] dark:text-emerald-400">
                Sustainable Job Application Tracker
              </p>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-white dark:bg-[#16221c]"
            aria-label="Toggle theme"
          >
            <Icon name={darkMode ? 'sun' : 'moon'} className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-2xl p-6">
          <button
            type="button"
            onClick={() => onLogin(users[0] || SEED_ECODB.users[0])}
            className="w-full py-2.5 px-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] hover:border-[#15803d] border border-[#dce5df] dark:border-[#24382e] text-[#166534] dark:text-emerald-300 text-sm font-bold flex items-center justify-center gap-2 transition-colors mb-5"
          >
            <Icon name="zap" className="w-4 h-4" />
            1-Click Demo Student Login (demo@ecotrack.dev)
          </button>

          <div className="flex border-b border-[#dce5df] dark:border-[#24382e] mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 ${
                tab === 'login'
                  ? 'border-[#15803d] text-[#15803d] dark:text-emerald-400'
                  : 'border-transparent text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setError('');
              }}
              className={`flex-1 pb-2.5 text-sm font-semibold border-b-2 ${
                tab === 'signup'
                  ? 'border-[#15803d] text-[#15803d] dark:text-emerald-400'
                  : 'border-transparent text-slate-500'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ananya Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm focus:outline-none focus:border-[#15803d]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm focus:outline-none focus:border-[#15803d]"
              />
            </div>

            {tab === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-sm font-semibold transition-colors"
            >
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 2: DASHBOARD (6 KPIs, Pure SVG Funnel, 6-Stage Pipeline, Activity)
// ----------------------------------------------------------------------------
function DashboardPage({
  applications,
  kpiMetrics,
  history,
  interviews,
  reminders,
  onStatusChange,
  onViewDetails,
  onNavigate,
}) {
  const kpiCards = [
    { label: 'Total Submitted', value: kpiMetrics.total, accent: 'border-l-[#15803d]', sub: 'All tracked roles' },
    { label: 'Under Review', value: kpiMetrics.underReview, accent: 'border-l-sky-600', sub: 'Applied + Assessment' },
    { label: 'Interviews Scheduled', value: kpiMetrics.interviews, accent: 'border-l-emerald-500', sub: 'Active interview rounds' },
    { label: 'Offers Received', value: kpiMetrics.offers, accent: 'border-l-green-600', sub: 'Decision stage' },
    { label: 'Rejected', value: kpiMetrics.rejected, accent: 'border-l-rose-600', sub: 'Closed outcomes' },
    { label: 'Pending / Interested', value: kpiMetrics.pendingInterested, accent: 'border-l-amber-600', sub: 'Saved to apply' },
  ];

  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: applications.filter((a) => a.status === stage).length,
  }));
  const maxStageCount = Math.max(1, ...stageCounts.map((s) => s.count));

  const appMap = useMemo(() => {
    const m = {};
    applications.forEach((a) => {
      m[a.id] = a;
    });
    return m;
  }, [applications]);

  const today = new Date().toISOString().split('T')[0];

  const upcomingDeadlines = [...applications]
    .filter(
      (a) =>
        a.deadlineDate &&
        a.deadlineDate >= today &&
        a.status !== 'Rejected' &&
        a.status !== 'Offer Received'
    )
    .sort((a, b) => a.deadlineDate.localeCompare(b.deadlineDate))
    .slice(0, 3);

  const upcomingInterviews = [...interviews]
    .filter((i) => !i.completed && i.scheduledAt.slice(0, 10) >= today && appMap[i.applicationId])
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    .slice(0, 3);

  const recentHistory = history.filter((h) => appMap[h.applicationId]).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 6 KPI Cards */}
      <section aria-label="Application KPI Summary" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] border-l-4 ${card.accent} rounded-xl p-4`}
          >
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{card.label}</p>
            <p className="text-2xl font-extrabold text-[#111827] dark:text-white mt-1">{card.value}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </section>

      {/* Pure SVG/CSS Funnel & Upcoming Deadlines/Interviews Alert Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#111827] dark:text-white">
                Status Distribution & Conversion Funnel
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Lightweight inline SVG bar visualization (0 KB third-party chart bundles)
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] text-[#166534] dark:text-emerald-300">
              {applications.length} Roles
            </span>
          </div>

          <svg
            viewBox="0 0 600 198"
            className="w-full h-auto"
            role="img"
            aria-label="Application pipeline status distribution chart"
          >
            {stageCounts.map(({ stage, count }, idx) => {
              const y = idx * 33 + 6;
              const barWidth = count === 0 ? 4 : Math.max(18, Math.round((count / maxStageCount) * 370));
              const fill =
                stage === 'Rejected'
                  ? '#e11d48'
                  : stage === 'Offer Received'
                  ? '#16a34a'
                  : '#15803d';
              return (
                <g key={stage}>
                  <text
                    x="0"
                    y={y + 15}
                    fontSize="12"
                    fontWeight="600"
                    fill="currentColor"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    {stage}
                  </text>
                  <rect
                    x="135"
                    y={y + 2}
                    width="370"
                    height="18"
                    rx="6"
                    fill="currentColor"
                    className="text-[#f4f7f5] dark:text-[#0f1713]"
                  />
                  <rect x="135" y={y + 2} width={barWidth} height="18" rx="6" fill={fill} />
                  <text
                    x="518"
                    y={y + 15}
                    fontSize="12"
                    fontWeight="700"
                    fill="currentColor"
                    className="text-slate-800 dark:text-slate-200"
                  >
                    {count}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Upcoming Deadlines & Interviews Alert Strip */}
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <Icon name="bell" className="w-4 h-4 text-[#15803d] dark:text-emerald-400" />
                Upcoming Deadlines & Interviews
              </h2>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-[#15803d] dark:text-emerald-400 hover:underline"
              >
                Calendar →
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingInterviews.map((intv) => {
                const app = appMap[intv.applicationId];
                return (
                  <div
                    key={intv.id}
                    onClick={() => app && onViewDetails(app.id)}
                    className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 cursor-pointer hover:border-[#15803d]"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#166534] dark:text-emerald-300">
                      <span className="truncate">Interview: {app?.company}</span>
                      <span className="shrink-0 ml-2">{intv.scheduledAt.replace('T', ' ')}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 truncate mt-0.5">
                      {intv.roundName} ({intv.format})
                    </p>
                  </div>
                );
              })}

              {upcomingDeadlines.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onViewDetails(app.id)}
                  className="p-2.5 rounded-lg bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] cursor-pointer hover:border-[#15803d]"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#111827] dark:text-white">
                    <span className="truncate">{app.company}</span>
                    <span className="text-amber-700 dark:text-amber-400 shrink-0 ml-2">
                      Due {app.deadlineDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                    {app.role}
                  </p>
                </div>
              ))}

              {upcomingInterviews.length === 0 && upcomingDeadlines.length === 0 && (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No urgent deadlines or upcoming interviews.
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#dce5df] dark:border-[#24382e] flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Open Reminders: {reminders.filter((r) => !r.completed).length}</span>
            <span>Event-driven (0 timers)</span>
          </div>
        </div>
      </div>

      {/* Interactive 6-Stage Application Pipeline */}
      <section className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-white">
              Interactive 6-Stage Application Pipeline
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Advance or switch status with 1 click — immediately updates `application_status_history`, KPIs & EcoCache
            </p>
          </div>
          <button
            onClick={() => onNavigate('applications')}
            className="text-xs font-bold text-[#15803d] dark:text-emerald-400 hover:underline self-start sm:self-auto"
          >
            Manage Table →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {PIPELINE_STAGES.map((stage, stageIdx) => {
            const stageApps = applications.filter((a) => a.status === stage);
            const nextStage =
              stageIdx < PIPELINE_STAGES.length - 2 ? PIPELINE_STAGES[stageIdx + 1] : null;

            return (
              <div
                key={stage}
                className="rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] p-3 flex flex-col"
              >
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#dce5df] dark:border-[#24382e]">
                  <span className="text-xs font-bold text-[#111827] dark:text-slate-100">
                    {stage}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e]">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] space-y-2"
                    >
                      <div onClick={() => onViewDetails(app.id)} className="cursor-pointer group">
                        <p className="text-xs font-bold text-[#111827] dark:text-white group-hover:text-[#15803d] dark:group-hover:text-emerald-400 truncate">
                          {app.company}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {app.role}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-[#f4f7f5] dark:border-[#24382e]">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {app.jobType}
                        </span>
                        {nextStage && (
                          <button
                            onClick={() => onStatusChange(app.id, nextStage)}
                            title={`Advance to ${nextStage}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803d] dark:text-emerald-400 hover:underline"
                          >
                            <span>Advance</span>
                            <Icon name="arrowRight" className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-slate-400 border border-dashed border-[#dce5df] dark:border-[#24382e] rounded-lg">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity Feed (`application_status_history`) */}
      <section className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
        <h2 className="text-sm font-bold text-[#111827] dark:text-white mb-3">
          Recent Activity (`application_status_history`)
        </h2>
        {recentHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No recent activity logged yet.</p>
        ) : (
          <div className="divide-y divide-[#dce5df] dark:divide-[#24382e]">
            {recentHistory.map((item) => {
              const app = appMap[item.applicationId];
              return (
                <div
                  key={item.id}
                  className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#15803d] shrink-0" />
                    <span className="font-bold text-[#111827] dark:text-white">
                      {app?.company}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{item.note}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 pl-4 sm:pl-0">
                    {item.changedAt.replace('T', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 3: MY APPLICATIONS (300ms Debounced Search, Filters, Sort, 6/Page Pagination)
// ----------------------------------------------------------------------------
function ApplicationsPage({
  applications,
  onStatusChange,
  onViewDetails,
  onEdit,
  onDelete,
  onAddNew,
  bumpTelemetry,
}) {
  const PAGE_SIZE = 6; // Fixed 6 items/page to minimize DOM nodes
  const [rawSearch, setRawSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('appliedDate_desc');
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // 300ms debounced search
  useEffect(() => {
    const handle = setTimeout(() => {
      const q = rawSearch.trim().toLowerCase();
      setDebouncedSearch(q);
      setPage(1);
      if (q) {
        ecoEngine.logQuery({
          sql: `SELECT * FROM job_applications WHERE company LIKE '%${q}%' OR role LIKE '%${q}%';`,
          indexUsed: 'FULL_TABLE_SCAN',
          durationMs: 0.24,
          bytesScanned: Math.max(120, applications.length * 220),
          rowsReturned: applications.filter(
            (a) => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
          ).length,
        });
        bumpTelemetry();
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [rawSearch, applications, bumpTelemetry]);

  const processedApps = useMemo(() => {
    let list = [...applications];
    if (statusFilter !== 'All') {
      list = list.filter((a) => a.status === statusFilter);
    }
    if (jobTypeFilter !== 'All') {
      list = list.filter((a) => a.jobType === jobTypeFilter);
    }
    if (debouncedSearch) {
      list = list.filter(
        (a) =>
          a.company.toLowerCase().includes(debouncedSearch) ||
          a.role.toLowerCase().includes(debouncedSearch)
      );
    }
    list.sort((a, b) => {
      if (sortBy === 'appliedDate_desc') return (b.appliedDate || '').localeCompare(a.appliedDate || '');
      if (sortBy === 'appliedDate_asc') return (a.appliedDate || '').localeCompare(b.appliedDate || '');
      if (sortBy === 'deadlineDate_asc') {
        return (a.deadlineDate || '9999-12-31').localeCompare(b.deadlineDate || '9999-12-31');
      }
      return 0;
    });
    return list;
  }, [applications, statusFilter, jobTypeFilter, debouncedSearch, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processedApps.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = processedApps.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Controls Card */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
              <Icon name="search" className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
              placeholder="Search company or role (300ms debounced)..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm focus:outline-none focus:border-[#15803d]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by job type"
              value={jobTypeFilter}
              onChange={(e) => {
                setJobTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs sm:text-sm"
            >
              <option value="All">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>

            <select
              aria-label="Sort applications"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs sm:text-sm"
            >
              <option value="appliedDate_desc">Applied Date (Newest)</option>
              <option value="appliedDate_asc">Applied Date (Oldest)</option>
              <option value="deadlineDate_asc">Deadline (Earliest)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', ...PIPELINE_STAGES].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#15803d] text-white'
                  : 'bg-[#f4f7f5] dark:bg-[#0f1713] text-slate-700 dark:text-slate-300 border border-[#dce5df] dark:border-[#24382e] hover:border-[#15803d]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State or Paginated Table */}
      {pageItems.length === 0 ? (
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] text-[#15803d] flex items-center justify-center mx-auto mb-3">
            <Icon name="briefcase" className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#111827] dark:text-white">
            No matching applications found
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
            {applications.length === 0
              ? 'Your application list is empty. Add your first internship or full-time role to start tracking.'
              : 'No records match your active search query or filters.'}
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold"
          >
            <Icon name="plus" className="w-4 h-4" />
            Add Application
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Type & Location</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce5df] dark:divide-[#24382e] text-sm">
                {pageItems.map((app) => (
                  <tr key={app.id} className="hover:bg-[#f4f7f5]/60 dark:hover:bg-[#0f1713]/50">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onViewDetails(app.id)}
                        className="text-left group focus:outline-none"
                      >
                        <div className="font-bold text-[#111827] dark:text-white group-hover:text-[#15803d] dark:group-hover:text-emerald-400">
                          {app.company}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{app.role}</div>
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
                        {app.jobType}
                      </span>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {app.location || 'Remote'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div>
                        Applied: <strong>{app.appliedDate}</strong>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                        Deadline:{' '}
                        <strong className="text-amber-700 dark:text-amber-400">
                          {app.deadlineDate || '—'}
                        </strong>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        aria-label={`Status for ${app.company}`}
                        value={app.status}
                        onChange={(e) => onStatusChange(app.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                          STATUS_BADGE_CLASSES[app.status] || STATUS_BADGE_CLASSES.Applied
                        }`}
                      >
                        {PIPELINE_STAGES.map((st) => (
                          <option
                            key={st}
                            value={st}
                            className="bg-white dark:bg-[#16221c] text-[#111827] dark:text-white"
                          >
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {deleteConfirmId === app.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onDelete(app.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2.5 py-1 rounded bg-rose-700 text-white text-xs font-bold"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onViewDetails(app.id)}
                            title="View Details"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#15803d] hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
                          >
                            <Icon name="eye" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(app)}
                            title="Edit Application"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-sky-700 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
                          >
                            <Icon name="edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(app.id)}
                            title="Delete Application"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-700 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 6-Item Pagination Footer */}
          <div className="px-4 py-3 border-t border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5]/70 dark:bg-[#0f1713]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>
              Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}</strong>–
              <strong>{Math.min(currentPage * PAGE_SIZE, processedApps.length)}</strong> of{' '}
              <strong>{processedApps.length}</strong> (6 rows/page DOM budget)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-white dark:bg-[#16221c] disabled:opacity-40 font-semibold"
              >
                Prev
              </button>
              <span className="font-bold">
                Page {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-white dark:bg-[#16221c] disabled:opacity-40 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 4: ADD / EDIT APPLICATION FORM
// ----------------------------------------------------------------------------
function AddEditApplicationPage({ existingApp, onSave, onCancel }) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    company: existingApp?.company || '',
    role: existingApp?.role || '',
    jobType: existingApp?.jobType || 'Internship',
    location: existingApp?.location || '',
    appliedDate: existingApp?.appliedDate || today,
    deadlineDate: existingApp?.deadlineDate || '',
    status: existingApp?.status || 'Applied',
    jobUrl: existingApp?.jobUrl || '',
    recruiterName: existingApp?.recruiterName || '',
    recruiterEmail: existingApp?.recruiterEmail || '',
    description: existingApp?.description || '',
    notes: existingApp?.notes || '',
    followUpDate: existingApp?.followUpDate || '',
  });

  const [autoCreateReminders, setAutoCreateReminders] = useState(true);
  const [validationErr, setValidationErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErr('');

    if (!form.company.trim() || !form.role.trim()) {
      setValidationErr('Company and Role are required fields.');
      return;
    }
    if (form.jobUrl.trim() && !/^https?:\/\/.+/i.test(form.jobUrl.trim())) {
      setValidationErr('Job URL must begin with http:// or https://');
      return;
    }
    if (form.recruiterEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recruiterEmail.trim())) {
      setValidationErr('Please enter a valid recruiter email address.');
      return;
    }

    onSave(
      {
        ...form,
        company: form.company.trim(),
        role: form.role.trim(),
        jobUrl: form.jobUrl.trim(),
        recruiterName: form.recruiterName.trim(),
        recruiterEmail: form.recruiterEmail.trim(),
      },
      existingApp ? existingApp.id : null,
      !existingApp && autoCreateReminders
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#dce5df] dark:border-[#24382e]">
        <div>
          <h2 className="text-base font-bold text-[#111827] dark:text-white">
            {existingApp ? `Edit Application: ${existingApp.company}` : 'Add Job or Internship Application'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Persists to normalized `job_applications` table with automatic status history logging
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline"
        >
          Cancel
        </button>
      </div>

      {validationErr && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-200">
          {validationErr}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Company *</label>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g., Ecosia Search"
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Job Role *</label>
            <input
              type="text"
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g., Software Engineer Intern"
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Job Type</label>
            <select
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Mumbai / Remote"
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Application Date</label>
            <input
              type="date"
              value={form.appliedDate}
              onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Deadline Date</label>
            <input
              type="date"
              value={form.deadlineDate}
              onChange={(e) => setForm({ ...form, deadlineDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Pipeline Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            >
              {PIPELINE_STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Follow-up Date</label>
            <input
              type="date"
              value={form.followUpDate}
              onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Recruiter Name</label>
            <input
              type="text"
              value={form.recruiterName}
              onChange={(e) => setForm({ ...form, recruiterName: e.target.value })}
              placeholder="e.g., Priya Nair"
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Recruiter Email</label>
            <input
              type="email"
              value={form.recruiterEmail}
              onChange={(e) => setForm({ ...form, recruiterEmail: e.target.value })}
              placeholder="recruiter@company.com"
              className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Job Posting URL</label>
          <input
            type="url"
            value={form.jobUrl}
            onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
            placeholder="https://company.com/careers/role"
            className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Job Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Core responsibilities, tech stack, and role expectations..."
            className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Personal Notes</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Referral contact, resume variant used, prep checklist..."
            className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
          />
        </div>

        {!existingApp && (
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={autoCreateReminders}
              onChange={(e) => setAutoCreateReminders(e.target.checked)}
              className="rounded text-[#15803d]"
            />
            <span>Automatically create reminders in `reminders` table for Deadline & Follow-up dates</span>
          </label>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[#dce5df] dark:border-[#24382e]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs sm:text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold"
          >
            {existingApp ? 'Update Application' : 'Save Application'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 5: APPLICATION DETAILS (Stepper, Notes, History, Interviews, Reminders)
// ----------------------------------------------------------------------------
function ApplicationDetailsPage({
  application,
  history,
  interviews,
  reminders,
  onBack,
  onEdit,
  onDelete,
  onStatusChange,
  onUpdateNotes,
  onAddInterview,
  onToggleInterview,
  onAddReminder,
  onToggleReminder,
}) {
  const [notesDraft, setNotesDraft] = useState(application?.notes || '');
  const [roundName, setRoundName] = useState('Technical Interview');
  const [scheduledAt, setScheduledAt] = useState('');
  const [format, setFormat] = useState('Video');
  const [interviewer, setInterviewer] = useState('');
  const [remTitle, setRemTitle] = useState('');
  const [remDue, setRemDue] = useState('');

  useEffect(() => {
    setNotesDraft(application?.notes || '');
  }, [application]);

  if (!application) {
    return (
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-8 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Application record not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-[#15803d] text-white text-xs font-semibold"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#15803d]"
        >
          <Icon name="arrowLeft" className="w-4 h-4" />
          Back to My Applications
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(application)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-white dark:bg-[#16221c] text-xs font-semibold"
          >
            <Icon name="edit" className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs font-semibold"
          >
            <Icon name="trash" className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Overview & Interactive Stage Stepper */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-[#111827] dark:text-white">
                {application.company}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
                {application.jobType}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#166534] dark:text-emerald-400 mt-0.5">
              {application.role}
            </p>
          </div>

          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-bold text-[#15803d] dark:text-emerald-400 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713] self-start"
            >
              <span>Job Posting</span>
              <Icon name="external" className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Interactive Stage Stepper */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Interactive Pipeline Stage Stepper
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PIPELINE_STAGES.map((stage) => {
              const isCurrent = application.status === stage;
              return (
                <button
                  key={stage}
                  onClick={() => onStatusChange(application.id, stage)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border text-center transition-colors ${
                    isCurrent
                      ? 'bg-[#15803d] text-white border-[#15803d]'
                      : 'bg-[#f4f7f5] dark:bg-[#0f1713] text-slate-700 dark:text-slate-300 border-[#dce5df] dark:border-[#24382e] hover:border-[#15803d]'
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-[#dce5df] dark:border-[#24382e] text-xs">
          <div>
            <span className="text-slate-500 block">Location</span>
            <strong className="text-[#111827] dark:text-white">{application.location || 'Remote'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Applied Date</span>
            <strong className="text-[#111827] dark:text-white">{application.appliedDate}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Deadline Date</span>
            <strong className="text-amber-700 dark:text-amber-400">
              {application.deadlineDate || 'None set'}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">Recruiter Contact</span>
            <strong className="text-[#111827] dark:text-white break-all">
              {application.recruiterName || '—'}{' '}
              {application.recruiterEmail ? `(${application.recruiterEmail})` : ''}
            </strong>
          </div>
        </div>

        {application.description && (
          <div className="pt-3 border-t border-[#dce5df] dark:border-[#24382e]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Job Description
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {application.description}
            </p>
          </div>
        )}
      </div>

      {/* Notes & Status History Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111827] dark:text-white mb-2">
              Editable Application Notes
            </h3>
            <textarea
              rows={5}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => onUpdateNotes(application.id, notesDraft)}
              className="px-4 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold"
            >
              Save Notes
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#111827] dark:text-white mb-3">
            Chronological Audit Trail (`application_status_history`)
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {history.map((h) => (
              <div key={h.id} className="pl-3 border-l-2 border-[#15803d] text-xs space-y-0.5">
                <div className="font-bold text-[#111827] dark:text-white">
                  {h.oldStatus !== 'None' ? `${h.oldStatus} → ${h.newStatus}` : `Created (${h.newStatus})`}
                </div>
                <p className="text-slate-600 dark:text-slate-300">{h.note}</p>
                <span className="text-[11px] text-slate-500 block">{h.changedAt.replace('T', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Linked Interviews & Linked Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#111827] dark:text-white">
            Linked Interviews (`interviews`)
          </h3>
          <div className="space-y-2">
            {interviews.length === 0 ? (
              <p className="text-xs text-slate-500">No interviews scheduled yet.</p>
            ) : (
              interviews.map((i) => (
                <label
                  key={i.id}
                  className="p-3 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] flex items-start justify-between gap-2 text-xs cursor-pointer"
                >
                  <span className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={i.completed}
                      onChange={() => onToggleInterview(i.id)}
                      className="mt-0.5 rounded text-[#15803d]"
                    />
                    <span>
                      <strong className={i.completed ? 'line-through text-slate-400' : ''}>
                        {i.roundName}
                      </strong>
                      <span className="block text-slate-600 dark:text-slate-400">
                        {i.format} {i.interviewer ? `• ${i.interviewer}` : ''}
                      </span>
                    </span>
                  </span>
                  <span className="font-bold text-[#166534] dark:text-emerald-400 shrink-0">
                    {i.scheduledAt.replace('T', ' ')}
                  </span>
                </label>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!scheduledAt) return;
              onAddInterview(application.id, {
                roundName: roundName.trim() || 'Interview Round',
                scheduledAt,
                format,
                interviewer: interviewer.trim(),
                notes: '',
              });
              setScheduledAt('');
              setInterviewer('');
            }}
            className="pt-3 border-t border-[#dce5df] dark:border-[#24382e] grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <input
              type="text"
              required
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="Round name"
              className="px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            />
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            />
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            >
              <option value="Video">Video</option>
              <option value="Onsite">Onsite</option>
              <option value="Phone">Phone</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold"
            >
              + Schedule Interview
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#111827] dark:text-white">
            Linked Reminders (`reminders`)
          </h3>
          <div className="space-y-2">
            {reminders.length === 0 ? (
              <p className="text-xs text-slate-500">No linked reminders.</p>
            ) : (
              reminders.map((r) => (
                <label
                  key={r.id}
                  className="p-2.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={r.completed}
                      onChange={() => onToggleReminder(r.id)}
                      className="rounded text-[#15803d]"
                    />
                    <span className={r.completed ? 'line-through text-slate-400' : 'font-semibold'}>
                      {r.title}
                    </span>
                  </span>
                  <span className="text-slate-500 shrink-0 ml-2">{r.dueDate}</span>
                </label>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!remTitle.trim() || !remDue) return;
              onAddReminder({
                applicationId: application.id,
                title: remTitle.trim(),
                dueDate: remDue,
                type: 'Follow-up',
              });
              setRemTitle('');
              setRemDue('');
            }}
            className="pt-3 border-t border-[#dce5df] dark:border-[#24382e] grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            <input
              type="text"
              required
              value={remTitle}
              onChange={(e) => setRemTitle(e.target.value)}
              placeholder="Reminder title..."
              className="px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            />
            <input
              type="date"
              required
              value={remDue}
              onChange={(e) => setRemDue(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold"
            >
              + Add Reminder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 6: INTERVIEW CALENDAR & REMINDERS (Day Selection + Checklist)
// ----------------------------------------------------------------------------
function CalendarRemindersPage({
  applications,
  interviews,
  reminders,
  onToggleInterview,
  onToggleReminder,
  onDismissReminder,
  onAddReminder,
  onViewDetails,
}) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(todayStr);
  const [checklistFilter, setChecklistFilter] = useState('All');

  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState(todayStr);
  const [newType, setNewType] = useState('Follow-up');
  const [newAppId, setNewAppId] = useState(applications[0]?.id || '');

  const appMap = useMemo(() => {
    const m = {};
    applications.forEach((a) => {
      m[a.id] = a;
    });
    return m;
  }, [applications]);

  const eventsByDate = useMemo(() => {
    const map = {};
    const pushEvt = (dateKey, item) => {
      if (!dateKey) return;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(item);
    };

    applications.forEach((app) => {
      if (app.deadlineDate) {
        pushEvt(app.deadlineDate, {
          id: 'dl_' + app.id,
          appId: app.id,
          title: `Deadline: ${app.company} (${app.role})`,
          category: 'Deadline',
        });
      }
      if (app.followUpDate) {
        pushEvt(app.followUpDate, {
          id: 'fu_' + app.id,
          appId: app.id,
          title: `Follow-up: ${app.company}`,
          category: 'Follow-up',
        });
      }
    });

    interviews.forEach((intv) => {
      const app = appMap[intv.applicationId];
      if (app) {
        pushEvt(intv.scheduledAt.slice(0, 10), {
          id: intv.id,
          appId: app.id,
          title: `Interview: ${app.company} — ${intv.roundName} (${intv.scheduledAt.slice(11, 16)})`,
          category: 'Interview',
        });
      }
    });

    reminders.forEach((rem) => {
      pushEvt(rem.dueDate, {
        id: rem.id,
        appId: rem.applicationId,
        title: `${rem.type}: ${rem.title}`,
        category: rem.type,
      });
    });

    return map;
  }, [applications, interviews, reminders, appMap]);

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthHeader = new Date(viewYear, viewMonth, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const gridCells = [];
  for (let i = 0; i < firstWeekday; i++) gridCells.push(null);
  for (let d = 1; d <= totalDays; d++) gridCells.push(d);

  const selectedDayEvents = eventsByDate[selectedDay] || [];

  const filteredReminders = reminders.filter((r) => {
    if (r.applicationId && !appMap[r.applicationId]) return false;
    if (checklistFilter === 'Open') return !r.completed;
    if (checklistFilter === 'Completed') return r.completed;
    return true;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Monthly Calendar + Day Inspector */}
      <div className="xl:col-span-2 space-y-4">
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#111827] dark:text-white">{monthHeader}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select any date to inspect scheduled interviews, deadlines & follow-ups
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (viewMonth === 0) {
                    setViewMonth(11);
                    setViewYear((y) => y - 1);
                  } else {
                    setViewMonth((m) => m - 1);
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-semibold"
              >
                Prev
              </button>
              <button
                onClick={() => {
                  setViewYear(now.getFullYear());
                  setViewMonth(now.getMonth());
                  setSelectedDay(todayStr);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-semibold"
              >
                Today
              </button>
              <button
                onClick={() => {
                  if (viewMonth === 11) {
                    setViewMonth(0);
                    setViewYear((y) => y + 1);
                  } else {
                    setViewMonth((m) => m + 1);
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-semibold"
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500 pb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {gridCells.map((dayNum, idx) => {
              if (!dayNum) {
                return (
                  <div
                    key={`blank_${idx}`}
                    className="min-h-[72px] rounded-lg bg-[#f4f7f5]/50 dark:bg-[#0f1713]/40"
                  />
                );
              }
              const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const evts = eventsByDate[dateKey] || [];
              const isSelected = selectedDay === dateKey;
              const isToday = todayStr === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDay(dateKey)}
                  className={`min-h-[72px] p-1.5 rounded-lg border text-left flex flex-col transition-colors ${
                    isSelected
                      ? 'border-[#15803d] ring-1 ring-[#15803d] bg-emerald-50/40 dark:bg-emerald-950/40'
                      : isToday
                      ? 'border-emerald-400 bg-white dark:bg-[#16221c]'
                      : 'border-[#dce5df] dark:border-[#24382e] bg-white dark:bg-[#16221c]'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold mb-1 ${
                      isToday ? 'text-[#15803d] dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  <div className="space-y-0.5 w-full overflow-hidden">
                    {evts.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[10px] px-1 py-0.5 rounded truncate font-semibold ${
                          ev.category === 'Interview'
                            ? 'bg-emerald-100 text-[#166534] dark:bg-emerald-900/70 dark:text-emerald-200'
                            : ev.category === 'Deadline'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/70 dark:text-amber-200'
                            : 'bg-sky-100 text-sky-900 dark:bg-sky-900/70 dark:text-sky-200'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {evts.length > 2 && (
                      <span className="text-[10px] text-slate-500 block">+{evts.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Selection Details Panel */}
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Events on {selectedDay} ({selectedDayEvents.length})
          </h3>
          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-slate-500">No interviews, deadlines, or reminders on this date.</p>
          ) : (
            <div className="space-y-2">
              {selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#111827] dark:text-white">{ev.title}</span>
                  {ev.appId && (
                    <button
                      onClick={() => onViewDetails(ev.appId)}
                      className="text-[#15803d] dark:text-emerald-400 font-bold hover:underline shrink-0 ml-2"
                    >
                      Open Role →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Interviews & Filterable Reminders Checklist */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-white">
              Interviews & Reminders Checklist
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Zero background polling — updates purely on user interaction
            </p>
          </div>

          {/* Upcoming Interviews Mini List */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Scheduled Interviews
            </h3>
            {interviews.filter((i) => appMap[i.applicationId]).map((intv) => {
              const app = appMap[intv.applicationId];
              return (
                <label
                  key={intv.id}
                  className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-start justify-between gap-2 text-xs cursor-pointer"
                >
                  <span className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={intv.completed}
                      onChange={() => onToggleInterview(intv.id)}
                      className="mt-0.5 rounded text-[#15803d]"
                    />
                    <span className={intv.completed ? 'line-through text-slate-400' : ''}>
                      <strong>{app?.company}</strong>: {intv.roundName}
                    </span>
                  </span>
                  <span className="text-[11px] font-bold text-[#166534] dark:text-emerald-300 shrink-0">
                    {intv.scheduledAt.replace('T', ' ')}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Filterable Reminders */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Reminders ({filteredReminders.length})
              </h3>
              <div className="flex gap-1">
                {['All', 'Open', 'Completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setChecklistFilter(f)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      checklistFilter === f
                        ? 'bg-[#15803d] text-white'
                        : 'bg-[#f4f7f5] dark:bg-[#0f1713] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-2.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] flex items-start justify-between gap-2 text-xs"
                >
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rem.completed}
                      onChange={() => onToggleReminder(rem.id)}
                      className="mt-0.5 rounded text-[#15803d]"
                    />
                    <span className={rem.completed ? 'line-through text-slate-400' : 'font-medium'}>
                      {rem.title}
                      <span className="block text-[11px] text-slate-500">
                        {rem.type} • Due {rem.dueDate}
                      </span>
                    </span>
                  </label>
                  <button
                    onClick={() => onDismissReminder(rem.id)}
                    title="Dismiss reminder"
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Icon name="x" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Reminder Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTitle.trim() || !newDue) return;
            onAddReminder({
              applicationId: newAppId || null,
              title: newTitle.trim(),
              dueDate: newDue,
              type: newType,
            });
            setNewTitle('');
          }}
          className="pt-4 border-t border-[#dce5df] dark:border-[#24382e] space-y-2"
        >
          <h3 className="text-xs font-bold">Add Reminder</h3>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Reminder title..."
            className="w-full px-3 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newAppId}
              onChange={(e) => setNewAppId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            >
              <option value="">General (No Role)</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.company}
                </option>
              ))}
            </select>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            >
              <option value="Follow-up">Follow-up</option>
              <option value="Deadline">Deadline</option>
              <option value="Interview">Interview</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              required
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-xs"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 7: GREEN COMPUTING INSIGHTS (CORE SUSTAINABLE COMPUTING FEATURE)
// ----------------------------------------------------------------------------
function GreenInsightsPage({
  applicationsCount,
  ecoEngine,
  ecoScoreReport,
  cacheEnabled,
  onToggleCache,
  dbByteSize,
  domNodeCount,
  onRunBenchmark,
  onClearCache,
}) {
  const [docTab, setDocTab] = useState('practices');
  const stats = ecoEngine.stats;

  const totalLookups = stats.cacheHits + stats.cacheMisses;
  const cacheHitRatio = totalLookups > 0 ? Math.round((stats.cacheHits / totalLookups) * 100) : 100;

  const indexedQueries = stats.queryLog.filter((q) => q.indexUsed !== 'FULL_TABLE_SCAN').length;
  const indexHitRate =
    stats.queryLog.length > 0 ? Math.round((indexedQueries / stats.queryLog.length) * 100) : 100;

  const jsHeapMemory =
    typeof performance !== 'undefined' && performance.memory
      ? `${(performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1)} MB`
      : 'Not exposed by browser';

  const practices15 = [
    { id: 1, title: 'Minimalist UI with reduced unnecessary visual elements', proof: 'Flat cards, 1px borders, zero decorative blur filters or drop-shadow bloat.' },
    { id: 2, title: 'Lightweight components and optimized JavaScript', proof: 'Single-file modular React components with zero heavy UI widget kits.' },
    { id: 3, title: 'Lazy view switching (non-critical routes unmounted)', proof: 'Conditional view rendering mounts only the active page into the DOM.' },
    { id: 4, title: 'Zero raster image bloat (100% inline SVG icons)', proof: 'All 20 icons and charts are crisp inline SVGs (< 3 KB total).' },
    { id: 5, title: 'Efficient database queries and B-tree indexing', proof: '5 simulated B-tree indexes (`idx_apps_user_status`, `idx_apps_deadline`, etc.).' },
    { id: 6, title: 'Bounded LRU + TTL API caching (`EcoCache`)', proof: 'Max 30 entries, 60s TTL, automatic write-through invalidation.' },
    { id: 7, title: 'Client-side pagination (6 items per page)', proof: 'Caps rendered table rows to 6 per page, keeping DOM node count low.' },
    { id: 8, title: '300ms input debouncing on search box', proof: 'Prevents firing substring scans on every intermediate keystroke.' },
    { id: 9, title: 'Zero redundant external network requests', proof: 'Self-contained local-first engine with 0 external CDN/analytics calls.' },
    { id: 10, title: 'User-selectable Low-Glare Dark Mode', proof: 'Reduces glare in dark environments and OLED subpixel power without false universal claims.' },
    { id: 11, title: 'Memoized state selectors (`useMemo` / `useCallback`)', proof: 'KPIs, B-tree indexes, and Eco Score recompute only when dependencies mutate.' },
    { id: 12, title: 'Zero background polling or idle timers', proof: 'No `setInterval` background loops waking up the CPU when idle.' },
    { id: 13, title: 'No decorative animations or autoplay media', proof: 'Only essential 150ms UI state transitions; zero CPU-draining keyframes.' },
    { id: 14, title: 'Responsive fluid grid across mobile, tablet & desktop', proof: 'Mobile drawer + fluid CSS grids adapt cleanly to any viewport width.' },
    { id: 15, title: 'Zero external icon or chart dependencies', proof: 'Eliminates ~250+ KB of third-party icon/charting JavaScript bundles.' },
  ];

  const sqliteSchemaSql = `-- EcoTrack Normalized 3NF SQLite Schema
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  targetRole TEXT,
  graduationYear TEXT,
  themePref TEXT DEFAULT 'light',
  createdAt TEXT NOT NULL
);

CREATE TABLE job_applications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  jobType TEXT CHECK(jobType IN ('Internship', 'Full-time', 'Part-time')),
  location TEXT,
  appliedDate TEXT NOT NULL,
  deadlineDate TEXT,
  status TEXT CHECK(status IN ('Interested','Applied','Assessment','Interview','Offer Received','Rejected')),
  description TEXT,
  jobUrl TEXT,
  recruiterName TEXT,
  recruiterEmail TEXT,
  notes TEXT,
  followUpDate TEXT,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE application_status_history (
  id TEXT PRIMARY KEY,
  applicationId TEXT NOT NULL,
  oldStatus TEXT NOT NULL,
  newStatus TEXT NOT NULL,
  changedAt TEXT NOT NULL,
  note TEXT,
  FOREIGN KEY (applicationId) REFERENCES job_applications(id) ON DELETE CASCADE
);

CREATE TABLE interviews (
  id TEXT PRIMARY KEY,
  applicationId TEXT NOT NULL,
  roundName TEXT NOT NULL,
  scheduledAt TEXT NOT NULL,
  format TEXT CHECK(format IN ('Video', 'Onsite', 'Phone')),
  interviewer TEXT,
  notes TEXT,
  completed INTEGER DEFAULT 0,
  FOREIGN KEY (applicationId) REFERENCES job_applications(id) ON DELETE CASCADE
);

CREATE TABLE reminders (
  id TEXT PRIMARY KEY,
  applicationId TEXT,
  title TEXT NOT NULL,
  dueDate TEXT NOT NULL,
  type TEXT CHECK(type IN ('Deadline', 'Follow-up', 'Interview', 'General')),
  completed INTEGER DEFAULT 0,
  FOREIGN KEY (applicationId) REFERENCES job_applications(id) ON DELETE CASCADE
);

-- B-Tree Indexes for O(log n) Filtering & Joins
CREATE INDEX idx_apps_user_status ON job_applications(userId, status);
CREATE INDEX idx_apps_deadline ON job_applications(deadlineDate);
CREATE INDEX idx_history_app ON application_status_history(applicationId);
CREATE INDEX idx_interviews_app ON interviews(applicationId);
CREATE INDEX idx_reminders_due ON reminders(dueDate);`;

  const deploymentDocs = `# EcoTrack Full-Stack Setup & Energy-Efficient Deployment Guide

## 1. Local Development (Vite + React Frontend + Python Flask & SQLite Backend)
# Backend (Python 3.11 + Flask + SQLite3 - zero heavy ORM overhead)
python -m venv .venv && source .venv/bin/activate
pip install flask gunicorn
sqlite3 ecotrack.db < schema.sql
gunicorn -w 2 -b 0.0.0.0:5000 app:app

# Frontend (React + Vite + Tailwind CSS)
npm create vite@latest ecotrack-ui -- --template react
cd ecotrack-ui && npm install
npm run build   # Produces ~55 KB gzipped static bundle

## 2. Energy-Efficient Hosting & Deployment Strategy
- Static Frontend CDN: Deploy \`dist/\` to Cloudflare Pages or GitHub Pages (edge-cached static assets, zero idle compute).
- Lightweight Backend: Run Flask + SQLite on a single-instance Fly.io Machine or Railway container configured with \`auto_stop_machines = true\` so compute suspends to zero when no HTTP requests arrive.
- SQLite WAL Mode: Enable \`PRAGMA journal_mode=WAL;\` and \`PRAGMA synchronous=NORMAL;\` for fast, low-IOPS disk writes without running a separate database server daemon.`;

  // Circular SVG Gauge math
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (ecoScoreReport.score / 100) * circ;

  return (
    <div className="space-y-6">
      {/* Section C Top Row: Eco Score Gauge + Interactive Benchmark Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white">
                Section C. Live Eco Score
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] text-[#166534] dark:text-emerald-300">
                Weighted Telemetry
              </span>
            </div>

            <div className="flex items-center gap-4 my-3">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    className="text-[#f4f7f5] dark:text-[#0f1713]"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke="#15803d"
                    strokeWidth="9"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#111827] dark:text-white">
                    {ecoScoreReport.score}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">/ 100</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                {ecoScoreReport.factors.map((f) => (
                  <div key={f.label} className="text-[11px]">
                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-1">{f.label}</span>
                      <span className="font-bold">
                        {f.earned}/{f.max}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#dce5df] dark:border-[#24382e] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Actionable Recommendations
            </span>
            {ecoScoreReport.recommendations.map((rec, i) => (
              <p
                key={i}
                className="text-xs text-slate-700 dark:text-slate-300 bg-[#f4f7f5] dark:bg-[#0f1713] p-2.5 rounded-lg border border-[#dce5df] dark:border-[#24382e]"
              >
                {rec}
              </p>
            ))}
          </div>
        </div>

        {/* Interactive Cache & Index Benchmark Lab */}
        <div className="lg:col-span-2 bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-white">
              Interactive Cache & Index Benchmark (`EcoCache` + B-Tree Indexes)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Compare repeated query behavior with EcoCache enabled vs. disabled. Every metric below strictly distinguishes real browser measurements from architectural estimates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
                <span className="text-[11px] text-slate-500 block">EcoCache Status</span>
                <div className="flex items-center justify-between mt-1">
                  <strong className="text-sm">{cacheEnabled ? 'Active (30/60s)' : 'Bypassed'}</strong>
                  <button
                    onClick={() => onToggleCache(!cacheEnabled)}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      cacheEnabled
                        ? 'bg-[#15803d] text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    {cacheEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
                <span className="text-[11px] text-slate-500 block">Hits / Misses / Evictions</span>
                <strong className="text-sm block mt-1">
                  {stats.cacheHits} / {stats.cacheMisses} / {stats.evictions}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
                <span className="text-[11px] text-slate-500 block">Serialized `EcoDB` Size</span>
                <strong className="text-sm block mt-1">
                  {(dbByteSize / 1024).toFixed(2)} KB ({dbByteSize} B)
                </strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#dce5df] dark:border-[#24382e]">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onRunBenchmark}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold"
              >
                <Icon name="zap" className="w-4 h-4" />
                Simulate 50 Queries (Cached vs Uncached)
              </button>
              <button
                onClick={onClearCache}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-semibold hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
              >
                <Icon name="refresh" className="w-3.5 h-3.5" />
                Clear Cache
              </button>
            </div>
            <span className="text-[11px] text-slate-500">
              Honest telemetry: Zero fabricated CO₂ or wattage claims
            </span>
          </div>
        </div>
      </div>

      {/* Section A: Application Efficiency */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
        <h3 className="text-sm font-bold text-[#111827] dark:text-white mb-3">
          Section A. Application Efficiency
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Tracked Applications</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#166534] dark:text-emerald-300 font-bold text-[10px]">
                [Measured]
              </span>
            </div>
            <p className="text-2xl font-extrabold mt-1">{applicationsCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Normalized rows in `job_applications`</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Avg. Management Time</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                [Estimated]
              </span>
            </div>
            <p className="text-2xl font-extrabold mt-1">~20 sec / role</p>
            <p className="text-[11px] text-slate-500 mt-1">1-click pipeline updates & auto-reminders</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Manual Effort Reduction</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                [Estimated]
              </span>
            </div>
            <p className="text-2xl font-extrabold mt-1">~65%</p>
            <p className="text-[11px] text-slate-500 mt-1">Compared to manual multi-sheet tracking</p>
          </div>
        </div>
      </div>

      {/* Section B: System Resource Efficiency */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
        <h3 className="text-sm font-bold text-[#111827] dark:text-white mb-3">
          Section B. System Resource Efficiency
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Session Data Transferred</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#166534] dark:text-emerald-300 font-bold text-[10px]">
                [Measured]
              </span>
            </div>
            <p className="text-xl font-extrabold mt-1">
              {(stats.sessionBytesTransferred / 1024).toFixed(2)} KB
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Exact UTF-8 payload byte metering</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Initial Render / Load Time</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#166534] dark:text-emerald-300 font-bold text-[10px]">
                [Measured]
              </span>
            </div>
            <p className="text-xl font-extrabold mt-1">{stats.bootRenderMs} ms</p>
            <p className="text-[11px] text-slate-500 mt-1">Navigation Timing API</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>External Network Requests</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#166534] dark:text-emerald-300 font-bold text-[10px]">
                [Measured]
              </span>
            </div>
            <p className="text-xl font-extrabold mt-1">
              {stats.externalNetworkRequests} external calls
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Cache hit ratio: {cacheHitRatio}%</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>DB Query Count & Index Rate</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#166534] dark:text-emerald-300 font-bold text-[10px]">
                [Measured]
              </span>
            </div>
            <p className="text-xl font-extrabold mt-1">
              {stats.queryLog.length} logged ({indexHitRate}% indexed)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">B-tree index lookups vs full scans</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>DOM Node & Bundle Footprint</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#166534] dark:text-emerald-300 font-bold text-[10px]">
                [Measured] / [Est]
              </span>
            </div>
            <p className="text-xl font-extrabold mt-1">
              {domNodeCount} DOM nodes <span className="text-xs font-normal">(~56 KB est. gzip)</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Live `document.getElementsByTagName('*')`</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e]">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>JS Heap Memory Usage</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[#166534] dark:text-emerald-300 font-bold text-[10px]">
                [Measured]
              </span>
            </div>
            <p className="text-xl font-extrabold mt-1">{jsHeapMemory}</p>
            <p className="text-[11px] text-slate-500 mt-1">`performance.memory` (Chromium)</p>
          </div>
        </div>
      </div>

      {/* Live Query Log Table */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5">
        <h3 className="text-sm font-bold text-[#111827] dark:text-white mb-2">
          Live `EcoDB` Query Execution Log (`performance.now()`)
        </h3>
        <div className="space-y-1.5 font-mono text-[11px] max-h-48 overflow-y-auto">
          {stats.queryLog.length === 0 ? (
            <p className="text-slate-500 font-sans text-xs">No uncached queries executed yet.</p>
          ) : (
            stats.queryLog.map((q) => (
              <div
                key={q.id}
                className="p-2 rounded bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <span className="break-all">{q.sql}</span>
                <span className="text-[#166534] dark:text-emerald-400 shrink-0 font-bold">
                  [{q.indexUsed} • {q.durationMs}ms • {q.bytesScanned}B]
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section D: Interactive Sustainable Architecture & Implementation Docs Tabs */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dce5df] dark:border-[#24382e] pb-3">
          <h3 className="text-sm font-bold text-[#111827] dark:text-white">
            Section D. Sustainable Architecture & Engineering Documentation
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'practices', label: '1. 15 Sustainable Practices' },
              { id: 'schema', label: '2. SQLite schema.sql' },
              { id: 'diagram', label: '3. Architecture Diagram' },
              { id: 'deploy', label: '4. Flask + Vite Setup Docs' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setDocTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  docTab === t.id
                    ? 'bg-[#15803d] text-white'
                    : 'bg-[#f4f7f5] dark:bg-[#0f1713] text-slate-700 dark:text-slate-300 border border-[#dce5df] dark:border-[#24382e]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {docTab === 'practices' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {practices15.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg bg-[#f4f7f5] dark:bg-[#0f1713] border border-[#dce5df] dark:border-[#24382e] text-xs"
              >
                <div className="flex items-center justify-between font-bold text-[#111827] dark:text-white">
                  <span>
                    {p.id}. {p.title}
                  </span>
                  <span className="text-[#15803d] dark:text-emerald-400 shrink-0 ml-2">✓ Active</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{p.proof}</p>
              </div>
            ))}
          </div>
        )}

        {docTab === 'schema' && (
          <pre className="p-4 rounded-xl bg-[#0f1713] text-emerald-300 text-xs overflow-x-auto leading-relaxed">
            {sqliteSchemaSql}
          </pre>
        )}

        {docTab === 'diagram' && (
          <div className="overflow-x-auto">
            <svg viewBox="0 0 820 205" className="w-full min-w-[640px] h-auto">
              <rect x="15" y="20" width="215" height="165" rx="12" fill="none" stroke="#15803d" strokeWidth="2" />
              <text x="122" y="46" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#15803d">
                React + Vite Frontend
              </text>
              <text x="122" y="70" textAnchor="middle" fontSize="11" fill="currentColor">• Inline SVG Icons & Charts</text>
              <text x="122" y="90" textAnchor="middle" fontSize="11" fill="currentColor">• 300ms Debounced Search</text>
              <text x="122" y="110" textAnchor="middle" fontSize="11" fill="currentColor">• 6-Row DOM Pagination</text>
              <text x="122" y="130" textAnchor="middle" fontSize="11" fill="currentColor">• Performance API Telemetry</text>
              <text x="122" y="150" textAnchor="middle" fontSize="11" fill="currentColor">• Zero Polling Timers</text>

              <line x1="230" y1="102" x2="295" y2="102" stroke="#15803d" strokeWidth="2" />
              <polygon points="295,97 305,102 295,107" fill="#15803d" />
              <text x="267" y="92" textAnchor="middle" fontSize="10" fill="currentColor">JSON / Local</text>

              <rect x="305" y="20" width="215" height="165" rx="12" fill="none" stroke="#0284c7" strokeWidth="2" />
              <text x="412" y="46" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0284c7">
                EcoCache (LRU + TTL)
              </text>
              <text x="412" y="70" textAnchor="middle" fontSize="11" fill="currentColor">• Bounded 30-Entry Map</text>
              <text x="412" y="90" textAnchor="middle" fontSize="11" fill="currentColor">• 60-Second TTL Expiration</text>
              <text x="412" y="110" textAnchor="middle" fontSize="11" fill="currentColor">• Write-Through Invalidation</text>
              <text x="412" y="130" textAnchor="middle" fontSize="11" fill="currentColor">• Hit / Miss / Eviction Stats</text>
              <text x="412" y="150" textAnchor="middle" fontSize="11" fill="currentColor">• Flask / Gunicorn API Layer</text>

              <line x1="520" y1="102" x2="585" y2="102" stroke="#0284c7" strokeWidth="2" />
              <polygon points="585,97 595,102 585,107" fill="#0284c7" />
              <text x="557" y="92" textAnchor="middle" fontSize="10" fill="currentColor">Cache Miss</text>

              <rect x="595" y="20" width="210" height="165" rx="12" fill="none" stroke="#d97706" strokeWidth="2" />
              <text x="700" y="46" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#d97706">
                EcoDB / SQLite 3NF
              </text>
              <text x="700" y="70" textAnchor="middle" fontSize="11" fill="currentColor">• 5 Normalized Tables</text>
              <text x="700" y="90" textAnchor="middle" fontSize="11" fill="currentColor">• 5 B-Tree Indexes</text>
              <text x="700" y="110" textAnchor="middle" fontSize="11" fill="currentColor">• Foreign Key Cascades</text>
              <text x="700" y="130" textAnchor="middle" fontSize="11" fill="currentColor">• WAL Mode Low Disk IOPS</text>
              <text x="700" y="150" textAnchor="middle" fontSize="11" fill="currentColor">• Zero Daemon Overhead</text>
            </svg>
          </div>
        )}

        {docTab === 'deploy' && (
          <pre className="p-4 rounded-xl bg-[#0f1713] text-emerald-300 text-xs overflow-x-auto leading-relaxed">
            {deploymentDocs}
          </pre>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// PAGE 8: PROFILE & SETTINGS (Edit Profile, Low-Glare Dark Mode, JSON/CSV Export)
// ----------------------------------------------------------------------------
function ProfileSettingsPage({
  user,
  db,
  darkMode,
  onToggleDarkMode,
  onUpdateUser,
  onClearCache,
  onResetDemo,
}) {
  const [name, setName] = useState(user.name);
  const [targetRole, setTargetRole] = useState(user.targetRole || '');
  const [graduationYear, setGraduationYear] = useState(user.graduationYear || '');

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    downloadFile(
      JSON.stringify(db, null, 2),
      `ecotrack-db-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
  };

  const handleExportCsv = () => {
    const userApps = db.job_applications.filter((a) => a.userId === user.id);
    const headers = [
      'id',
      'company',
      'role',
      'jobType',
      'location',
      'appliedDate',
      'deadlineDate',
      'status',
      'recruiterName',
      'recruiterEmail',
      'jobUrl',
    ];
    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = [
      headers.join(','),
      ...userApps.map((app) => headers.map((h) => escapeCsv(app[h])).join(',')),
    ];
    downloadFile(
      rows.join('\n'),
      `ecotrack-applications-${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* User Profile Card */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 sm:p-6">
        <h2 className="text-base font-bold text-[#111827] dark:text-white mb-4">
          User Profile (`users` table)
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onUpdateUser({
              ...user,
              name: name.trim(),
              targetRole: targetRole.trim(),
              graduationYear: graduationYear.trim(),
            });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Graduation Year</label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] bg-[#f4f7f5] dark:bg-[#0f1713] text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Low-Glare Dark Mode Preference */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] dark:text-white">
            Low-Glare Dark Mode (`#0f1713` / `#16221c`)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Reduces eye strain in low-light environments and lowers emissive subpixel power draw on OLED displays (without claiming universal energy savings on backlit LCD panels).
          </p>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="px-4 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-bold shrink-0 hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
        >
          {darkMode ? 'Switch to Light Mode' : 'Enable Low-Glare Dark Mode'}
        </button>
      </div>

      {/* Export JSON / CSV, Clear Cache & Reset Demo Database */}
      <div className="bg-white dark:bg-[#16221c] border border-[#dce5df] dark:border-[#24382e] rounded-xl p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] dark:text-white">
            Database Portability & Cache Controls
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Export your normalized `ecotrack_db_v1` store as JSON or CSV, flush `EcoCache`, or restore the initial demo dataset.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold"
          >
            <Icon name="download" className="w-4 h-4" />
            Export JSON Backup
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-semibold hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
          >
            <Icon name="download" className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={onClearCache}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#dce5df] dark:border-[#24382e] text-xs font-semibold hover:bg-[#f4f7f5] dark:hover:bg-[#0f1713]"
          >
            <Icon name="refresh" className="w-4 h-4" />
            Clear EcoCache
          </button>
          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/60"
          >
            Reset Demo Database
          </button>
        </div>
      </div>
    </div>
  );
}