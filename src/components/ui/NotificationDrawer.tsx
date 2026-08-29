'use client';

import React from 'react';
import { Notification } from '@/lib/types';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import Link from 'next/link';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl border-l border-[#e2dfd5] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#e2dfd5] flex items-center justify-between bg-[#fafaf7]">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#588157]" />
              <h3 className="font-bold text-[#344e41] text-sm">Notification Center</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">You're all caught up!</p>
                <p className="text-[11px] text-gray-400 mt-0.5">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => {
                const getIcon = () => {
                  switch (n.type) {
                    case 'SUCCESS':
                      return <CheckCircle2 className="h-4 w-4 text-[#386641] shrink-0" />;
                    case 'ERROR':
                      return <XCircle className="h-4 w-4 text-[#bc4749] shrink-0" />;
                    case 'WARNING':
                      return <AlertTriangle className="h-4 w-4 text-[#d97706] shrink-0" />;
                    default:
                      return <Info className="h-4 w-4 text-[#2563eb] shrink-0" />;
                  }
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                      n.read ? 'bg-[#fafaf7] border-[#e2dfd5]/60 text-gray-600' : 'bg-white border-[#588157]/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {getIcon()}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[#344e41] text-xs truncate">{n.title}</span>
                          {!n.read && <span className="h-2 w-2 rounded-full bg-[#588157] shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 leading-snug">{n.message}</p>
                        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                          <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {n.link && (
                            <Link href={n.link} onClick={onClose} className="text-[#588157] font-semibold hover:underline">
                              View details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
