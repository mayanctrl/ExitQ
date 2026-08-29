import React from 'react';
import { ApplicationStatus, PermissionType } from '@/lib/types';

interface StatusBadgeProps {
  status?: ApplicationStatus;
  permissionType?: PermissionType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, permissionType, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-md',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-lg',
  }[size];

  if (permissionType === 'LOCKED' || status === 'APPROVED_LOCKED') {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-[#e8eaf6] text-[#1a237e] border border-[#c5cae9] ${sizeClasses} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#1a237e]" />
        GRANTED — LOCKED 🔒
      </span>
    );
  }

  if (permissionType === 'CONDITIONAL' || status === 'APPROVED_CONDITIONAL') {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] ${sizeClasses} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
        GRANTED — CONDITIONAL ⚡
      </span>
    );
  }

  switch (status) {
    case 'PENDING':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#fff8e1] text-[#b78103] border border-[#ffe082] ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#b78103] animate-pulse" />
          PENDING REVIEW
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#ffebee] text-[#c62828] border border-[#ffcdd2] ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c62828]" />
          REJECTED
        </span>
      );
    case 'REVOKED':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#ffebee] text-[#b71c1c] border border-[#ef9a9a] ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#b71c1c]" />
          REVOKED
        </span>
      );
    case 'USED':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#f5f5f5] text-[#616161] border border-[#e0e0e0] ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#757575]" />
          USED / EXITED
        </span>
      );
    case 'EXPIRED':
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#fafafa] text-[#9e9e9e] border border-[#eee] ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#9e9e9e]" />
          EXPIRED
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 bg-gray-100 text-gray-700 ${sizeClasses} ${className}`}>
          {status || 'UNKNOWN'}
        </span>
      );
  }
};
