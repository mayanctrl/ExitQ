'use client';

import React, { useEffect, useState } from 'react';
import { AuditLogEntry } from '@/lib/types';
import { Clock, ShieldCheck } from 'lucide-react';

export default function GuardExitsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => {
        const gateLogs = (data.auditLogs || []).filter((l: AuditLogEntry) => l.action.startsWith('GATE_'));
        setLogs(gateLogs);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Today's Gate Exits & Returns</h1>
        <p className="text-xs text-gray-500 mt-0.5">Chronological log of verified student movements at Gate 1</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">TIME</th>
                <th className="py-3 px-3">ACTION</th>
                <th className="py-3 px-3">STUDENT / TARGET</th>
                <th className="py-3 px-3">SECURITY GUARD</th>
                <th className="py-3 px-3">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2dfd5]">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-[#fafaf7] transition-colors">
                  <td className="py-3 px-3 font-semibold text-gray-500 text-[11px]">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#588157]">{l.action}</td>
                  <td className="py-3 px-3 font-semibold text-[#344e41]">{l.target}</td>
                  <td className="py-3 px-3 text-gray-600">{l.actorName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                      {l.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
