import React, { useMemo, useState, useEffect } from 'react';
import './Teacher_Grades.css';

// TODO(security): Replace hardcoded teacherId with JWT-derived identity.
const CURRENT_TEACHER_ID = 'T1';

const averageFor = (grades) => {
  if (!grades.length) return 0;
  const total = grades.reduce((sum, grade) => sum + Number(grade.score), 0);
  return total / grades.length;
};

const Teachers_Grades = () => {
  const [groups, setGroups] = useState([]);
  const [gradesByGroup, setGradesByGroup] = useState({});
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingGradeId, setEditingGradeId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    student: '',
    assessment: '',
    score: '',
    status: 'Published',
  });
  const [editForm, setEditForm] = useState({
    student: '',
    assessment: '',
    score: '',
    status: 'Published',
  });

  // Fetch teacher's groups
  useEffect(() => {
    fetch(`/api/teachers/groups?teacherId=${CURRENT_TEACHER_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load groups');
        return res.json();
      })
      .then((data) => {
        setGroups(data);
        if (data.length > 0) {
          setSelectedGroupId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch grades when selected group changes
  useEffect(() => {
    if (!selectedGroupId) return;
    // Skip if already fetched
    if (gradesByGroup[selectedGroupId]) return;

    fetch(`/api/teachers/grades/${selectedGroupId}?teacherId=${CURRENT_TEACHER_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load grades');
        return res.json();
      })
      .then((data) => {
        setGradesByGroup((prev) => ({ ...prev, [selectedGroupId]: data }));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [selectedGroupId, gradesByGroup]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? groups[0];
  const activeGrades = gradesByGroup[selectedGroupId] || [];

  const dashboardStats = useMemo(() => {
    const allGrades = Object.values(gradesByGroup).flat();
    const pendingGrades = allGrades.filter((g) => g.status !== 'Published');

    return {
      groups: groups.length,
      average: averageFor(allGrades),
      pending: pendingGrades.length,
      recent: allGrades.filter((g) => g.updatedAt === 'Today' || g.updatedAt === 'Just now').length,
    };
  }, [groups, gradesByGroup]);

  const beginEdit = (grade) => {
    setEditingGradeId(grade.id);
    setEditForm({
      student: grade.studentName,
      assessment: grade.assessment,
      score: String(grade.score),
      status: grade.status,
    });
  };

  const saveEdit = async (groupId, gradeId) => {
    try {
      const response = await fetch(`/api/teachers/grades/${gradeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: CURRENT_TEACHER_ID,
          studentName: editForm.student.trim(),
          assessment: editForm.assessment.trim(),
          score: Number(editForm.score),
          status: editForm.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update grade');
      }

      const updated = await response.json();
      setGradesByGroup((prev) => ({
        ...prev,
        [groupId]: prev[groupId].map((g) => (g.id === gradeId ? updated : g)),
      }));
      setEditingGradeId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();

    if (!uploadForm.student.trim() || !uploadForm.assessment.trim() || uploadForm.score === '') {
      return;
    }

    try {
      const response = await fetch('/api/teachers/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: CURRENT_TEACHER_ID,
          groupId: selectedGroupId,
          studentName: uploadForm.student.trim(),
          assessment: uploadForm.assessment.trim(),
          score: Number(uploadForm.score),
          status: uploadForm.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload grade');
      }

      const newGrade = await response.json();
      setGradesByGroup((prev) => ({
        ...prev,
        [selectedGroupId]: [newGrade, ...(prev[selectedGroupId] || [])],
      }));
      setUploadForm({ student: '', assessment: '', score: '', status: 'Published' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="teacher-grades-dashboard page-container"><p>Loading...</p></div>;

  return (
    <div className="teacher-grades-dashboard page-container">
      <section className="dashboard-hero glass-panel">
        <div>
          <span className="eyebrow">Teacher dashboard</span>
          <h1>Grades control center</h1>
          <p>Upload new marks, edit existing records, and review each group.</p>
        </div>
      </section>

      {error && (
        <section className="glass-panel" style={{ padding: '1rem', color: '#ef4444' }}>
          Error: {error}
          <button style={{ marginLeft: '1rem' }} onClick={() => setError(null)}>Dismiss</button>
        </section>
      )}

      <section className="stats-grid">
        <article className="glass-panel stat-card">
          <span className="stat-label">Groups</span>
          <strong>{dashboardStats.groups}</strong>
          <small>Active class groups</small>
        </article>
        <article className="glass-panel stat-card">
          <span className="stat-label">Average grade</span>
          <strong>{dashboardStats.average.toFixed(1)}</strong>
          <small>Across all records</small>
        </article>
        <article className="glass-panel stat-card">
          <span className="stat-label">Pending review</span>
          <strong>{dashboardStats.pending}</strong>
          <small>Grades waiting for approval</small>
        </article>
        <article className="glass-panel stat-card">
          <span className="stat-label">Updated today</span>
          <strong>{dashboardStats.recent}</strong>
          <small>Recent grade changes</small>
        </article>
      </section>

      <section className="dashboard-layout">
        <aside className="glass-panel groups-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Groups</span>
              <h2>Review one class at a time</h2>
            </div>
          </div>

          <div className="group-list">
            {groups.map((group) => {
              const groupGrades = gradesByGroup[group.id] || [];
              const average = averageFor(groupGrades);
              const isActive = group.id === selectedGroupId;

              return (
                <button
                  key={group.id}
                  type="button"
                  className={`group-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <div>
                    <h3>{group.level} {group.title}</h3>
                    <p>{group.focus}</p>
                  </div>
                  <div className="group-meta">
                    <span>{group.studentCount} students</span>
                    <strong>{average.toFixed(1)}</strong>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedGroup && (
            <div className="group-summary">
              <span className="eyebrow">Selected group</span>
              <h3>{selectedGroup.level} {selectedGroup.title}</h3>
              <p>
                {selectedGroup.period} · {selectedGroup.focus}
              </p>
            </div>
          )}
        </aside>

        <div className="main-column">
          <section className="glass-panel upload-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Upload</span>
                <h2>Add a new grade record</h2>
              </div>
            </div>

            <form className="upload-form" onSubmit={handleUploadSubmit}>
              <label>
                Group
                <select value={selectedGroupId || ''} onChange={(e) => setSelectedGroupId(e.target.value)}>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.level} {group.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Student
                <input
                  type="text"
                  value={uploadForm.student}
                  onChange={(e) => setUploadForm((c) => ({ ...c, student: e.target.value }))}
                  placeholder="Enter student name"
                />
              </label>
              <label>
                Assessment
                <input
                  type="text"
                  value={uploadForm.assessment}
                  onChange={(e) => setUploadForm((c) => ({ ...c, assessment: e.target.value }))}
                  placeholder="Quiz, project, exam..."
                />
              </label>
              <label>
                Score
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={uploadForm.score}
                  onChange={(e) => setUploadForm((c) => ({ ...c, score: e.target.value }))}
                  placeholder="0.0"
                />
              </label>
              <label>
                Status
                <select
                  value={uploadForm.status}
                  onChange={(e) => setUploadForm((c) => ({ ...c, status: e.target.value }))}
                >
                  <option value="Published">Published</option>
                  <option value="Pending">Pending</option>
                  <option value="Needs review">Needs review</option>
                </select>
              </label>

              <div className="upload-footer">
                <button className="btn btn-primary" type="submit">Upload grade</button>
              </div>
            </form>
          </section>

          <section className="glass-panel table-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Grades</span>
                <h2>{selectedGroup ? `${selectedGroup.level} ${selectedGroup.title}` : 'Select a group'}</h2>
              </div>
            </div>

            <div className="table-scroll">
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Assessment</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeGrades.map((grade) => {
                    const isEditing = editingGradeId === grade.id;

                    return (
                      <tr key={grade.id}>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.student}
                              onChange={(e) => setEditForm((c) => ({ ...c, student: e.target.value }))}
                            />
                          ) : (
                            grade.studentName
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.assessment}
                              onChange={(e) => setEditForm((c) => ({ ...c, assessment: e.target.value }))}
                            />
                          ) : (
                            grade.assessment
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={editForm.score}
                              onChange={(e) => setEditForm((c) => ({ ...c, score: e.target.value }))}
                            />
                          ) : (
                            grade.score.toFixed(1)
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm((c) => ({ ...c, status: e.target.value }))}
                            >
                              <option value="Published">Published</option>
                              <option value="Pending">Pending</option>
                              <option value="Needs review">Needs review</option>
                            </select>
                          ) : (
                            <span className={`status-pill status-${grade.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {grade.status}
                            </span>
                          )}
                        </td>
                        <td>{grade.updatedAt}</td>
                        <td>
                          {isEditing ? (
                            <div className="row-actions">
                              <button type="button" className="btn btn-primary" onClick={() => saveEdit(selectedGroup.id, grade.id)}>
                                Save
                              </button>
                              <button type="button" className="btn btn-outline" onClick={() => setEditingGradeId(null)}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button type="button" className="btn btn-outline table-action" onClick={() => beginEdit(grade)}>
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Teachers_Grades;
