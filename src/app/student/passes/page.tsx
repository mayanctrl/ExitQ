'use client';

import React, { useEffect, useState } from 'react';
import { ExitApplication, ExitPermission, QRToken, Student } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { QRDisplayModal } from '@/components/ui/QRDisplayModal';
import { Ticket, QrCode, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StudentPassesPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<ExitApplication[]>([]);
  const [permissions, setPermissions] = useState<ExitPermission[]>([]);
  const [qrTokens, setQrTokens] = useState<Map<string, QRToken>>(new Map());
  const [selectedApp, setSelectedApp] = useState<ExitApplication | null>(null);
  const [selectedQrToken, setSelectedQrToken] = useState<QRToken | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === 'STUDENT') {
          const studentUser = data.user as Student;
          setStudent(studentUser);

          fetch(`/api/applications?studentId=${studentUser.id}`)
            .then((res) => res.json())
            .then((appData) => {
              const apps: ExitApplication[] = appData.applications || [];
              setApplications(apps);

              // Fetch real QR tokens for each approved application
              const approvedApps = apps.filter(
                (a) =>
                  a.status === 'APPROVED_CONDITIONAL' ||
                  a.status === 'APPROVED_LOCKED' ||
                  a.status === 'REVOKED' ||
                  a.status === 'USED'
              );

              Promise.all(
                approvedApps.map((app) =>
                  fetch(`/api/qr?applicationId=${app.id}`)
                    .then((res) => res.json())
                    .then((qrData) => ({ appId: app.id, qrToken: qrData.qrToken as QRToken | null }))
                )
              ).then((results) => {
                const tokenMap = new Map<string, QRToken>();
                results.forEach(({ appId, qrToken }) => {
                  if (qrToken) {
                    tokenMap.set(appId, qrToken);
                  }
                });
                setQrTokens(tokenMap);
              });
            });

          fetch('/api/permissions')
            .then((res) => res.json())
            .then((permData) => setPermissions(permData.permissions || []));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openPassModal = (app: ExitApplication) => {
    const realToken = qrTokens.get(app.id);
    setSelectedApp(app);
    setSelectedQrToken(realToken || null);
    setModalOpen(true);
  };

  const getLinkedPermission = (appId: string) => permissions.find((p) => p.applicationId === appId);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="h-8 w-8 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#344e41]">Loading Student passes...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#e2dfd5] text-center space-y-4 max-w-md mx-auto my-12">
        <p className="text-xs font-bold text-red-500">Not authenticated as a Student.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-[#344e41] text-white rounded-xl text-xs">
          Go to Login Page
        </Link>
      </div>
    );
  }

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
                  {app.status !== 'REJECTED' && app.status !== 'PENDING' && (
                    <button
                      onClick={() => openPassModal(app)}
                      className="px-4 py-2 bg-[#344e41] text-[#dad7cd] font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <QrCode className="h-4 w-4 text-[#a3b18a]" /> Show QR Pass
                    </button>
                  )}
                </div>

                {/* Revoked Warning Banner */}
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

      {/* QR Modal — now uses REAL token from API */}
      {selectedApp && (
        <QRDisplayModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          application={selectedApp}
          permission={getLinkedPermission(selectedApp.id)}
          qrToken={selectedQrToken || undefined}
        />
      )}
    </div>
  );
}
