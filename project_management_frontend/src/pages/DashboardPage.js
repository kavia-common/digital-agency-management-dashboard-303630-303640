import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, FolderKanban, Users, Activity } from 'lucide-react';
import Icon from '../components/Icon';
import InlineNotice from '../components/InlineNotice';
import { getDashboardStats } from '../services/api/dashboard';
import './AppPages.css';

// PUBLIC_INTERFACE
/**
 * Dashboard page: shows aggregated analytics and recent projects.
 * @returns {JSX.Element}
 */
function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

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
        value: stats?.total_projects ?? '—',
        icon: FolderKanban,
        tone: 'primary',
      },
      {
        title: 'Active Projects',
        value: stats?.active_projects ?? '—',
        icon: Activity,
        tone: 'success',
      },
      {
        title: 'Clients',
        value: stats?.total_clients ?? '—',
        icon: Users,
        tone: 'primary',
      },
      {
        title: 'Revenue',
        value: stats ? `$${totalRevenue.toLocaleString()}` : '—',
        icon: DollarSign,
        tone: 'success',
      },
    ];
  }, [stats]);

  return (
    <div className="appPage">
      <header className="appPage-header">
        <h1 className="appPage-title">Dashboard</h1>
        <p className="appPage-subtitle">A quick snapshot of your agency activity.</p>
      </header>

      {error ? (
        <InlineNotice
          title="We couldn't load your dashboard"
          message={error}
          onRetry={fetchStats}
          variant="error"
        />
      ) : null}

      {loading ? (
        <div className="appPage-loading">Loading analytics…</div>
      ) : (
        <div className="gridCards">
          {cards.map((c) => (
            <div key={c.title} className={`card card-${c.tone}`}>
              <div className="card-meta">
                <div className="card-title">{c.title}</div>
                <div className="card-value">{c.value}</div>
              </div>
              <div className="card-icon" aria-hidden="true">
                <Icon icon={c.icon} size={22} />
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Recent Projects</h2>
          <p className="panel-subtitle">Your latest created projects.</p>
        </div>

        {loading ? (
          <div className="panel-empty">Loading recent projects…</div>
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
                {stats.recent_projects.map((p) => (
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
