'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Bell, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  currentUser?: User;
  onRoleSwitch?: (user: User) => void;
  onToggleNotifications?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onToggleNotifications,
  unreadCount = 0,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('exitq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('exitq_theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    window.location.href = '/';
  };

  const roleColors: Record<string, string> = {
    HOD: 'bg-[#344e41] text-[#dad7cd]',
    FACULTY: 'bg-[#588157] text-white',
    GUARD: 'bg-[#3a5a40] text-white',
    STUDENT: 'bg-[#a3b18a] text-[#344e41]',
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#e2dfd5] bg-white px-4 md:px-6 transition-colors">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#344e41] text-[#dad7cd] font-extrabold text-sm shadow-xs group-hover:bg-[#588157] transition-colors">
            EQ
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-[#344e41] text-base">ExitQ</span>
            <span className="text-[10px] text-[#588157] font-semibold hidden sm:inline ml-2 border-l border-[#e2dfd5] pl-2">
              Smart Exit. Secure Campus.
            </span>
          </div>
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-lg border border-[#e2dfd5] text-[#344e41] hover:bg-[#fafaf7] transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-[#588157]" />}
        </button>

        {/* Notifications Bell */}
        {onToggleNotifications && (
          <button
            onClick={onToggleNotifications}
            className="relative p-2 rounded-lg border border-[#e2dfd5] text-[#344e41] hover:bg-[#fafaf7] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4 text-[#344e41]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c62828] text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* User Identity Pill */}
        {currentUser && (
          <div className="flex items-center gap-2 border border-[#e2dfd5] bg-[#fafaf7] px-3 py-1.5 rounded-lg text-xs">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                roleColors[currentUser.role] || 'bg-gray-200 text-gray-800'
              }`}
            >
              {currentUser.role}
            </span>
            <span className="font-semibold text-[#344e41] hidden sm:inline truncate max-w-[140px]">
              {currentUser.name}
            </span>
          </div>
        )}

        {/* Sign Out Action */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-[#c62828] hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
