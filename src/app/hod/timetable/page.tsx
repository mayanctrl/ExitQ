'use client';

import React, { useEffect, useState } from 'react';
import { Lecture, TimetableVersion } from '@/lib/types';
import { TimetableGrid } from '@/components/ui/TimetableGrid';
import { Plus, History, Upload, Trash2, X } from 'lucide-react';

export default function HODTimetablePage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [versions, setVersions] = useState<TimetableVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<TimetableVersion | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string }>({ day: 'MON', time: '10:00' });
  const [subject, setSubject] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [facultyName, setFacultyName] = useState('Prof. Rajesh Kumar');
  const [room, setRoom] = useState('Hall 301');

  // Selected Lecture Details Modal
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const fetchTimetable = () => {
    fetch('/api/timetable')
      .then((res) => res.json())
      .then((data) => {
        setLectures(data.lectures || []);
        setVersions(data.versions || []);
        setCurrentVersion(data.currentVersion || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleLectureMove = async (
    lecture: Lecture,
    targetDay: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT',
    targetStartTime: string,
    targetEndTime: string
  ) => {
    // Optimistic update
    const prevLectures = [...lectures];
    const updatedLectures = lectures.map((l) =>
      l.id === lecture.id
        ? { ...l, day: targetDay, startTime: targetStartTime, endTime: targetEndTime }
        : l
    );
    setLectures(updatedLectures);

    try {
      const res = await fetch('/api/timetable/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureId: lecture.id,
          targetDay,
          targetStartTime,
          targetEndTime,
          actorId: 'usr_hod_1',
          actorName: 'Dr. Ananya Sharma',
          semester: lecture.semester || 4,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback on error
        setLectures(prevLectures);
        return { success: false, error: data.error || 'Failed to move lecture' };
      }

      if (data.version) {
        setVersions((prev) => [data.version, ...prev]);
        setCurrentVersion(data.version);
      }
      return { success: true };
    } catch (e: any) {
      setLectures(prevLectures);
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !subjectCode) return;

    const endTimeMap: Record<string, string> = {
      '10:00': '11:00',
      '11:00': '12:00',
      '12:00': '13:00',
      '14:00': '15:00',
      '15:00': '16:00',
    };

    const newLecPayload = {
      day: selectedSlot.day as any,
      startTime: selectedSlot.time,
      endTime: endTimeMap[selectedSlot.time] || '11:00',
      subject,
      subjectCode,
      facultyId: 'usr_fac_1',
      facultyName,
      room,
      department: 'Computer Science & Engineering',
      semester: 4,
    };

    try {
      const res = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lecture: newLecPayload,
          actorId: 'usr_hod_1',
          actorName: 'Dr. Ananya Sharma',
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchTimetable();
        setAddModalOpen(false);
        setSubject('');
        setSubjectCode('');
      }
    } catch (e) {}
  };

  const handleDeleteLecture = async (lectureId: string) => {
    try {
      const res = await fetch(`/api/timetable?lectureId=${lectureId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchTimetable();
        setSelectedLecture(null);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e2dfd5]">
        <div>
          <h1 className="text-2xl font-black text-[#344e41] tracking-tight">Master Timetable Editor</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Drag and drop lectures across days/slots. System automatically re-evaluates active gate passes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#588157]/10 text-[#344e41] border border-[#a3b18a]/30">
            Active: Timetable v{currentVersion?.version || 1}
          </span>
          <button
            onClick={() => {
              setSelectedSlot({ day: 'MON', time: '10:00' });
              setAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#588157] text-white font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Lecture
          </button>
        </div>
      </div>

      {/* Main Drag-and-Drop Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
          <span>Weekly Schedule (Computer Science - Sem 4)</span>
          <span className="text-[#588157] text-[11px] font-semibold">✨ Drag any card to reschedule</span>
        </div>

        <TimetableGrid
          lectures={lectures}
          interactive={true}
          onLectureMove={handleLectureMove}
          onLectureClick={(lec) => setSelectedLecture(lec)}
          onAddLectureClick={(day, time) => {
            setSelectedSlot({ day, time });
            setAddModalOpen(true);
          }}
        />
      </div>

      {/* Version History (Compact) */}
      <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#344e41] uppercase tracking-wider">
          <History className="h-4 w-4 text-[#588157]" />
          <span>Audit Version History</span>
        </div>

        <div className="divide-y divide-[#e2dfd5] text-xs">
          {versions.slice(0, 5).map((ver) => (
            <div key={ver.version} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
              <div>
                <span className="font-bold text-[#344e41]">v{ver.version}</span>
                <span className="text-gray-600 ml-2">{ver.changeSummary}</span>
              </div>
              <div className="text-[11px] text-gray-400">
                <span>{ver.modifiedByName}</span> • {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lecture Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e2dfd5] p-6 max-w-md w-full space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#344e41]">Schedule New Lecture</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddLecture} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#344e41] mb-1">Day</label>
                  <select
                    value={selectedSlot.day}
                    onChange={(e) => setSelectedSlot({ ...selectedSlot, day: e.target.value })}
                    className="w-full p-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium"
                  >
                    <option value="MON">Monday</option>
                    <option value="TUE">Tuesday</option>
                    <option value="WED">Wednesday</option>
                    <option value="THU">Thursday</option>
                    <option value="FRI">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#344e41] mb-1">Start Time</label>
                  <select
                    value={selectedSlot.time}
                    onChange={(e) => setSelectedSlot({ ...selectedSlot, time: e.target.value })}
                    className="w-full p-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium"
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#344e41] mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Cloud Systems"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full p-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#344e41] mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="CS405"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    required
                    className="w-full p-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#344e41] mb-1">Room</label>
                  <input
                    type="text"
                    placeholder="Hall 302"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    required
                    className="w-full p-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#344e41] mb-1">Assigned Faculty</label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  required
                  className="w-full p-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="w-1/2 py-2 border border-[#e2dfd5] rounded-xl text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#588157] text-white rounded-xl font-bold shadow-xs hover:bg-[#3a5a40]"
                >
                  Save Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View / Delete Lecture Modal */}
      {selectedLecture && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e2dfd5] p-6 max-w-sm w-full space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-[#588157] text-xs">{selectedLecture.subjectCode}</span>
                <h3 className="font-bold text-base text-[#344e41]">{selectedLecture.subject}</h3>
              </div>
              <button onClick={() => setSelectedLecture(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs space-y-2 p-3 bg-[#fafaf7] rounded-xl border border-[#e2dfd5]">
              <div><strong>Time:</strong> {selectedLecture.day} • {selectedLecture.startTime} – {selectedLecture.endTime}</div>
              <div><strong>Faculty:</strong> {selectedLecture.facultyName}</div>
              <div><strong>Classroom:</strong> {selectedLecture.room}</div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedLecture(null)}
                className="w-1/2 py-2 border border-[#e2dfd5] rounded-xl text-gray-600 font-semibold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLecture(selectedLecture.id)}
                className="w-1/2 py-2 bg-red-50 hover:bg-red-100 text-[#c62828] border border-red-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
