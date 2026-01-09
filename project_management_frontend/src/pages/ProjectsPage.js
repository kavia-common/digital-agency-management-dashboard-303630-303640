import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import InlineNotice from '../components/InlineNotice';
import { createProject, deleteProject, listProjects, updateProject } from '../services/api/projects';
import './AppPages.css';

function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

// PUBLIC_INTERFACE
/**
 * Projects page: list/search + CRUD modals.
 * @returns {JSX.Element}
 */
function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'active', budget: '' });
  const [formError, setFormError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listProjects();
      setItems(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e?.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const hay = `${p.name || ''} ${p.description || ''} ${p.status || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => paginate(filtered, page, pageSize), [filtered, page]);

  useEffect(() => {
    // If search changes, reset to first page
    setPage(1);
  }, [query]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', status: 'active', budget: '' });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p?.name || '',
      description: p?.description || '',
      status: p?.status || 'active',
      budget: p?.budget === null || p?.budget === undefined ? '' : String(p.budget),
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const onSave = async () => {
    setFormError('');
    if (!String(form.name || '').trim()) {
      setFormError('Project name is required.');
      return;
    }

    // Optimistic UI: add/update locally first
    const optimisticId = editing?.id || `tmp-${Date.now()}`;
    const optimistic = {
      ...(editing || {}),
      id: optimisticId,
      name: String(form.name).trim(),
      description: String(form.description || '').trim() || null,
      status: form.status || 'active',
      budget: form.budget === '' ? null : Number(form.budget),
    };

    if (editing) {
      setItems((prev) => prev.map((x) => (x.id === editing.id ? optimistic : x)));
    } else {
      setItems((prev) => [optimistic, ...prev]);
    }

    try {
      if (editing) {
        const saved = await updateProject(editing.id, {
          name: optimistic.name,
          description: optimistic.description,
          status: optimistic.status,
          budget: optimistic.budget,
        });
        setItems((prev) => prev.map((x) => (x.id === editing.id ? saved : x)));
      } else {
        const saved = await createProject({
          name: optimistic.name,
          description: optimistic.description,
          status: optimistic.status,
          budget: optimistic.budget,
        });
        // Replace temp item
        setItems((prev) => prev.map((x) => (x.id === optimisticId ? saved : x)));
      }
      closeModal();
    } catch (e) {
      // Re-sync from server on failure
      setFormError(e?.message || 'Failed to save project.');
      refresh();
    }
  };

  const onDelete = async (p) => {
    if (!p?.id) return;
    // Optimistic remove
    const snapshot = items;
    setBusyId(p.id);
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    try {
      await deleteProject(p.id);
    } catch (e) {
      setError(e?.message || 'Failed to delete project.');
      setItems(snapshot);
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="appPage">
      <header className="appPage-headerRow">
        <div>
          <h1 className="appPage-title">Projects</h1>
          <p className="appPage-subtitle">Create, track, and maintain delivery status.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Icon icon={Plus} size={18} />
          New Project
        </Button>
      </header>

      {error ? <InlineNotice title="Projects" message={error} onRetry={refresh} variant="error" /> : null}

      <div className="toolbar">
        <div className="toolbar-search">
          <span className="toolbar-searchIcon" aria-hidden="true">
            <Icon icon={Search} size={16} />
          </span>
          <input
            className="toolbar-searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
          />
        </div>
        <div className="toolbar-meta">
          <span className="muted">{filtered.length} results</span>
        </div>
      </div>

      <section className="panel">
        {loading ? (
          <div className="panel-empty">Loading projects…</div>
        ) : filtered.length === 0 ? (
          <div className="panel-empty">No projects found. Create one to get started.</div>
        ) : (
          <>
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Budget</th>
                    <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((p) => (
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
                      <td style={{ textAlign: 'right' }}>
                        <div className="rowActions">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                            <Icon icon={Pencil} size={16} />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(p)}
                            disabled={busyId === p.id}
                          >
                            <Icon icon={Trash2} size={16} />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((x) => x - 1)}>
                Prev
              </Button>
              <span className="paginationLabel">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((x) => x + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>

      {modalOpen ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" aria-label="Project editor">
          <div className="modal">
            <div className="modalHeader">
              <div>
                <div className="modalTitle">{editing ? 'Edit Project' : 'New Project'}</div>
                <div className="modalSub">Keep details lean—update anytime.</div>
              </div>
              <Button variant="ghost" onClick={closeModal}>
                Close
              </Button>
            </div>

            {formError ? <InlineNotice title="Save failed" message={formError} variant="error" /> : null}

            <div className="modalBody">
              <InputField
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <InputField
                label="Description"
                name="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />

              <div className="twoCol">
                <div>
                  <label className="selectLabel" htmlFor="project-status">
                    Status
                  </label>
                  <select
                    id="project-status"
                    className="select"
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">active</option>
                    <option value="completed">completed</option>
                    <option value="paused">paused</option>
                  </select>
                </div>

                <InputField
                  label="Budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                />
              </div>
            </div>

            <div className="modalFooter">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProjectsPage;
