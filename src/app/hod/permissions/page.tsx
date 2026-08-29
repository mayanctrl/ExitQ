'use client';

import React, { useEffect, useState } from 'react';
import { ExitPermission } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ShieldCheck, Search, Lock, Zap } from 'lucide-react';

export default function HODPermissionsPage() {
  const [permissions, setPermissions] = useState<ExitPermission[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/permissions')
      .then((res) => res.json())
      .then((data) => setPermissions(data.permissions || []));
  }, []);

  const filtered = permissions.filter((p) => filterType === 'ALL' || p.permissionType === filterType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Active Exit Permissions</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Monitor conditional and locked permissions currently active across campus
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] shadow-xs flex justify-between items-center">
        <div className="flex gap-2">
          {['ALL', 'CONDITIONAL', 'LOCKED'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#344e41] text-[#dad7cd]'
                  : 'bg-[#fafaf7] text-[#344e41] border border-[#e2dfd5]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="text-xs font-bold text-[#588157]">Total Active: {filtered.length}</div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">PERM ID</th>
                <th className="py-3 px-3">APPLICATION</th>
                <th className="py-3 px-3">PERMISSION TYPE</th>
                <th className="py-3 px-3">GROUP COUNT</th>
                <th className="py-3 px-3">HOD REMARK</th>
                <th className="py-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2dfd5]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#fafaf7] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#344e41]">{p.id}</td>
                  <td className="py-3 px-3 font-semibold text-[#344e41]">{p.applicationId}</td>
                  <td className="py-3 px-3">
                    {p.permissionType === 'LOCKED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a237e]">
                        <Lock className="h-3 w-3" /> LOCKED (Protected)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2e7d32]">
                        <Zap className="h-3 w-3" /> CONDITIONAL
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#344e41]">{p.groupCount} Student(s)</td>
                  <td className="py-3 px-3 text-gray-600 italic">"{p.hodRemark || 'None'}"</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={p.status} permissionType={p.permissionType} size="sm" />
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
