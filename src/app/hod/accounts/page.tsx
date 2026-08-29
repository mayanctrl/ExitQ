'use client';

import React, { useState } from 'react';
import { UserPlus, CheckCircle2, AlertCircle, Shield, Key, Mail } from 'lucide-react';

export default function InstitutionalAccountsPage() {
  const [role, setRole] = useState<'HOD' | 'FACULTY' | 'GUARD'>('FACULTY');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    user: any;
    generatedPassword: string;
    message: string;
  } | null>(null);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name,
          email,
          employeeId,
          department: role === 'GUARD' ? 'Campus Security' : department,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      setSuccessResult(data);
      // Reset form
      setName('');
      setEmail('');
      setEmployeeId('');
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#344e41] tracking-tight">Institutional Account Provisioning</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Admin / HOD control center for creating authenticated Faculty, HOD, and Campus Guard credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#344e41]">
            <UserPlus className="h-4 w-4 text-[#588157]" />
            <span>Create Institutional Account</span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#c62828] rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#344e41] mb-1">Account Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['FACULTY', 'HOD', 'GUARD'] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-xl font-bold text-center border transition-all cursor-pointer ${
                      role === r
                        ? 'bg-[#344e41] text-[#dad7cd] border-[#344e41] shadow-xs'
                        : 'bg-[#fafaf7] text-gray-600 border-[#e2dfd5] hover:border-[#588157]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#344e41] mb-1">Full Legal Name</label>
              <input
                type="text"
                placeholder="e.g. Prof. Sameer Joshi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#344e41] mb-1">Employee / Staff ID</label>
                <input
                  type="text"
                  placeholder="EMP-2024-108"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#344e41] mb-1">Department</label>
                <select
                  value={department}
                  disabled={role === 'GUARD'}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41] disabled:opacity-50"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Campus Security">Campus Security</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#344e41] mb-1">Institutional Email Address</label>
              <input
                type="email"
                placeholder="official.name@exitq.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#588157] hover:bg-[#3a5a40] text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Generating Credentials...</span>
              ) : (
                <>
                  <Key className="h-4 w-4 text-[#dad7cd]" />
                  <span>Provision {role} Account & Dispatch Credentials</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Simulation Notice */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#fafaf7] p-6 rounded-2xl border border-[#e2dfd5] space-y-4">
            <h3 className="font-bold text-xs text-[#344e41] uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#588157]" /> Institutional Dispatch Simulation
            </h3>

            {!successResult ? (
              <p className="text-xs text-gray-500 leading-relaxed">
                Institutional accounts (HOD, Faculty, Security Guard) cannot be registered publicly. They are provisioned centrally by College Administration. Temporary credentials will be generated and dispatched.
              </p>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Credentials Generated & Dispatched</span>
                </div>

                <div className="text-xs text-emerald-950 space-y-1 bg-white p-3 rounded-lg border border-emerald-200 font-mono">
                  <div><strong>Email:</strong> {successResult.user.email}</div>
                  <div><strong>Role:</strong> {successResult.user.role}</div>
                  <div><strong>Temporary Password:</strong> <span className="text-[#c62828] font-bold">{successResult.generatedPassword}</span></div>
                </div>

                <p className="text-[11px] text-emerald-700 italic">
                  ✓ {successResult.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
