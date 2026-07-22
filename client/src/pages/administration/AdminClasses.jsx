import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, BookOpen, Users, Check } from 'lucide-react';
import './AdminClasses.css';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    level: 'A1',
    title: '',
    room: '',
    teacherId: '',
    studentCount: 20,
    period: 'Quarter 4',
    focus: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, teachersRes] = await Promise.all([
        fetch('/api/admin/classes'),
        fetch('/api/admin/teachers'),
      ]);

      if (!classesRes.ok) throw new Error('Failed to load classes');
      if (!teachersRes.ok) throw new Error('Failed to load teachers');

      const classesData = await classesRes.json();
      const teachersData = await teachersRes.json();

      setClasses(classesData);
      setTeachers(teachersData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setFormData({
      level: 'A1',
      title: '',
      room: 'Room 101',
      teacherId: teachers[0]?.id || '',
      studentCount: 20,
      period: 'Quarter 4',
      focus: '',
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setFormData({
      level: cls.level || 'A1',
      title: cls.title || '',
      room: cls.room || '',
      teacherId: cls.teacherId || '',
      studentCount: cls.studentCount ?? 20,
      period: cls.period || 'Quarter 4',
      focus: cls.focus || '',
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studentCount: Number(formData.studentCount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create class');
      }

      setSuccessMsg('Class created successfully!');
      setIsCreateModalOpen(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingClass) return;
    setError(null);

    try {
      const response = await fetch(`/api/admin/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studentCount: Number(formData.studentCount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update class');
      }

      setSuccessMsg(`Class "${formData.title}" updated successfully!`);
      setIsEditModalOpen(false);
      setEditingClass(null);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete class "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/classes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete class');
      }

      setSuccessMsg(`Class "${title}" removed.`);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="section-dashboard"><p>Loading classes...</p></div>;

  return (
    <div className="section-dashboard admin-classes-container">
      <section className="glass-panel section-hero hero-with-actions">
        <div>
          <span className="eyebrow">English levels & Groups</span>
          <h1>Class Structure Overview</h1>
          <p>Create, manage, and assign teachers to A1 through C1 English level groups.</p>
        </div>
        <button className="btn btn-primary create-class-btn" onClick={openCreateModal}>
          <Plus size={18} style={{ marginRight: '6px' }} />
          New Class
        </button>
      </section>

      {error && <p className="alert-box alert-danger">Error: {error}</p>}
      {successMsg && <p className="alert-box alert-success">{successMsg}</p>}

      <section className="section-grid classes-grid">
        {classes.map((item) => (
          <article key={item.id} className="glass-panel section-card class-card">
            <div className="card-topline">
              <div>
                <span className="level-badge">{item.level}</span>
                <h2>{item.title}</h2>
              </div>
              <span className="student-count-badge">
                <Users size={14} style={{ marginRight: '4px' }} />
                {item.studentCount} students
              </span>
            </div>

            <div className="card-body">
              <p className="card-detail">
                <strong>Teacher:</strong> {item.teacher || 'Unassigned'}
              </p>
              <p className="card-detail">
                <strong>Room:</strong> {item.room}
              </p>
              {item.period && (
                <p className="card-detail">
                  <strong>Period:</strong> {item.period}
                </p>
              )}
              {item.focus && (
                <p className="card-focus">
                  <em>Focus: {item.focus}</em>
                </p>
              )}
            </div>

            <div className="card-actions">
              <button
                className="btn btn-outline btn-sm action-btn edit-btn"
                onClick={() => openEditModal(item)}
                title="Edit Class"
              >
                <Edit2 size={15} style={{ marginRight: '4px' }} />
                Edit
              </button>
              <button
                className="btn btn-outline btn-sm action-btn delete-btn"
                onClick={() => handleDelete(item.id, item.title)}
                title="Delete Class"
              >
                <Trash2 size={15} style={{ marginRight: '4px' }} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Create New Class</h2>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>English Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData((p) => ({ ...p, level: e.target.value }))}
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Title / Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Beginners Intensive"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 101"
                    value={formData.room}
                    onChange={(e) => setFormData((p) => ({ ...p, room: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Assign Teacher</label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData((p) => ({ ...p, teacherId: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subject})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Student Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentCount}
                    onChange={(e) => setFormData((p) => ({ ...p, studentCount: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Period</label>
                  <input
                    type="text"
                    placeholder="e.g. Quarter 4"
                    value={formData.period}
                    onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Focus / Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Conversation & Grammar"
                  value={formData.focus}
                  onChange={(e) => setFormData((p) => ({ ...p, focus: e.target.value }))}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Edit Class: {editingClass?.title}</h2>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label>English Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData((p) => ({ ...p, level: e.target.value }))}
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Title / Group Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData((p) => ({ ...p, room: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Assign Teacher</label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData((p) => ({ ...p, teacherId: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subject})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Student Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentCount}
                    onChange={(e) => setFormData((p) => ({ ...p, studentCount: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Period</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Focus / Specialization</label>
                <input
                  type="text"
                  value={formData.focus}
                  onChange={(e) => setFormData((p) => ({ ...p, focus: e.target.value }))}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;