'use client';

import React, { useState, useEffect } from 'react';
import { User, Notification } from '@/lib/types';
import { DEMO_ACCOUNTS } from '@/lib/auth';
import { Bell, ShieldCheck, UserCheck, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  currentUser?: User;
  onRoleSwitch?: (user: User) => void;
  onToggleNotifications?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleSwitch,
  onToggleNotifications,
  unreadCount = 0,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e2dfd5] bg-[#ffffff] px-4 md:px-6 shadow-xs">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#344e41] text-[#dad7cd] font-bold text-lg shadow-sm group-hover:bg-[#3a5a40] transition-colors">
            EQ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-[#344e41] text-lg">ExitQ</span>
              <span className="rounded bg-[#588157]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#3a5a40] uppercase tracking-wider">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-[#588157] font-medium hidden sm:block">Smart Exit. Secure Campus.</p>
          </div>
        </Link>
      </div>

      {/* Right controls: Role Selector + Notifications */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#a3b18a]/40 bg-[#dad7cd]/20 px-3 py-1.5 text-xs font-medium text-[#344e41] hover:bg-[#dad7cd]/40 transition-all cursor-pointer"
          >
            <UserCheck className="h-3.5 w-3.5 text-[#588157]" />
            <div className="text-left">
              <span className="block text-[10px] text-[#588157] font-semibold uppercase tracking-wider">
                Active Role
              </span>
              <span className="font-bold text-[#344e41]">{currentUser?.role || 'HOD'} — {currentUser?.name || 'Dr. Ananya Sharma'}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#344e41] opacity-70 ml-1" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[#e2dfd5] bg-white p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#f0eee6]">
                <p className="text-xs font-bold text-[#344e41] uppercase tracking-wider">Switch Demo Account</p>
                <p className="text-[11px] text-gray-500">Test different role-based views instantly</p>
              </div>
              <div className="py-1">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = currentUser?.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      onClick={() => {
                        fetch('/api/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: acc.email }),
                        }).then(() => {
                          setDropdownOpen(false);
                          if (onRoleSwitch) {
                            onRoleSwitch({
                              id: acc.role === 'HOD' ? 'usr_hod_1' : acc.role === 'STUDENT' ? 'usr_std_1' : acc.role === 'FACULTY' ? 'usr_fac_1' : 'usr_grd_1',
                              name: acc.name,
                              email: acc.email,
                              role: acc.role,
                              department: 'Computer Science & Engineering',
                            });
                          }
                          // Navigate to role route
                          window.location.href = `/${acc.role.toLowerCase()}`;
                        });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors text-xs ${
                        isSelected ? 'bg-[#588157]/10 text-[#344e41] font-semibold' : 'hover:bg-[#f7f7f5] text-gray-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{acc.name}</div>
                        <div className="text-[10px] text-gray-500">{acc.label} • {acc.title}</div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-[#588157]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-lg border border-[#e2dfd5] bg-white hover:bg-[#dad7cd]/20 text-[#344e41] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#bc4749] text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
