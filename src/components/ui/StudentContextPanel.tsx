'use client';

import React from 'react';
import { Student, ExitApplication } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { User, Phone, Mail, GraduationCap, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface StudentContextPanelProps {
  student: Student;
  studentHistory: ExitApplication[];
}

export const StudentContextPanel: React.FC<StudentContextPanelProps> = ({ student, studentHistory }) => {
  return (
    <div className="bg-[#fafaf7] border border-[#e2dfd5] rounded-2xl p-5 space-y-5">
      {/* Header Profile */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#e2dfd5]">
        <div className="h-12 w-12 rounded-xl bg-[#344e41] text-[#dad7cd] font-bold flex items-center justify-center text-lg shadow-xs">
          {student.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#344e41] text-base">{student.name}</h3>
            {student.isOutside ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]">
                OUTSIDE CAMPUS
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                INSIDE CAMPUS
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {student.studentId} • {student.department} (Sem {student.semester})
          </p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white p-2.5 rounded-xl border border-[#e2dfd5]">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Total</div>
          <div className="text-base font-bold text-[#344e41] mt-0.5">{student.totalExits}</div>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-[#e2dfd5]">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Approved</div>
          <div className="text-base font-bold text-[#2e7d32] mt-0.5">{student.approvedExits}</div>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-[#e2dfd5]">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Rejected</div>
          <div className="text-base font-bold text-[#c62828] mt-0.5">{student.rejectedExits}</div>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-[#e2dfd5]">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Attendance</div>
          <div className={`text-base font-bold mt-0.5 ${student.attendancePercentage >= 75 ? 'text-[#2e7d32]' : 'text-[#c62828]'}`}>
            {student.attendancePercentage}%
          </div>
        </div>
      </div>

      {/* Guardian & TG Info */}
      <div className="bg-white p-3.5 rounded-xl border border-[#e2dfd5] space-y-2 text-xs">
        <div className="font-bold text-[#344e41] text-xs uppercase tracking-wider flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-[#588157]" />
          Guardian & TG Details
        </div>
        <div className="grid grid-cols-2 gap-2 text-gray-600 pt-1">
          <div>
            <span className="text-[10px] text-gray-400 font-semibold block">PARENT / GUARDIAN</span>
            <span className="font-bold text-[#344e41]">{student.guardian?.name}</span> ({student.guardian?.relation})
            <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3 text-[#588157]" /> {student.guardian?.phone}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-semibold block">TEACHER GUARDIAN (TG)</span>
            <span className="font-bold text-[#344e41]">{student.teacherGuardianName || 'Prof. Rajesh Kumar'}</span>
          </div>
        </div>
      </div>

      {/* Previous Exits History */}
      <div className="space-y-2">
        <div className="font-bold text-[#344e41] text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#588157]" />
          Recent Exit History ({studentHistory.length})
        </div>

        {studentHistory.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No previous exit history.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {studentHistory.map((h) => (
              <div key={h.id} className="bg-white p-2.5 rounded-xl border border-[#e2dfd5] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#344e41]">{h.id} • {h.reasonCategory}</div>
                  <div className="text-[11px] text-gray-500">{h.date} ({h.exitTime} - {h.expectedReturnTime})</div>
                </div>
                <StatusBadge status={h.status} permissionType={h.permissionType} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
