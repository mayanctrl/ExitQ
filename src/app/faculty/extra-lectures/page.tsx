'use client';

import React, { useState } from 'react';
import { ExtraLecture, ExitPermission } from '@/lib/types';
import { SEED_FACULTY } from '@/lib/seed';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PlusCircle, Zap, ShieldAlert, CheckCircle2, Lock, AlertTriangle, Calendar, Clock, MapPin } from 'lucide-react';

export default function FacultyExtraLecturesPage() {
  const faculty = SEED_FACULTY[0];

  // Form State
  const [classBatch, setClassBatch] = useState('CS-SEM4');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [subject, setSubject] = useState('Operating Systems (OS) — Extra Problem Solving');
  const [room, setRoom] = useState('Lab 204');
  const [reason, setReason] = useState('Unexpected syllabus backlog catchup before mid-term evaluations.');

  // Result state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    extraLecture: ExtraLecture;
    affectedPermissions: ExitPermission[];
    unaffectedPermissions: ExitPermission[];
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    fetch('/api/timetable/extra-lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classBatch,
        date,
        startTime,
        endTime,
        subject,
        room,
        reason,
        facultyId: faculty.id,
        facultyName: faculty.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setResult({
            extraLecture: data.extraLecture,
            affectedPermissions: data.affectedPermissions || [],
            unaffectedPermissions: data.unaffectedPermissions || [],
          });
        }
      });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#588157]/10 text-[#3a5a40] text-xs font-bold uppercase tracking-wider mb-2">
          <Zap className="h-4 w-4" /> Core Intelligence Showcase
        </div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">
          Schedule Extra Lecture & Conflict Engine
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Schedule an unexpected lecture. ExitQ will re-evaluate active exit passes for conflicts in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Extra Lecture Schedule Form (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#344e41] uppercase tracking-wider flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-[#588157]" /> Extra Lecture Parameters
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#344e41] block mb-1">Target Class Batch</label>
              <select
                value={classBatch}
                onChange={(e) => setClassBatch(e.target.value)}
                className="w-full p-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
              >
                <option value="CS-SEM4">Computer Science & Engineering — Semester 4</option>
                <option value="CS-SEM6">Computer Science & Engineering — Semester 6</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#344e41] block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
                />
              </div>
              <div>
                <label className="font-bold text-[#344e41] block mb-1">Classroom / Lab</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full p-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#344e41] block mb-1">Start Time (24h)</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
                />
              </div>
              <div>
                <label className="font-bold text-[#344e41] block mb-1">End Time (24h)</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#344e41] block mb-1">Subject Title</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-semibold text-[#344e41]"
              />
            </div>

            <div>
              <label className="font-bold text-[#344e41] block mb-1">Faculty Official Reason</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#588157] text-white font-extrabold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Evaluating ExitQ Engine...</span>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-[#dad7cd]" /> Publish Extra Lecture & Evaluate Exit Passes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live ExitQ Evaluation Results (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#344e41] text-[#dad7cd] p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#a3b18a]" />
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                EXITQ CONFLICT RESOLUTION ENGINE
              </span>
            </div>
            <span className="text-[10px] bg-[#588157] text-white px-2 py-0.5 rounded font-bold">
              REAL-TIME AUTOMATION
            </span>
          </div>

          {!result ? (
            <div className="bg-white p-8 rounded-3xl border border-[#e2dfd5] text-center space-y-3">
              <Zap className="h-10 w-10 text-[#588157] mx-auto opacity-30" />
              <h3 className="font-bold text-sm text-[#344e41]">No Extra Lecture Submitted Yet</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Fill the form on the left and click Publish. ExitQ will immediately scan active student passes for overlap between {startTime} – {endTime}.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Extra Lecture Created Badge */}
              <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#344e41]">
                    [EXTRA LECTURE PUBLISHED] {result.extraLecture.subject}
                  </span>
                  <span className="text-[11px] font-bold text-[#b78103]">
                    {result.extraLecture.startTime} - {result.extraLecture.endTime}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{result.extraLecture.reason}</p>
              </div>

              {/* Affected / Revoked Conditional Permissions List */}
              <div className="bg-[#ffebee] p-4 rounded-2xl border border-[#ffcdd2] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#c62828] font-extrabold text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    CONDITIONAL PERMISSIONS AUTOMATICALLY REVOKED ({result.affectedPermissions.length})
                  </div>
                  <span className="text-[10px] font-bold bg-[#c62828] text-white px-2 py-0.5 rounded">
                    AUTO-REVOKED
                  </span>
                </div>

                {result.affectedPermissions.length === 0 ? (
                  <p className="text-xs text-gray-600 italic">No conditional permissions overlapped with this lecture.</p>
                ) : (
                  result.affectedPermissions.map((perm) => (
                    <div key={perm.id} className="p-3 bg-white rounded-xl border border-[#ffcdd2] text-xs space-y-1">
                      <div className="flex justify-between font-bold text-[#344e41]">
                        <span>Pass ID: {perm.applicationId || perm.id}</span>
                        <StatusBadge status="REVOKED" size="sm" />
                      </div>
                      <p className="text-[11px] text-[#b71c1c] font-medium leading-snug">
                        Reason: {perm.revocationReason}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Unaffected / Protected Locked Permissions List */}
              <div className="bg-[#e8eaf6] p-4 rounded-2xl border border-[#c5cae9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#1a237e] font-extrabold text-xs">
                    <Lock className="h-4 w-4" />
                    LOCKED PERMISSIONS REMAIN VALID ({result.unaffectedPermissions.length})
                  </div>
                  <span className="text-[10px] font-bold bg-[#1a237e] text-white px-2 py-0.5 rounded">
                    PROTECTED
                  </span>
                </div>

                {result.unaffectedPermissions.length === 0 ? (
                  <p className="text-xs text-gray-600 italic">No locked permissions were scheduled during this time.</p>
                ) : (
                  result.unaffectedPermissions.map((perm) => (
                    <div key={perm.id} className="p-3 bg-white rounded-xl border border-[#c5cae9] text-xs space-y-1">
                      <div className="flex justify-between font-bold text-[#344e41]">
                        <span>Pass ID: {perm.applicationId || perm.id}</span>
                        <StatusBadge permissionType="LOCKED" size="sm" />
                      </div>
                      <p className="text-[11px] text-[#1a237e] font-medium">
                        Status: Protected (Official Duty / Emergency pass granted by HOD resists extra lecture cancellation).
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
