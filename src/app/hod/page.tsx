'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication, AuditLogEntry, Student } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Users,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  Search,
  ArrowRight,
  Clock,
  UserPlus,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export default function HODDashboard() {
  const [applications, setApplications] = useState<ExitApplication[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []));

    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []));

    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => setAuditLogs(data.auditLogs || []));
  }, []);

  const pendingApps = applications.filter((a) => a.status === 'PENDING');
  const outsideStudents = students.filter((s) => s.isOutside);
  const activePermissions = applications.filter(
    (a) => a.status === 'APPROVED_CONDITIONAL' || a.status === 'APPROVED_LOCKED'
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      window.location.href = `/hod/applications/${searchId.trim().toUpperCase()}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2dfd5]">
        <div>
          <h1 className="text-2xl font-black text-[#344e41] tracking-tight">HOD Control Center</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Campus exit authorization, timetable intelligence, and live student tracking
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search App ID (e.g. EXQ-10495)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-8 pr-3 py-2 bg-white border border-[#e2dfd5] rounded-xl text-xs font-semibold text-[#344e41] placeholder:text-gray-400 focus:outline-none focus:border-[#588157] w-60"
            />
          </div>
          <button
            type="submit"
            disabled={!searchId.trim()}
            className="px-3 py-2 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-xl hover:bg-[#3a5a40] disabled:opacity-50 transition-colors cursor-pointer"
          >
            Review
          </button>
        </form>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">PENDING DECISIONS</span>
          <div className="text-2xl font-black text-[#b78103] mt-1">{pendingApps.length}</div>
          <p className="text-[11px] text-gray-500">Requires Authorization</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CURRENTLY OUTSIDE</span>
          <div className="text-2xl font-black text-[#c62828] mt-1">{outsideStudents.length}</div>
          <p className="text-[11px] text-gray-500">Verified at Gates</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">ACTIVE PASSES</span>
          <div className="text-2xl font-black text-[#2e7d32] mt-1">{activePermissions.length}</div>
          <p className="text-[11px] text-gray-500">Valid QR Gate Passes</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2dfd5] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">TOTAL STUDENTS</span>
          <div className="text-2xl font-black text-[#344e41] mt-1">{students.length}</div>
          <p className="text-[11px] text-gray-500">Enrolled in Department</p>
        </div>
      </div>

      {/* Pending Applications Section */}
      <div className="bg-white rounded-2xl border border-[#e2dfd5] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#344e41] uppercase tracking-wider">Pending Student Requests</h2>
            <p className="text-xs text-gray-500">Review reason, group details, and issue Conditional or Locked gate passes</p>
          </div>
          <Link href="/hod/applications" className="text-xs font-bold text-[#588157] hover:underline">
            View All →
          </Link>
        </div>

        {pendingApps.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#e2dfd5] rounded-xl text-xs text-gray-400">
            No pending exit requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">STUDENT</th>
                  <th className="py-2.5 px-3">PURPOSE</th>
                  <th className="py-2.5 px-3">TIME WINDOW</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2dfd5]">
                {pendingApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fafaf7] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#344e41]">{app.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#344e41]">
                      {app.studentName}
                      <span className="block text-[10px] text-gray-400 font-normal">{app.studentRoll}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#344e41] block">{app.reasonCategory}</span>
                      <span className="text-[11px] text-gray-500 truncate block max-w-xs">{app.reasonDescription}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#344e41]">
                      {app.exitTime} – {app.expectedReturnTime}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/hod/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-lg hover:bg-[#588157] transition-colors"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Audit Feed */}
      <div className="bg-white rounded-2xl border border-[#e2dfd5] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#344e41] uppercase tracking-wider">Gate Activity Stream</h2>
          <Link href="/hod/audit" className="text-xs font-bold text-[#588157] hover:underline">
            Full Audit Trail →
          </Link>
        </div>

        <div className="divide-y divide-[#e2dfd5] text-xs">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
              <div>
                <span className="font-bold text-[#344e41]">{log.action}</span>
                <span className="text-gray-600 ml-2">{log.target}</span>
                {log.reason && <p className="text-[11px] text-gray-500 mt-0.5">{log.reason}</p>}
              </div>
              <div className="text-right text-[11px] text-gray-400">
                <span className="font-semibold text-[#344e41] block">{log.actorName}</span>
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
