'use client';

import React, { useState } from 'react';
import { DEMO_ACCOUNTS } from '@/lib/auth';
import { ShieldCheck, UserCheck, ArrowRight, QrCode, Clock, CalendarDays, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const handleLogin = (email: string, role: string) => {
    setLoadingEmail(email);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(() => {
      window.location.href = `/${role.toLowerCase()}`;
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col justify-between p-4 md:p-8">
      {/* Top Brand Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#344e41] text-[#dad7cd] font-bold text-xl shadow-md">
            EQ
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-[#344e41] tracking-tight">ExitQ</h1>
            <p className="text-xs text-[#588157] font-semibold">Smart Exit. Secure Campus.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#344e41] bg-[#dad7cd]/30 px-3 py-1.5 rounded-xl border border-[#a3b18a]/40">
          <span className="w-2 h-2 rounded-full bg-[#588157] animate-pulse" />
          Campus Authorization Engine Active
        </div>
      </header>

      {/* Main Hero & Role Launcher */}
      <main className="max-w-5xl mx-auto w-full my-auto py-8 space-y-10">
        {/* Title Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#588157]/10 text-[#3a5a40] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Timetable-Aware Gate-Pass Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#344e41] tracking-tight">
            Centralized Campus Exit Management
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            ExitQ continuously evaluates student exit permissions against live timetable schedules, extra lecture additions, and campus security geofences.
          </p>
        </div>

        {/* Role Selector Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2dfd5] pb-2">
            <span className="text-xs font-extrabold text-[#344e41] uppercase tracking-wider">
              SELECT DEMO ROLE INTERFACE TO EXPLORE
            </span>
            <span className="text-[11px] text-gray-400 font-medium">Click any role to launch interface</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_ACCOUNTS.map((acc) => {
              const roleColors = {
                HOD: 'border-[#344e41] hover:bg-[#344e41]/5',
                FACULTY: 'border-[#588157] hover:bg-[#588157]/5',
                GUARD: 'border-[#3a5a40] hover:bg-[#3a5a40]/5',
                STUDENT: 'border-[#a3b18a] hover:bg-[#a3b18a]/5',
              }[acc.role];

              const roleBadge = {
                HOD: 'bg-[#344e41] text-white',
                FACULTY: 'bg-[#588157] text-white',
                GUARD: 'bg-[#3a5a40] text-white',
                STUDENT: 'bg-[#a3b18a] text-[#344e41]',
              }[acc.role];

              return (
                <button
                  key={acc.email}
                  onClick={() => handleLogin(acc.email, acc.role)}
                  disabled={loadingEmail === acc.email}
                  className={`bg-white rounded-2xl p-5 border-2 text-left transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4 group ${roleColors}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${roleBadge}`}>
                        {acc.role}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#344e41] group-hover:translate-x-1 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#344e41] text-base group-hover:text-[#588157] transition-colors">
                        {acc.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">{acc.title}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e2dfd5]/60 text-[11px] text-[#588157] font-semibold flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" /> Launch {acc.label} →
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] space-y-2">
            <div className="flex items-center gap-2 text-[#588157] font-bold text-xs">
              <CalendarDays className="h-4 w-4" /> Timetable Conflict Engine
            </div>
            <p className="text-xs text-gray-600 leading-normal">
              When faculty schedule unexpected extra lectures, ExitQ automatically revokes affected conditional passes while keeping protected locked passes valid.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] space-y-2">
            <div className="flex items-center gap-2 text-[#588157] font-bold text-xs">
              <QrCode className="h-4 w-4" /> Single-Use QR & Gate Check
            </div>
            <p className="text-xs text-gray-600 leading-normal">
              Guards scan passes at gates. The backend evaluates permission status, student ID, location geofence, and unused QR status in real-time.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#e2dfd5] space-y-2">
            <div className="flex items-center gap-2 text-[#588157] font-bold text-xs">
              <Lock className="h-4 w-4" /> HOD Conditional vs Locked
            </div>
            <p className="text-xs text-gray-600 leading-normal">
              HOD can grant default Conditional approval or Locked protection (for official duties/medical emergencies) that resists subsequent timetable updates.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-4 border-t border-[#e2dfd5] text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          ExitQ — Production prototype built for campus exit management.
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#588157] font-semibold">
          <span>✓ Hackathon Verified</span>
          <span>✓ Audit Logged</span>
          <span>✓ Geofenced</span>
        </div>
      </footer>
    </div>
  );
}
