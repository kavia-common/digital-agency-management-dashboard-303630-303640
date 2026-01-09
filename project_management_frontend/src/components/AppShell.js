import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, FolderKanban, Users, Settings, LogOut } from 'lucide-react';
import Icon from './Icon';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import './AppShell.css';

// PUBLIC_INTERFACE
/**
 * AppShell provides the authenticated layout with sidebar navigation.
 * @returns {JSX.Element}
 */
function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.full_name || user?.name || user?.email || 'Account';

  return (
    <div className="appShell">
      <aside className="appShell-sidebar" aria-label="Primary">
        <div className="appShell-brand">
          <div className="appShell-mark" aria-hidden="true" />
          <div className="appShell-brandText">
            <div className="appShell-brandTitle">KAVIA</div>
            <div className="appShell-brandSub">Agency Dashboard</div>
          </div>
        </div>

        <nav className="appShell-nav">
          <NavLink to="/app/dashboard" className={({ isActive }) => `appShell-link ${isActive ? 'isActive' : ''}`}>
            <Icon icon={BarChart3} />
            Dashboard
          </NavLink>
          <NavLink to="/app/projects" className={({ isActive }) => `appShell-link ${isActive ? 'isActive' : ''}`}>
            <Icon icon={FolderKanban} />
            Projects
          </NavLink>
          <NavLink to="/app/clients" className={({ isActive }) => `appShell-link ${isActive ? 'isActive' : ''}`}>
            <Icon icon={Users} />
            Clients
          </NavLink>
          <NavLink to="/app/settings" className={({ isActive }) => `appShell-link ${isActive ? 'isActive' : ''}`}>
            <Icon icon={Settings} />
            Settings
          </NavLink>
        </nav>

        <div className="appShell-account">
          <div className="appShell-accountMeta">
            <div className="appShell-accountName">{displayName}</div>
            <div className="appShell-accountEmail">{user?.email || ''}</div>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <Icon icon={LogOut} size={16} />
            Logout
          </Button>
        </div>
      </aside>

      <main className="appShell-main">
        <div className="appShell-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppShell;
