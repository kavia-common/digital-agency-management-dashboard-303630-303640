import React, { useEffect, useMemo, useState } from 'react';
import { Download, Moon, Sun, User } from 'lucide-react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import InlineNotice from '../components/InlineNotice';
import { useAuth } from '../context/AuthContext';
import { exportData, getSettings, updateTheme } from '../services/api/settings';
import { put } from '../services/api/http';
import './AppPages.css';

function applyTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// PUBLIC_INTERFACE
/**
 * Settings page: theme toggle, profile update, export data.
 * @returns {JSX.Element}
 */
function SettingsPage() {
  const { user, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [togglingTheme, setTogglingTheme] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [fullName, setFullName] = useState(user?.full_name || '');

  useEffect(() => {
    setFullName(user?.full_name || '');
  }, [user?.full_name]);

  const load = async () => {
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const s = await getSettings();
      const t = s?.theme || localStorage.getItem('theme') || 'light';
      setTheme(t);
      applyTheme(t);
    } catch (e) {
      // Backend unreachable should not fail the app; keep local preference.
      setError(e?.message || 'Unable to load settings right now.');
      applyTheme(theme);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setNotice('');
    setError('');
    setTheme(next);
    applyTheme(next);

    setTogglingTheme(true);
    try {
      await updateTheme(next);
      setNotice('Theme preference saved.');
    } catch (e) {
      // Keep local toggle even if backend fails.
      setError(e?.message || 'Theme updated locally, but could not save to server.');
    } finally {
      setTogglingTheme(false);
    }
  };

  const onSaveProfile = async () => {
    setNotice('');
    setError('');

    if (!String(fullName || '').trim()) {
      setError('Full name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    try {
      await put('/users/profile', { full_name: String(fullName).trim() });
      await refreshProfile();
      setNotice('Profile updated.');
    } catch (e) {
      setError(e?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const onExport = async () => {
    setNotice('');
    setError('');
    setExporting(true);
    try {
      const res = await exportData();
      downloadJson('agency-dashboard-export.json', res?.data || res);
      setNotice('Export ready. Download started.');
    } catch (e) {
      setError(e?.message || 'Failed to export data.');
    } finally {
      setExporting(false);
    }
  };

  const themeLabel = useMemo(() => (theme === 'dark' ? 'Dark' : 'Light'), [theme]);

  return (
    <div className="appPage">
      <header className="appPage-header">
        <h1 className="appPage-title">Settings</h1>
        <p className="appPage-subtitle">Preferences, profile, and data portability.</p>
      </header>

      {error ? <InlineNotice title="Settings" message={error} onRetry={load} variant="error" /> : null}
      {notice ? <InlineNotice title="Success" message={notice} variant="info" /> : null}

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Appearance</h2>
          <p className="panel-subtitle">Toggle theme (persisted locally and to your account when possible).</p>
        </div>

        <div className="settingRow">
          <div>
            <div className="settingLabel">Theme</div>
            <div className="settingHelp">Current: {themeLabel}</div>
          </div>

          <Button variant="outline" onClick={onToggleTheme} disabled={loading || togglingTheme} loading={togglingTheme}>
            <Icon icon={theme === 'dark' ? Sun : Moon} size={18} />
            Toggle theme
          </Button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Profile</h2>
          <p className="panel-subtitle">Update your public profile information.</p>
        </div>

        <div className="formGrid">
          <InputField
            label="Full name"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<Icon icon={User} size={18} />}
            required
          />

          <div className="formActions">
            <Button variant="primary" onClick={onSaveProfile} loading={savingProfile} disabled={loading}>
              Save profile
            </Button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Data export</h2>
          <p className="panel-subtitle">Download all your data (projects, clients, settings) as JSON.</p>
        </div>

        <div className="settingRow">
          <div>
            <div className="settingLabel">Export</div>
            <div className="settingHelp">Creates a JSON file you can store or migrate.</div>
          </div>

          <Button variant="outline" onClick={onExport} loading={exporting} disabled={loading}>
            <Icon icon={Download} size={18} />
            Export data
          </Button>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
