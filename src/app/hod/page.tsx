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
  ExternalLink,
  PlusCircle,
  ShieldAlert,
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
      {/* Header Greeting & Application ID Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#588157] uppercase tracking-wider">
            CAMPUS AUTHORIZATION ENGINE
          </span>
          <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight mt-0.5">
            Good morning, Dr. Ananya Sharma
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Computer Science & Engineering • Semester 4 Operational View
          </p>
        </div>

        {/* Enter Application ID Box (Spec item 10) */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Enter App ID (e.g. EXQ-10495)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-bold text-[#344e41] placeholder:text-gray-400 focus:outline-none focus:border-[#588157]"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            disabled={!searchId.trim()}
            className="px-4 py-2.5 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-xl hover:bg-[#3a5a40] disabled:opacity-50 transition-colors cursor-pointer"
          >
            Review
          </button>
        </form>
      </div>

      {/* Operational Metrics Cards (Spec item 39) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Pending Approvals
            </span>
            <FileCheck2 className="h-5 w-5 text-[#b78103]" />
          </div>
          <div className="text-3xl font-extrabold text-[#344e41]">{pendingApps.length}</div>
          <p className="text-[11px] text-[#b78103] font-semibold">Requires HOD Action</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Currently Outside
            </span>
            <Users className="h-5 w-5 text-[#c62828]" />
          </div>
          <div className="text-3xl font-extrabold text-[#c62828]">{outsideStudents.length + 1}</div>
          <p className="text-[11px] text-gray-500 font-medium">Gate Exits Verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Permissions
            </span>
            <ShieldCheck className="h-5 w-5 text-[#2e7d32]" />
          </div>
          <div className="text-3xl font-extrabold text-[#2e7d32]">{activePermissions.length}</div>
          <p className="text-[11px] text-[#2e7d32] font-semibold">Valid Passes Today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Timetable Conflicts
            </span>
            <AlertTriangle className="h-5 w-5 text-[#d97706]" />
          </div>
          <div className="text-3xl font-extrabold text-[#344e41]">1</div>
          <p className="text-[11px] text-gray-500 font-medium">Auto-Evaluated Today</p>
        </div>
      </div>

      {/* Pending Applications Table Section */}
      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#344e41]">Pending Exit Applications</h2>
            <p className="text-xs text-gray-500">Applications waiting for HOD review and approval decision</p>
          </div>
          <Link
            href="/hod/applications"
            className="text-xs font-bold text-[#588157] hover:underline flex items-center gap-1"
          >
            View All Applications →
          </Link>
        </div>

        {pendingApps.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#e2dfd5] rounded-2xl">
            <ShieldCheck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#344e41]">No pending applications</p>
            <p className="text-[11px] text-gray-400">All student exit requests have been evaluated.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">APP ID</th>
                  <th className="py-3 px-3">STUDENT</th>
                  <th className="py-3 px-3">REASON</th>
                  <th className="py-3 px-3">EXIT TIME</th>
                  <th className="py-3 px-3">GROUP</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
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
                    <td className="py-3 px-3 text-gray-700">
                      <span className="font-semibold text-[#344e41] block">{app.reasonCategory}</span>
                      <span className="text-[11px] text-gray-500 truncate block max-w-xs">{app.reasonDescription}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#344e41]">
                      {app.exitTime} – {app.expectedReturnTime}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#344e41]">
                      {(app.accompanyingCount || 0) + 1} Student(s)
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/hod/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-lg hover:bg-[#3a5a40] transition-colors"
                      >
                        Review App →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Campus Security Activity Timeline */}
      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#344e41]">Recent Gate Security Activity</h2>
          <Link href="/hod/audit" className="text-xs font-bold text-[#588157] hover:underline">
            Full Audit Log →
          </Link>
        </div>

        <div className="space-y-3">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3 bg-[#fafaf7] rounded-2xl border border-[#e2dfd5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#588157]/10 text-[#588157]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-[#344e41]">{log.action} • {log.target}</div>
                  <div className="text-[11px] text-gray-500">{log.reason}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[11px] text-[#344e41]">{log.actorName} ({log.actorRole})</span>
                <span className="block text-[10px] text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
