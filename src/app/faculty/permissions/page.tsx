'use client';

import React, { useEffect, useState } from 'react';
import { ExitPermission } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function FacultyPermissionsPage() {
  const [permissions, setPermissions] = useState<ExitPermission[]>([]);

  useEffect(() => {
    fetch('/api/permissions')
      .then((res) => res.json())
      .then((data) => setPermissions(data.permissions || []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Relevant Student Exit Permissions</h1>
        <p className="text-xs text-gray-500 mt-0.5">Approved student gate passes for your department</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">PERM ID</th>
                <th className="py-3 px-3">APP ID</th>
                <th className="py-3 px-3">TYPE</th>
                <th className="py-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2dfd5]">
              {permissions.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-3 font-bold text-[#344e41]">{p.id}</td>
                  <td className="py-3 px-3 font-semibold text-[#344e41]">{p.applicationId}</td>
                  <td className="py-3 px-3 font-semibold text-[#344e41]">{p.permissionType}</td>
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
