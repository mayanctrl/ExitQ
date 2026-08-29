'use client';

import React, { useEffect, useState } from 'react';
import { AuditLogEntry } from '@/lib/types';
import { History, ShieldCheck, Filter, Clock } from 'lucide-react';

export default function HODAuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => setLogs(data.auditLogs || []));
  }, []);

  const filtered = logs.filter((l) => roleFilter === 'ALL' || l.actorRole === roleFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Audit Log & System Activity</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Immutable operational log of applications, approvals, QR scans, timetable modifications, and gate events
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] shadow-xs flex justify-between items-center">
        <div className="flex gap-2">
          {['ALL', 'HOD', 'FACULTY', 'GUARD', 'STUDENT'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-[#344e41] text-[#dad7cd]'
                  : 'bg-[#fafaf7] text-[#344e41] border border-[#e2dfd5]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="text-xs font-bold text-[#588157]">Total Recorded Events: {filtered.length}</div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">TIMESTAMP</th>
                <th className="py-3 px-3">ACTOR</th>
                <th className="py-3 px-3">ACTION</th>
                <th className="py-3 px-3">TARGET</th>
                <th className="py-3 px-3">RESULT</th>
                <th className="py-3 px-3">REASON / DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2dfd5]">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-[#fafaf7] transition-colors">
                  <td className="py-3 px-3 font-semibold text-gray-500 text-[11px]">
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#344e41]">
                    {l.actorName}
                    <span className="block text-[10px] text-gray-400 font-medium">{l.actorRole}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#588157]">{l.action}</td>
                  <td className="py-3 px-3 font-semibold text-[#344e41]">{l.target}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                      {l.result}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 italic">{l.reason || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
