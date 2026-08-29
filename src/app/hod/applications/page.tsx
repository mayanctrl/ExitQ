'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Search, Filter, FileCheck2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HODApplicationsPage() {
  const [applications, setApplications] = useState<ExitApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []));
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesStatus = filterStatus === 'ALL' || app.status.includes(filterStatus);
    const matchesSearch =
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.reasonDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Exit Applications</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review, evaluate, and authorize student campus exit permissions
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'REVOKED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#344e41] text-[#dad7cd] shadow-xs'
                  : 'bg-[#fafaf7] text-[#344e41] hover:bg-[#dad7cd]/30 border border-[#e2dfd5]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by ID, name, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-semibold text-[#344e41] placeholder:text-gray-400 focus:outline-none focus:border-[#588157]"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs space-y-4">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileCheck2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-bold text-[#344e41]">No applications found</p>
            <p className="text-[11px] text-gray-400">Try adjusting your filter or search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2dfd5] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">APP ID</th>
                  <th className="py-3 px-3">STUDENT</th>
                  <th className="py-3 px-3">REASON & DESTINATION</th>
                  <th className="py-3 px-3">TIME WINDOW</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2dfd5]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fafaf7] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#344e41]">{app.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#344e41]">{app.studentName}</div>
                      <div className="text-[10px] text-gray-400">{app.studentRoll} • Sem {app.semester}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#344e41]">{app.reasonCategory}</div>
                      <div className="text-[11px] text-gray-500">{app.destination}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#344e41]">
                      {app.exitTime} – {app.expectedReturnTime} ({app.date})
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} permissionType={app.permissionType} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/hod/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-lg hover:bg-[#3a5a40] transition-colors"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
