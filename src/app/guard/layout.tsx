'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationDrawer } from '@/components/ui/NotificationDrawer';
import { User, Notification } from '@/lib/types';
import { SEED_GUARDS } from '@/lib/seed';

export default function GuardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(SEED_GUARDS[0]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/notifications?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => setNotifications(data.notifications || []))
        .catch(() => {});
    }
  }, [user]);

  const handleMarkRead = (id: string) => {
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    }).then(() => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f5] transition-colors">
      <Header
        currentUser={user}
        unreadCount={unreadCount}
        onToggleNotifications={() => setNotifDrawerOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar role="GUARD" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>

      <MobileNav role="GUARD" />

      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
}
