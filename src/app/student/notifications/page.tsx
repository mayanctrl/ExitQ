'use client';

import React, { useEffect, useState } from 'react';
import { Notification } from '@/lib/types';
import { SEED_STUDENTS } from '@/lib/seed';
import { Bell } from 'lucide-react';

export default function StudentNotificationsPage() {
  const student = SEED_STUDENTS[0];
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch(`/api/notifications?userId=${student.id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Student Notifications</h1>
        <p className="text-xs text-gray-500 mt-0.5">Gate pass updates, timetable conflict alerts, and gate exit confirmations</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2dfd5] p-6 shadow-xs space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-bold text-[#344e41]">No notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-4 bg-[#fafaf7] rounded-2xl border border-[#e2dfd5] flex items-start gap-3">
              <Bell className="h-5 w-5 text-[#588157] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-[#344e41]">{n.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-gray-400 mt-2 block">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
