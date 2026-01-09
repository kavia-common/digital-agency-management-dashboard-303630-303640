import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import InlineNotice from '../components/InlineNotice';
import Modal from '../components/Modal';
import { createClient, deleteClient, listClients, updateClient } from '../services/api/client';
import './AppPages.css';

function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

// PUBLIC_INTERFACE
/**
 * Clients page: list/search + CRUD modals.
 * @returns {JSX.Element}
 */
function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
  const [formError, setFormError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listClients();
      setItems(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e?.message || 'Failed to load clients.');
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
    return items.filter((c) => {
      const hay = `${c.name || ''} ${c.company || ''} ${c.email || ''} ${c.phone || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => paginate(filtered, page, pageSize), [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c?.name || '',
      email: c?.email || '',
      phone: c?.phone || '',
      company: c?.company || '',
      address: c?.address || '',
      notes: c?.notes || '',
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
      setFormError('Client name is required.');
      return;
    }

    const optimisticId = editing?.id || `tmp-${Date.now()}`;
    const optimistic = {
      ...(editing || {}),
      id: optimisticId,
      name: String(form.name).trim(),
      email: String(form.email || '').trim() || null,
      phone: String(form.phone || '').trim() || null,
      company: String(form.company || '').trim() || null,
      address: String(form.address || '').trim() || null,
      notes: String(form.notes || '').trim() || null,
    };

    if (editing) {
      setItems((prev) => prev.map((x) => (x.id === editing.id ? optimistic : x)));
    } else {
      setItems((prev) => [optimistic, ...prev]);
    }

    try {
      if (editing) {
        const saved = await updateClient(editing.id, optimistic);
        setItems((prev) => prev.map((x) => (x.id === editing.id ? saved : x)));
      } else {
        const saved = await createClient(optimistic);
        setItems((prev) => prev.map((x) => (x.id === optimisticId ? saved : x)));
      }
      closeModal();
    } catch (e) {
      setFormError(e?.message || 'Failed to save client.');
      refresh();
    }
  };

  const onDelete = async (c) => {
    if (!c?.id) return;
    const snapshot = items;
    setBusyId(c.id);
    setItems((prev) => prev.filter((x) => x.id !== c.id));
    try {
      await deleteClient(c.id);
    } catch (e) {
      setError(e?.message || 'Failed to delete client.');
      setItems(snapshot);
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="appPage">
      <header className="appPage-headerRow">
        <div>
          <h1 className="appPage-title">Clients</h1>
          <p className="appPage-subtitle">Maintain a clean client CRM with quick edits.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Icon icon={Plus} size={18} />
          New Client
        </Button>
      </header>

      {error ? <InlineNotice title="Clients" message={error} onRetry={refresh} variant="error" /> : null}

      <div className="toolbar">
        <div className="toolbar-search">
          <span className="toolbar-searchIcon" aria-hidden="true">
            <Icon icon={Search} size={16} />
          </span>
          <input
            className="toolbar-searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            aria-label="Search clients"
          />
        </div>
        <div className="toolbar-meta">
          <span className="muted">{filtered.length} results</span>
        </div>
      </div>

      <section className="panel">
        {loading ? (
          <div className="panel-empty">Loading clients…</div>
        ) : filtered.length === 0 ? (
          <div className="panel-empty">No clients found. Add a client to start tracking work.</div>
        ) : (
          <>
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th style={{ width: 160, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="cellTitle">{c.name}</div>
                        <div className="cellSub">{c.phone || '—'}</div>
                      </td>
                      <td>{c.company || '—'}</td>
                      <td>{c.email || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="rowActions">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                            <Icon icon={Pencil} size={16} />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDelete(c)} disabled={busyId === c.id}>
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

      <Modal open={modalOpen} ariaLabel="Client editor" onClose={closeModal}>
        <div className="modalHeader">
          <div>
            <div className="modalTitle">{editing ? 'Edit Client' : 'New Client'}</div>
            <div className="modalSub">Keep contact info current to move fast.</div>
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
          <div className="twoCol">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <InputField
            label="Company"
            name="company"
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          />
          <InputField
            label="Address"
            name="address"
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          />
          <InputField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <div className="modalFooter">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ClientsPage;
