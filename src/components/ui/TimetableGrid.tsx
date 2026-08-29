'use client';

import React, { useState } from 'react';
import { Lecture } from '@/lib/types';
import { Clock, MapPin, User, GripVertical, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

interface TimetableGridProps {
  lectures: Lecture[];
  onLectureMove?: (
    lecture: Lecture,
    targetDay: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT',
    targetStartTime: string,
    targetEndTime: string
  ) => Promise<{ success: boolean; error?: string } | void>;
  onLectureClick?: (lecture: Lecture) => void;
  onAddLectureClick?: (day: string, time: string) => void;
  interactive?: boolean;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'] as const;
const SLOTS = [
  { time: '10:00', endTime: '11:00', label: '10:00 AM - 11:00 AM' },
  { time: '11:00', endTime: '12:00', label: '11:00 AM - 12:00 PM' },
  { time: '12:00', endTime: '13:00', label: '12:00 PM - 01:00 PM' },
  { time: '13:00', endTime: '14:00', label: '01:00 PM - 02:00 PM (LUNCH)' },
  { time: '14:00', endTime: '15:00', label: '02:00 PM - 03:00 PM' },
  { time: '15:00', endTime: '16:00', label: '03:00 PM - 04:00 PM' },
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  lectures,
  onLectureMove,
  onLectureClick,
  onAddLectureClick,
  interactive = false,
}) => {
  const [draggedLecture, setDraggedLecture] = useState<Lecture | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: string; time: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handleDragStart = (e: React.DragEvent, lecture: Lecture) => {
    if (!interactive) return;
    setDraggedLecture(lecture);
    e.dataTransfer.setData('text/plain', lecture.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, day: string, time: string) => {
    if (!interactive || !draggedLecture) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlot?.day !== day || dragOverSlot?.time !== time) {
      setDragOverSlot({ day, time });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!interactive) return;
    setDragOverSlot(null);
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetDay: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT',
    targetStartTime: string,
    targetEndTime: string
  ) => {
    e.preventDefault();
    setDragOverSlot(null);

    if (!interactive || !draggedLecture || !onLectureMove) return;

    // Dropped in same place
    if (draggedLecture.day === targetDay && draggedLecture.startTime === targetStartTime) {
      setDraggedLecture(null);
      return;
    }

    // Check target slot collision
    const existing = lectures.find(
      (l) => l.id !== draggedLecture.id && l.day === targetDay && l.startTime === targetStartTime
    );

    if (existing) {
      showError(`Time slot already occupied by ${existing.subjectCode} (${existing.subject}).`);
      setDraggedLecture(null);
      return;
    }

    const res = await onLectureMove(draggedLecture, targetDay, targetStartTime, targetEndTime);
    setDraggedLecture(null);

    if (res && !res.success) {
      showError(res.error || 'Failed to move lecture');
    } else {
      showToast(`Timetable updated — ${draggedLecture.subjectCode} moved to ${targetDay} ${targetStartTime}`);
    }
  };

  if (lectures.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2dfd5] p-12 text-center space-y-3">
        <Clock className="h-10 w-10 text-gray-300 mx-auto" />
        <h3 className="font-bold text-sm text-[#344e41]">No Timetable Configured</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          No scheduled lectures found for this semester. Create or upload a timetable to activate exit intelligence.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold shadow-xs animate-in fade-in duration-150">
          <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#e2dfd5] shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#fafaf7] border-b border-[#e2dfd5] text-[11px] font-bold text-[#344e41] uppercase tracking-wider">
              <th className="py-3 px-3.5 w-36 border-r border-[#e2dfd5]">TIME SLOT</th>
              {DAYS.map((day) => (
                <th key={day} className="py-3 px-3.5 border-r border-[#e2dfd5] last:border-r-0 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2dfd5] text-xs">
            {SLOTS.map((slot) => {
              const isLunch = slot.time === '13:00';

              if (isLunch) {
                return (
                  <tr key={slot.time} className="bg-[#fafaf7]/60 text-center">
                    <td className="py-2.5 px-3.5 font-bold text-gray-400 border-r border-[#e2dfd5] text-[11px]">
                      {slot.time}
                    </td>
                    <td colSpan={5} className="py-2.5 px-4 font-bold text-gray-400 tracking-widest text-[10px] uppercase">
                      — CAMPUS LUNCH RECESS —
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={slot.time} className="hover:bg-[#fafaf7]/30 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#344e41] border-r border-[#e2dfd5] bg-[#fafaf7]/20 text-[11px]">
                    {slot.time} – {slot.endTime}
                  </td>
                  {DAYS.map((day) => {
                    const lec = lectures.find((l) => l.day === day && l.startTime === slot.time);
                    const isDragOver = dragOverSlot?.day === day && dragOverSlot?.time === slot.time;

                    return (
                      <td
                        key={day}
                        onDragOver={(e) => handleDragOver(e, day, slot.time)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, slot.time, slot.endTime)}
                        className={`p-1.5 border-r border-[#e2dfd5] last:border-r-0 align-top transition-all ${
                          isDragOver ? 'bg-[#588157]/15 ring-2 ring-inset ring-[#588157]' : ''
                        }`}
                      >
                        {lec ? (
                          <div
                            draggable={interactive}
                            onDragStart={(e) => handleDragStart(e, lec)}
                            onClick={() => onLectureClick && onLectureClick(lec)}
                            className={`p-2.5 rounded-xl border select-none transition-all ${
                              draggedLecture?.id === lec.id ? 'opacity-40 scale-95 border-dashed border-[#588157]' : ''
                            } ${
                              lec.isExtra
                                ? 'bg-[#fff8e1] border-[#ffe082] text-[#b78103]'
                                : 'bg-[#fafaf7] border-[#e2dfd5] text-[#344e41] hover:border-[#588157]'
                            } ${interactive ? 'cursor-grab active:cursor-grabbing hover:shadow-xs' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[11px] truncate">{lec.subjectCode}</span>
                              {interactive && (
                                <GripVertical className="h-3 w-3 text-gray-400 opacity-60 hover:opacity-100" />
                              )}
                            </div>
                            <p className="font-bold text-xs mt-0.5 leading-snug truncate">{lec.subject}</p>
                            <div className="mt-2 pt-1 border-t border-black/5 text-[10px] text-gray-500 space-y-0.5">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-[#588157]" /> <span className="truncate">{lec.facultyName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" /> <span>{lec.room}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => onAddLectureClick && onAddLectureClick(day, slot.time)}
                            className={`h-20 rounded-xl border border-dashed border-[#e2dfd5] bg-[#fafaf7]/10 flex flex-col items-center justify-center text-[10px] font-semibold text-gray-400 transition-colors ${
                              interactive ? 'cursor-pointer hover:bg-[#588157]/5 hover:border-[#588157]/40 hover:text-[#588157]' : ''
                            }`}
                          >
                            {isDragOver ? (
                              <span className="text-[#588157] font-bold">Drop Here</span>
                            ) : interactive && onAddLectureClick ? (
                              <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add</span>
                              </div>
                            ) : (
                              <span>FREE</span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
