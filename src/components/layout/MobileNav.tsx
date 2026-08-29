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
  QrCode,
  Send,
  Ticket,
  Clock,
} from 'lucide-react';

interface MobileNavProps {
  role: Role;
}

export const MobileNav: React.FC<MobileNavProps> = ({ role }) => {
  const pathname = usePathname();

  const items = {
    HOD: [
      { label: 'Dashboard', href: '/hod', icon: LayoutDashboard },
      { label: 'Apps', href: '/hod/applications', icon: FileCheck2 },
      { label: 'Timetable', href: '/hod/timetable', icon: CalendarDays },
      { label: 'Passes', href: '/hod/permissions', icon: ShieldAlert },
      { label: 'Students', href: '/hod/students', icon: Users },
    ],
    FACULTY: [
      { label: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
      { label: 'Timetable', href: '/faculty/timetable', icon: CalendarDays },
      { label: '+ Extra', href: '/faculty/extra-lectures', icon: FileCheck2 },
      { label: 'Students', href: '/faculty/students', icon: Users },
    ],
    GUARD: [
      { label: 'SCAN PASS', href: '/guard', icon: QrCode },
      { label: "Today's Exits", href: '/guard/exits', icon: Clock },
      { label: 'Outside', href: '/guard/outside', icon: Users },
    ],
    STUDENT: [
      { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'Request', href: '/student/request', icon: Send },
      { label: 'My Passes', href: '/student/passes', icon: Ticket },
      { label: 'History', href: '/student/applications', icon: FileCheck2 },
    ],
  }[role] || [];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e2dfd5] md:hidden shadow-md transition-colors">
      <div className="flex justify-around items-center h-14 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isPrimary = item.label === 'SCAN PASS' || item.label === 'Request';

          if (isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 bg-[#344e41] text-[#dad7cd] w-12 h-12 rounded-2xl shadow-sm border-2 border-white dark:border-[#1e2f26]"
              >
                <Icon className="h-5 w-5 text-[#a3b18a]" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-1 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#344e41] dark:text-[#dad7cd]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#588157]' : 'text-gray-400'}`} />
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
