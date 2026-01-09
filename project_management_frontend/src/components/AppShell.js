import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, FolderKanban, Users, Settings, LogOut } from 'lucide-react';
import Icon from './Icon';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import './AppShell.css';

// PUBLIC_INTERFACE
/**
 * AppShell provides the authenticated layout with sidebar navigation.
 * Adds responsive collapsed sidebar behavior and subtle route transitions.
 * @returns {JSX.Element}
 */
function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const update = () => {
      // Desktop collapse breakpoint (keeps sidebar usable but reduces width)
      const shouldCollapse = window.innerWidth < 1140;
      setCollapsed(shouldCollapse);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.full_name || user?.name || user?.email || 'Account';

  const links = useMemo(
    () => [
      { to: '/app/dashboard', label: 'Dashboard', icon: BarChart3 },
      { to: '/app/projects', label: 'Projects', icon: FolderKanban },
      { to: '/app/clients', label: 'Clients', icon: Users },
      { to: '/app/settings', label: 'Settings', icon: Settings },
    ],
    []
  );

  return (
    <div className={`appShell ${collapsed ? 'isCollapsed' : ''}`}>
      <aside className="appShell-sidebar" aria-label="Primary">
        <div className="appShell-brand">
          <div className="appShell-mark" aria-hidden="true" />
          <div className="appShell-brandText">
            <div className="appShell-brandTitle">KAVIA</div>
            <div className="appShell-brandSub">Agency Dashboard</div>
          </div>
        </div>

        <nav className="appShell-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `appShell-link ${isActive ? 'isActive' : ''}`}>
              <Icon icon={l.icon} />
              <span className="appShell-linkLabel">{l.label}</span>
              {collapsed ? <span className="appShell-tooltip">{l.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="appShell-account">
          <div className="appShell-accountMeta">
            <div className="appShell-accountName">{displayName}</div>
            <div className="appShell-accountEmail">{user?.email || ''}</div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} aria-label="Log out">
            <Icon icon={LogOut} size={16} />
            <span className="appShell-linkLabel">Logout</span>
          </Button>
        </div>
      </aside>

      <main className="appShell-main">
        <div className="appShell-content">
          <div key={location.pathname} className="routeFrame">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppShell;
