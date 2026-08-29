'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication, ExitPermission, QRToken } from '@/lib/types';
import { SEED_STUDENTS } from '@/lib/seed';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { QRDisplayModal } from '@/components/ui/QRDisplayModal';
import { Ticket, QrCode, AlertCircle, CheckCircle2, Lock, Zap } from 'lucide-react';

export default function StudentPassesPage() {
  const student = SEED_STUDENTS[0];
  const [applications, setApplications] = useState<ExitApplication[]>([]);
  const [permissions, setPermissions] = useState<ExitPermission[]>([]);
  const [selectedApp, setSelectedApp] = useState<ExitApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/applications?studentId=${student.id}`)
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []));

    fetch('/api/permissions')
      .then((res) => res.json())
      .then((data) => setPermissions(data.permissions || []));
  }, []);

  const openPassModal = (app: ExitApplication) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  const getLinkedPermission = (appId: string) => permissions.find((p) => p.applicationId === appId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">My Passes & QR Inbox</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Active exit permissions, digital single-use QR gate passes, and revocation notices
        </p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#e2dfd5] text-center space-y-2">
            <Ticket className="h-10 w-10 text-gray-300 mx-auto" />
            <h3 className="font-bold text-sm text-[#344e41]">No Exit Passes Issued</h3>
            <p className="text-xs text-gray-400">You don't have any exit passes in your inbox.</p>
          </div>
        ) : (
          applications.map((app) => {
            const perm = getLinkedPermission(app.id);
            const isRevoked = app.status === 'REVOKED' || perm?.status === 'REVOKED';

            return (
              <div
                key={app.id}
                className={`bg-white rounded-3xl border-2 p-6 shadow-xs space-y-4 transition-all ${
                  isRevoked
                    ? 'border-[#ffcdd2] bg-[#fff8f8]'
                    : app.permissionType === 'LOCKED'
                    ? 'border-[#c5cae9]'
                    : 'border-[#e2dfd5]'
                }`}
              >
                {/* Top Pass Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#344e41] text-lg">{app.id}</span>
                      <StatusBadge status={app.status} permissionType={app.permissionType} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {app.reasonCategory} • {app.destination}
                    </p>
                  </div>

                  {/* QR Button */}
                  {app.status !== 'REJECTED' && (
                    <button
                      onClick={() => openPassModal(app)}
                      className="px-4 py-2 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <QrCode className="h-4 w-4 text-[#a3b18a]" /> Show QR Pass
                    </button>
                  )}
                </div>

                {/* Revoked Warning Banner (Spec item 27) */}
                {isRevoked && (
                  <div className="p-3 bg-[#ffebee] border border-[#ffcdd2] rounded-2xl text-xs space-y-1">
                    <div className="font-extrabold text-[#c62828] flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 shrink-0" /> PASS REVOKED BY EXITQ ENGINE
                    </div>
                    <p className="text-[11px] text-[#b71c1c] font-medium leading-snug">
                      Reason: {perm?.revocationReason || 'An extra lecture was scheduled by Faculty during your approved exit period.'}
                    </p>
                  </div>
                )}

                {/* Pass Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#fafaf7] p-3.5 rounded-2xl border border-[#e2dfd5]">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">DATE</span>
                    <span className="font-bold text-[#344e41]">{app.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">TIME WINDOW</span>
                    <span className="font-bold text-[#344e41]">{app.exitTime} – {app.expectedReturnTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">PERMISSION TYPE</span>
                    <span className="font-bold text-[#344e41]">{app.permissionType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">GROUP SIZE</span>
                    <span className="font-bold text-[#344e41]">{(app.accompanyingCount || 0) + 1} Student(s)</span>
                  </div>
                </div>

                {app.hodRemark && (
                  <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-[#e2dfd5]">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">HOD REMARK:</span>
                    <p className="italic font-medium text-[#344e41] mt-0.5">"{app.hodRemark}"</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* QR Modal */}
      {selectedApp && (
        <QRDisplayModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          application={selectedApp}
          permission={getLinkedPermission(selectedApp.id)}
          qrToken={{
            id: 'qr_demo',
            token: `exq_tok_${selectedApp.id.toLowerCase()}`,
            permissionId: selectedApp.id,
            applicationId: selectedApp.id,
            studentId: student.id,
            studentName: student.name,
            expiresAt: selectedApp.expectedReturnTime,
            isUsed: selectedApp.status === 'USED',
          }}
        />
      )}
    </div>
  );
}
