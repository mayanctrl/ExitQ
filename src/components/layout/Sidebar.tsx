'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/lib/types';
import {
  LayoutDashboard,
  FileCheck2,
  Users,
  CalendarDays,
  ShieldAlert,
  Bell,
  History,
  QrCode,
  LogOut,
  UserCheck,
  PlusCircle,
  Clock,
  Send,
  Ticket,
  User as UserIcon,
} from 'lucide-react';

interface SidebarProps {
  role: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();

  const navItems = {
    HOD: [
      { label: 'Dashboard', href: '/hod', icon: LayoutDashboard },
      { label: 'Applications', href: '/hod/applications', icon: FileCheck2 },
      { label: 'Students', href: '/hod/students', icon: Users },
      { label: 'Timetable', href: '/hod/timetable', icon: CalendarDays },
      { label: 'Permissions', href: '/hod/permissions', icon: ShieldAlert },
      { label: 'Notifications', href: '/hod/notifications', icon: Bell },
      { label: 'Audit Log', href: '/hod/audit', icon: History },
    ],
    FACULTY: [
      { label: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
      { label: 'My Timetable', href: '/faculty/timetable', icon: CalendarDays },
      { label: 'Extra Lectures', href: '/faculty/extra-lectures', icon: PlusCircle },
      { label: 'Students', href: '/faculty/students', icon: Users },
      { label: 'Permissions', href: '/faculty/permissions', icon: ShieldAlert },
      { label: 'Notifications', href: '/faculty/notifications', icon: Bell },
    ],
    GUARD: [
      { label: 'Scan ExitQ', href: '/guard', icon: QrCode },
      { label: "Today's Exits", href: '/guard/exits', icon: Clock },
      { label: 'Currently Outside', href: '/guard/outside', icon: Users },
    ],
    STUDENT: [
      { label: 'Home', href: '/student', icon: LayoutDashboard },
      { label: 'Request Exit', href: '/student/request', icon: Send },
      { label: 'My Applications', href: '/student/applications', icon: FileCheck2 },
      { label: 'My Passes', href: '/student/passes', icon: Ticket },
      { label: 'Notifications', href: '/student/notifications', icon: Bell },
      { label: 'Profile', href: '/student/profile', icon: UserIcon },
    ],
  }[role] || [];

  return (
    <aside className="w-64 border-r border-[#e2dfd5] bg-[#ffffff] flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Role Badge Indicator */}
        <div className="rounded-xl bg-[#dad7cd]/20 border border-[#a3b18a]/30 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#588157]">
            Authorized View
          </div>
          <div className="font-bold text-[#344e41] text-sm mt-0.5">{role} Control Center</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Role-scoped actions & intelligence</p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#344e41] text-[#dad7cd] shadow-xs'
                    : 'text-[#344e41] hover:bg-[#dad7cd]/20 hover:text-[#344e41]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#a3b18a]' : 'text-[#588157]'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#e2dfd5] bg-[#fafaf7]">
        <div className="text-[11px] text-gray-500 font-medium">ExitQ Engine v1.0</div>
        <div className="text-[10px] text-[#588157] font-semibold">Campus Geofence: Active</div>
      </div>
    </aside>
  );
};
