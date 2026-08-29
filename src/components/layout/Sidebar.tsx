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
  UserPlus,
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
      { label: 'Timetable', href: '/hod/timetable', icon: CalendarDays },
      { label: 'Permissions', href: '/hod/permissions', icon: ShieldAlert },
      { label: 'Students', href: '/hod/students', icon: Users },
      { label: 'Institutional Accounts', href: '/hod/accounts', icon: UserPlus },
      { label: 'Audit Log', href: '/hod/audit', icon: History },
      { label: 'Notifications', href: '/hod/notifications', icon: Bell },
    ],
    FACULTY: [
      { label: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
      { label: 'My Timetable', href: '/faculty/timetable', icon: CalendarDays },
      { label: 'Extra Lectures', href: '/faculty/extra-lectures', icon: PlusCircle },
      { label: 'Permissions', href: '/faculty/permissions', icon: ShieldAlert },
      { label: 'Students', href: '/faculty/students', icon: Users },
      { label: 'Notifications', href: '/faculty/notifications', icon: Bell },
    ],
    GUARD: [
      { label: 'Scan Gate Pass', href: '/guard', icon: QrCode },
      { label: "Today's Exits", href: '/guard/exits', icon: Clock },
      { label: 'Currently Outside', href: '/guard/outside', icon: Users },
    ],
    STUDENT: [
      { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'Request Exit', href: '/student/request', icon: Send },
      { label: 'My Passes', href: '/student/passes', icon: Ticket },
      { label: 'Application History', href: '/student/applications', icon: FileCheck2 },
      { label: 'Notifications', href: '/student/notifications', icon: Bell },
      { label: 'Profile', href: '/student/profile', icon: UserIcon },
    ],
  }[role] || [];

  return (
    <aside className="w-60 border-r border-[#e2dfd5] bg-white flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-3.5rem)] transition-colors">
      <div className="p-3.5 space-y-4">
        {/* Header Label */}
        <div className="px-3 pt-2 pb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#588157]">
            {role} PORTAL
          </span>
        </div>

        {/* Nav Items */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== `/${role.toLowerCase()}` && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#344e41] text-[#dad7cd] shadow-xs'
                    : 'text-[#344e41] hover:bg-[#fafaf7] hover:text-[#588157]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#a3b18a]' : 'text-[#588157]'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Meta */}
      <div className="p-3.5 border-t border-[#e2dfd5] text-[11px] text-gray-400 flex items-center justify-between">
        <span>ExitQ Engine</span>
        <span className="text-[#588157] font-semibold text-[10px]">● Active</span>
      </div>
    </aside>
  );
};
