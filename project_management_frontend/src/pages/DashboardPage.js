import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DollarSign, FolderKanban, Users, Activity } from 'lucide-react';
import Icon from '../components/Icon';
import InlineNotice from '../components/InlineNotice';
import { getDashboardStats } from '../services/api/dashboard';
import './AppPages.css';

/**
 * Small helper hook for animating numeric KPIs (only when motion is allowed).
 * This is a proper custom hook, so it can be used safely in child components.
 */
function useAnimatedNumber(target, reduceMotion) {
  const [val, setVal] = useState(target);

  useEffect(() => {
    const t = Number(target);
    if (!Number.isFinite(t)) {
      setVal(target);
      return;
    }

    if (reduceMotion) {
      setVal(t);
      return;
    }

    const from = Number(val) || 0;
    const start = performance.now();
    const dur = 650;

    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (t - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduceMotion]);

  return val;
}

/**
 * Dashboard KPI card.
 * Kept as a component so it can safely use hooks without violating rules-of-hooks.
 */
function StatCard({ title, raw, format, icon, tone, reduceMotion }) {
  const animated = useAnimatedNumber(typeof raw === 'number' ? raw : NaN, reduceMotion);
  const display = typeof raw === 'number' ? format(animated) : format(raw);

  return (
    <div className={`card card-${tone}`}>
      <div className="card-meta">
        <div className="card-title">{title}</div>
        <div className="card-value">{display}</div>
      </div>
      <div className="card-icon" aria-hidden="true">
        <Icon icon={icon} size={22} />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Dashboard page: shows aggregated analytics and recent projects.
 * @returns {JSX.Element}
 */
function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const reduceMotionRef = useRef(false);
  useEffect(() => {
    reduceMotionRef.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getDashboardStats();
      setStats(res);
    } catch (e) {
      setError(e?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = useMemo(() => {
    const totalRevenue = Number(stats?.total_revenue || 0);
    return [
      {
        title: 'Total Projects',
        raw: stats?.total_projects,
        format: (v) => (v ?? '—'),
        icon: FolderKanban,
        tone: 'primary',
      },
      {
        title: 'Active Projects',
        raw: stats?.active_projects,
        format: (v) => (v ?? '—'),
        icon: Activity,
        tone: 'success',
      },
      {
        title: 'Clients',
        raw: stats?.total_clients,
        format: (v) => (v ?? '—'),
        icon: Users,
        tone: 'primary',
      },
      {
        title: 'Revenue',
        raw: stats ? totalRevenue : null,
        format: (v) => (stats ? `$${Number(v || 0).toLocaleString()}` : '—'),
        icon: DollarSign,
        tone: 'success',
      },
    ];
  }, [stats]);

  const reduceMotion = reduceMotionRef.current;

  return (
    <div className="appPage">
      <header className="appPage-header">
        <h1 className="appPage-title">Dashboard</h1>
        <p className="appPage-subtitle">A quick snapshot of your agency activity.</p>
      </header>

      {error ? (
        <InlineNotice title="We couldn't load your dashboard" message={error} onRetry={fetchStats} variant="error" />
      ) : null}

      {loading ? (
        <div className="gridCards" aria-label="Loading dashboard metrics">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="card">
              <div style={{ width: '70%' }}>
                <div className="skeleton" style={{ height: 12, width: 120 }} />
                <div style={{ height: 10 }} />
                <div className="skeleton" style={{ height: 26, width: '60%' }} />
              </div>
              <div className="skeleton" style={{ height: 44, width: 44, borderRadius: 16 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="gridCards">
          {cards.map((c) => (
            <StatCard key={c.title} {...c} reduceMotion={reduceMotion} />
          ))}
        </div>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Recent Projects</h2>
          <p className="panel-subtitle">Your latest created projects.</p>
        </div>

        {loading ? (
          <div className="tableWrap" aria-label="Loading recent projects">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Budget</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="skeleton" style={{ height: 14, width: '55%' }} />
                      <div style={{ height: 6 }} />
                      <div className="skeleton" style={{ height: 12, width: '70%' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ height: 20, width: 90, borderRadius: 999 }} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="skeleton" style={{ height: 14, width: 80, marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (stats?.recent_projects || []).length === 0 ? (
          <div className="panel-empty">No projects yet. Create your first project to see it here.</div>
        ) : (
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Budget</th>
                </tr>
              </thead>
              <tbody>
                {(stats.recent_projects || []).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="cellTitle">{p.name}</div>
                      <div className="cellSub">{p.description || '—'}</div>
                    </td>
                    <td>
                      <span className={`pill pill-${p.status || 'active'}`}>{p.status || 'active'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {p.budget !== null && p.budget !== undefined ? `$${Number(p.budget).toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
