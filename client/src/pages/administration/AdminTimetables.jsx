import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AdminTimetables.css';

// ─── Toast helper ────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`timetable-toast ${type}`}>{message}</div>
);

// ─── Draggable Class Block (sidebar) ─────────────────────────────────────────
const ClassBlock = ({ group, customActivity, onDragStart, onDragEnd }) => (
  <div
    className={`class-block ${group.level}`}
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('application/json', JSON.stringify({
        level: group.level,
        room: group.room,
        activity: customActivity,
        sourceSlotId: null,
      }));
      e.dataTransfer.effectAllowed = 'move';
      e.currentTarget.classList.add('dragging');
      onDragStart();
    }}
    onDragEnd={(e) => {
      e.currentTarget.classList.remove('dragging');
      onDragEnd();
    }}
  >
    <span className={`level-badge ${group.level}`}>{group.level}</span>
    <div className="block-info">
      <span className="block-title">{group.title}</span>
      <span className="block-meta">{group.teacherName} · {group.room}</span>
    </div>
  </div>
);

// ─── Placed Card (activity inside a timetable cell) ──────────────────────────
const PlacedCard = ({ slot, level, onDragStart, onDragEnd, onRemove }) => {
  if (!slot.activity && !slot.room) return null;

  return (
    <div
      className={`placed-card ${level}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          level,
          room: slot.room,
          activity: slot.activity,
          sourceSlotId: slot.id,
        }));
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
        onDragStart();
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('dragging');
        onDragEnd();
      }}
    >
      <button
        className="remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(slot.id);
        }}
        title="Remove from slot"
        aria-label={`Remove ${slot.activity || slot.room} from this slot`}
      >
        ✕
      </button>
      {slot.activity && <div className="placed-activity">{slot.activity}</div>}
      {slot.room && <div className="placed-room">{slot.room}</div>}
    </div>
  );
};

// ─── Drop Zone (each timetable cell) ─────────────────────────────────────────
const DropZone = ({ slot, level, onDrop, onRemove, onDragStart, onDragEnd }) => {
  const [dragOver, setDragOver] = useState(false);
  const isEmpty = !slot.activity && !slot.room;

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop(slot.id, data);
    } catch {
      // Invalid drag data — ignore
    }
  }, [slot.id, onDrop]);

  const classes = [
    'drop-zone',
    isEmpty ? 'empty' : '',
    dragOver ? `drag-over drag-${level}` : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!isEmpty && (
        <PlacedCard
          slot={slot}
          level={level}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onRemove={onRemove}
        />
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminTimetables = () => {
  const [times, setTimes] = useState([]);
  const [groupTimetables, setGroupTimetables] = useState([]);
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customActivity, setCustomActivity] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  // Fetch per-group timetables on mount
  useEffect(() => {
    fetch('/api/admin/timetables')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load timetables');
        return r.json();
      })
      .then((data) => {
        setTimes(data.times);
        setGroupTimetables(data.groups);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Active group
  const activeGroup = groupTimetables[activeGroupIdx] || null;

  // Persist a slot change to the mock backend
  const updateSlot = useCallback(async (slotId, updates) => {
    const response = await fetch(`/api/admin/timetables/${encodeURIComponent(slotId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update slot');
    }
    return response.json();
  }, []);

  // Update a slot in local state for the active group
  const updateLocalSlot = useCallback((slotId, updates) => {
    setGroupTimetables((prev) =>
      prev.map((gt, idx) => {
        if (idx !== activeGroupIdx) return gt;
        return {
          ...gt,
          timetable: gt.timetable.map((row) => ({
            ...row,
            slots: row.slots.map((s) =>
              s.id === slotId ? { ...s, ...updates } : s
            ),
          })),
        };
      })
    );
  }, [activeGroupIdx]);

  // Handle drop onto a cell
  const handleDrop = useCallback(async (targetSlotId, dragData) => {
    if (!activeGroup) return;

    const { sourceSlotId, activity: dragActivity, room: dragRoom } = dragData;

    // Don't drop onto same slot
    if (sourceSlotId === targetSlotId) return;

    // Determine the activity and room for the target
    const newActivity = dragActivity !== undefined ? dragActivity : '';
    const newRoom = dragRoom || activeGroup.room;

    try {
      // Assign to target
      await updateSlot(targetSlotId, { activity: newActivity, room: newRoom });

      // If moving from another slot, clear source
      if (sourceSlotId) {
        await updateSlot(sourceSlotId, { activity: '', room: null });
        updateLocalSlot(sourceSlotId, { activity: '', room: null });
      }

      updateLocalSlot(targetSlotId, { activity: newActivity, room: newRoom });
      showToast(sourceSlotId ? `Moved "${newActivity}"` : `Scheduled "${newActivity}"`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [activeGroup, updateSlot, updateLocalSlot, showToast]);

  // Remove activity from a slot
  const handleRemove = useCallback(async (slotId) => {
    let removedLabel = '';
    if (activeGroup) {
      for (const row of activeGroup.timetable) {
        const slot = row.slots.find((s) => s.id === slotId);
        if (slot && slot.activity) {
          removedLabel = slot.activity;
          break;
        }
      }
    }

    try {
      await updateSlot(slotId, { activity: '', room: null });
      updateLocalSlot(slotId, { activity: '', room: null });
      showToast(`Removed "${removedLabel}"`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [activeGroup, updateSlot, updateLocalSlot, showToast]);

  // ─── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="section-dashboard">
        <p>Loading timetables...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-dashboard">
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Timetables</span>
        <h1>Group timetable management</h1>
        <p>Select a group below, then drag the class block onto the schedule to assign time slots.</p>
      </section>

      {/* ── Group Tabs ── */}
      <div className="group-tabs">
        {groupTimetables.map((gt, idx) => (
          <button
            key={gt.groupId}
            className={`group-tab ${gt.level} ${idx === activeGroupIdx ? 'active' : ''}`}
            onClick={() => setActiveGroupIdx(idx)}
            aria-selected={idx === activeGroupIdx}
          >
            <span className={`tab-badge ${gt.level}`}>{gt.level}</span>
            <span className="tab-label">
              <span className="tab-title">{gt.title}</span>
              <span className="tab-meta">{gt.teacherName}</span>
            </span>
          </button>
        ))}
      </div>

      {activeGroup && (
        <div className="timetable-layout">
          {/* ── Class Block Sidebar ── */}
          <aside className="glass-panel class-block-sidebar">
            <h2>Class block</h2>
            <div className="sidebar-info">
              <p><strong>{activeGroup.level}</strong> — {activeGroup.title}</p>
              <p>Teacher: <strong>{activeGroup.teacherName}</strong></p>
              <p>Room: <strong>{activeGroup.room}</strong></p>
            </div>
            
            <div className="custom-activity-input">
              <label htmlFor="customActivity">Class note / description:</label>
              <input
                id="customActivity"
                type="text"
                placeholder="Optional description"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
              />
            </div>

            <ClassBlock
              group={activeGroup}
              customActivity={customActivity}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
            <p className="drag-hint">↑ Drag onto the grid</p>
          </aside>

          {/* ── Timetable Grid ── */}
          <section className="glass-panel timetable-grid-panel" aria-label={`${activeGroup.level} ${activeGroup.title} weekly timetable`}>
            <div className="timetable-grid">
              {/* Header row */}
              <div className="grid-header" />
              {times.map((time) => (
                <div key={time} className="grid-header">{time}</div>
              ))}

              {/* Day rows */}
              {activeGroup.timetable.map((row) => (
                <React.Fragment key={row.day}>
                  <div className="grid-day-label">{row.day}</div>
                  {row.slots.map((slot) => (
                    <DropZone
                      key={slot.id}
                      slot={slot}
                      level={activeGroup.level}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={() => setIsDragging(false)}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default AdminTimetables;