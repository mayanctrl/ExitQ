'use client';

import React from 'react';
import { Lecture } from '@/lib/types';
import { Clock, MapPin, User, Sparkles } from 'lucide-react';

interface TimetableGridProps {
  lectures: Lecture[];
  onLectureClick?: (lecture: Lecture) => void;
  interactive?: boolean;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'] as const;
const SLOTS = [
  { time: '10:00', label: '10:00 AM - 11:00 AM' },
  { time: '11:00', label: '11:00 AM - 12:00 PM' },
  { time: '12:00', label: '12:00 PM - 01:00 PM' },
  { time: '13:00', label: '01:00 PM - 02:00 PM (LUNCH)' },
  { time: '14:00', label: '02:00 PM - 03:00 PM' },
  { time: '15:00', label: '03:00 PM - 04:00 PM' },
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({ lectures, onLectureClick, interactive = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e2dfd5] shadow-xs overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-[#fafaf7] border-b border-[#e2dfd5] text-[11px] font-bold text-[#344e41] uppercase tracking-wider">
            <th className="py-3 px-4 w-36 border-r border-[#e2dfd5]">TIME SLOT</th>
            {DAYS.map((day) => (
              <th key={day} className="py-3 px-4 border-r border-[#e2dfd5] last:border-r-0 text-center">
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
                <tr key={slot.time} className="bg-[#fafaf7]/80 text-center">
                  <td className="py-2.5 px-4 font-bold text-gray-400 border-r border-[#e2dfd5] text-[11px]">
                    {slot.time}
                  </td>
                  <td colSpan={5} className="py-2.5 px-4 font-bold text-gray-400 tracking-widest text-[10px] uppercase">
                    — CAMPUS LUNCH BREAK —
                  </td>
                </tr>
              );
            }

            return (
              <tr key={slot.time} className="hover:bg-[#fafaf7]/50 transition-colors">
                <td className="py-3 px-4 font-bold text-[#344e41] border-r border-[#e2dfd5] bg-[#fafaf7]/40 text-[11px]">
                  {slot.time}
                </td>
                {DAYS.map((day) => {
                  const lec = lectures.find((l) => l.day === day && l.startTime === slot.time);

                  return (
                    <td key={day} className="p-2 border-r border-[#e2dfd5] last:border-r-0 align-top">
                      {lec ? (
                        <div
                          onClick={() => onLectureClick && onLectureClick(lec)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            lec.isExtra
                              ? 'bg-[#fff8e1] border-[#ffe082] text-[#b78103]'
                              : 'bg-[#fafaf7] border-[#e2dfd5] text-[#344e41] hover:border-[#588157]'
                          } ${interactive ? 'cursor-pointer hover:shadow-xs' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] truncate">{lec.subjectCode}</span>
                            {lec.isExtra && (
                              <span className="text-[9px] font-extrabold px-1 rounded bg-[#b78103] text-white">
                                EXTRA
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-xs mt-0.5 leading-tight">{lec.subject}</p>
                          <div className="mt-2 pt-1 border-t border-black/5 text-[10px] text-gray-500 space-y-0.5">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-[#588157]" /> {lec.facultyName}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" /> {lec.room}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-20 rounded-xl border border-dashed border-[#e2dfd5] bg-[#fafaf7]/20 flex items-center justify-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          FREE
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
  );
};
