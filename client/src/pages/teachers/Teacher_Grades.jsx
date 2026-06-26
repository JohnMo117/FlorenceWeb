import React, { useMemo, useState } from 'react';
import './Teacher_Grades.css';

const initialGroups = [
  {
    id: 'grp-A1',
    name: 'A1 Begginers',
    period: 'Quarter 4',
    students: 24,
    focus: 'Introduction to English',
    grades: [
      { id: 'g-1', student: 'Ana Rivera', assessment: 'Unit 3 Quiz', score: 8.9, status: 'Published', updatedAt: 'Today' },
      { id: 'g-2', student: 'Marco Silva', assessment: 'Project Draft', score: 7.4, status: 'Pending', updatedAt: 'Yesterday' },
      { id: 'g-3', student: 'Lina Torres', assessment: 'Midterm Review', score: 9.2, status: 'Published', updatedAt: '2 days ago' },
    ],
  },
  {
    id: 'grp-B1',
    name: 'B1 Intermidate',
    period: 'Quarter 4',
    students: 21,
    focus: 'Intermediate English',
    grades: [
      { id: 'g-4', student: 'Diego Costa', assessment: 'Lab Report', score: 8.1, status: 'Published', updatedAt: 'Today' },
      { id: 'g-5', student: 'Sara Gomez', assessment: 'Quiz 5', score: 6.8, status: 'Needs review', updatedAt: 'Yesterday' },
      { id: 'g-6', student: 'Hugo Martín', assessment: 'Lab Report', score: 9, status: 'Published', updatedAt: '3 days ago' },
    ],
  },
  {
    id: 'grp-C1',
    name: 'C1 Advanced',
    period: 'Quarter 4',
    students: 18,
    focus: 'Essay writing',
    grades: [
      { id: 'g-7', student: 'Paula Ruiz', assessment: 'Essay 2', score: 9.4, status: 'Published', updatedAt: 'Today' },
      { id: 'g-8', student: 'Nora Alvarez', assessment: 'Reading Response', score: 8.5, status: 'Pending', updatedAt: 'Yesterday' },
      { id: 'g-9', student: 'Leo Blanco', assessment: 'Essay 2', score: 7.9, status: 'Published', updatedAt: '2 days ago' },
    ],
  },
];

const createGradeId = () => `g-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

const averageFor = (grades) => {
  if (!grades.length) {
    return 0;
  }

  const total = grades.reduce((sum, grade) => sum + Number(grade.score), 0);
  return total / grades.length;
};

const Teachers_Grades = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroups[0].id);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    student: '',
    assessment: '',
    score: '',
    status: 'Published',
    evidenceName: '',
  });
  const [editForm, setEditForm] = useState({
    student: '',
    assessment: '',
    score: '',
    status: 'Published',
  });

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];

  const dashboardStats = useMemo(() => {
    const allGrades = groups.flatMap((group) => group.grades);
    const pendingGrades = allGrades.filter((grade) => grade.status !== 'Published');

    return {
      groups: groups.length,
      average: averageFor(allGrades),
      pending: pendingGrades.length,
      recent: allGrades.filter((grade) => grade.updatedAt === 'Today').length,
    };
  }, [groups]);

  const updateGroup = (groupId, updater) => {
    setGroups((currentGroups) => currentGroups.map((group) => (group.id === groupId ? updater(group) : group)));
  };

  const beginEdit = (grade) => {
    setEditingGradeId(grade.id);
    setEditForm({
      student: grade.student,
      assessment: grade.assessment,
      score: String(grade.score),
      status: grade.status,
    });
  };

  const saveEdit = (groupId, gradeId) => {
    updateGroup(groupId, (group) => ({
      ...group,
      grades: group.grades.map((grade) =>
        grade.id === gradeId
          ? {
              ...grade,
              student: editForm.student.trim(),
              assessment: editForm.assessment.trim(),
              score: Number(editForm.score),
              status: editForm.status,
              updatedAt: 'Just now',
            }
          : grade
      ),
    }));

    setEditingGradeId(null);
  };

  const handleUploadSubmit = (event) => {
    event.preventDefault();

    if (!uploadForm.student.trim() || !uploadForm.assessment.trim() || uploadForm.score === '') {
      return;
    }

    const newGrade = {
      id: createGradeId(),
      student: uploadForm.student.trim(),
      assessment: uploadForm.assessment.trim(),
      score: Number(uploadForm.score),
      status: uploadForm.status,
      updatedAt: 'Just now',
    };

    updateGroup(selectedGroupId, (group) => ({
      ...group,
      grades: [newGrade, ...group.grades],
    }));

    setUploadForm({
      student: '',
      assessment: '',
      score: '',
      status: 'Published',
      evidenceName: '',
    });
  };

  const activeGrades = selectedGroup?.grades ?? [];

  return (
    <div className="teacher-grades-dashboard page-container">
      <section className="dashboard-hero glass-panel">
        <div>
          <span className="eyebrow">Teacher dashboard</span>
          <h1>Grades control center</h1>
          <p>Upload new marks, edit existing records, and review each group with mock data.</p>
        </div>
{/* 
        <div className="hero-actions">
          <button className="btn btn-primary" type="button">Export report</button>
          <button className="btn btn-outline" type="button">Send reminder</button>
        </div> */}
      </section>

      <section className="stats-grid">
        <article className="glass-panel stat-card">
          <span className="stat-label">Groups</span>
          <strong>{dashboardStats.groups}</strong>
          <small>Active class groups</small>
        </article>
        <article className="glass-panel stat-card">
          <span className="stat-label">Average grade</span>
          <strong>{dashboardStats.average.toFixed(1)}</strong>
          <small>Across all mock records</small>
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
              const average = averageFor(group.grades);
              const isActive = group.id === selectedGroupId;

              return (
                <button
                  key={group.id}
                  type="button"
                  className={`group-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <div>
                    <h3>{group.name}</h3>
                    <p>{group.focus}</p>
                  </div>
                  <div className="group-meta">
                    <span>{group.students} students</span>
                    <strong>{average.toFixed(1)}</strong>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="group-summary">
            <span className="eyebrow">Selected group</span>
            <h3>{selectedGroup.name}</h3>
            <p>
              {selectedGroup.period} · {selectedGroup.focus}
            </p>
          </div>
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
                <select value={selectedGroupId} onChange={(event) => setSelectedGroupId(event.target.value)}>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Student
                <input
                  type="text"
                  value={uploadForm.student}
                  onChange={(event) => setUploadForm((current) => ({ ...current, student: event.target.value }))}
                  placeholder="Enter student name"
                />
              </label>
              <label>
                Assessment
                <input
                  type="text"
                  value={uploadForm.assessment}
                  onChange={(event) => setUploadForm((current) => ({ ...current, assessment: event.target.value }))}
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
                  onChange={(event) => setUploadForm((current) => ({ ...current, score: event.target.value }))}
                  placeholder="0.0"
                />
              </label>
              <label>
                Status
                <select
                  value={uploadForm.status}
                  onChange={(event) => setUploadForm((current) => ({ ...current, status: event.target.value }))}
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
                <h2>{selectedGroup.name}</h2>
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
                              onChange={(event) => setEditForm((current) => ({ ...current, student: event.target.value }))}
                            />
                          ) : (
                            grade.student
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.assessment}
                              onChange={(event) => setEditForm((current) => ({ ...current, assessment: event.target.value }))}
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
                              onChange={(event) => setEditForm((current) => ({ ...current, score: event.target.value }))}
                            />
                          ) : (
                            grade.score.toFixed(1)
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <select
                              value={editForm.status}
                              onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}
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
