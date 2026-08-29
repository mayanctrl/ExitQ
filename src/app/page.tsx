'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Successful login -> Redirect
      window.location.href = data.redirectUrl || '/';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col justify-between p-4 sm:p-8 transition-colors">
      {/* Top Brand Header */}
      <header className="max-w-md mx-auto w-full pt-4 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#344e41] text-[#dad7cd] font-black text-xl shadow-xs mb-3">
          EQ
        </div>
        <h1 className="text-2xl font-black text-[#344e41] tracking-tight">ExitQ</h1>
        <p className="text-xs font-semibold text-[#588157] mt-0.5">Smart Exit. Secure Campus.</p>
      </header>

      {/* Main Sign In Form Container */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#344e41] tracking-tight">Institutional Sign In</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your verified college email and password to access your role dashboard.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#c62828] rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#344e41] mb-1.5">College / Institutional Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@sbjit.edu.in or student email"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#344e41] mb-1.5">Password</label>
              <div className="relative">
                <KeyRound className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#344e41] hover:bg-[#3a5a40] text-[#dad7cd] font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 text-[#a3b18a]" />
                </>
              )}
            </button>
          </form>

          {/* Student Signup Link */}
          <div className="pt-4 border-t border-[#e2dfd5] text-center text-xs">
            <span className="text-gray-500">Don't have an account? </span>
            <Link href="/signup" className="font-bold text-[#588157] hover:underline">
              Student Sign Up
            </Link>
          </div>
        </div>

        {/* Demo Accounts Quick-Fill Helper */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowDemoSelector(!showDemoSelector)}
            className="text-[11px] font-semibold text-gray-400 hover:text-[#588157] transition-colors cursor-pointer"
          >
            {showDemoSelector ? 'Hide Demo Logins ▲' : 'Show Demo Credentials for Testing ▼'}
          </button>

          {showDemoSelector && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-[#e2dfd5] text-left text-xs space-y-2 animate-in fade-in duration-150">
              <div className="text-[10px] font-extrabold uppercase text-[#588157] tracking-wider">
                Click any account to pre-fill credentials:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('mayankhobragade.ee24@sbjit.edu.in', 'cubes88')}
                  className="p-2 text-left rounded-lg bg-[#fafaf7] hover:bg-[#344e41]/10 border border-[#e2dfd5]"
                >
                  <div className="font-bold text-[#344e41]">Admin / HOD</div>
                  <div className="text-[10px] text-gray-500 truncate">mayankhobragade.ee24@sbjit.edu.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('hod.cs@exitq.edu', 'cubes88')}
                  className="p-2 text-left rounded-lg bg-[#fafaf7] hover:bg-[#344e41]/10 border border-[#e2dfd5]"
                >
                  <div className="font-bold text-[#344e41]">Dr. Ananya (HOD)</div>
                  <div className="text-[10px] text-gray-500 truncate">hod.cs@exitq.edu</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('rajesh.kumar@exitq.edu', 'cubes88')}
                  className="p-2 text-left rounded-lg bg-[#fafaf7] hover:bg-[#344e41]/10 border border-[#e2dfd5]"
                >
                  <div className="font-bold text-[#344e41]">Faculty</div>
                  <div className="text-[10px] text-gray-500 truncate">rajesh.kumar@exitq.edu</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('guard.gate1@exitq.edu', 'cubes88')}
                  className="p-2 text-left rounded-lg bg-[#fafaf7] hover:bg-[#344e41]/10 border border-[#e2dfd5]"
                >
                  <div className="font-bold text-[#344e41]">Security Guard</div>
                  <div className="text-[10px] text-gray-500 truncate">guard.gate1@exitq.edu</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('aarav.mehta@student.exitq.edu', 'cubes88')}
                  className="col-span-2 p-2 text-left rounded-lg bg-[#fafaf7] hover:bg-[#344e41]/10 border border-[#e2dfd5]"
                >
                  <div className="font-bold text-[#344e41]">Student (Aarav Mehta)</div>
                  <div className="text-[10px] text-gray-500 truncate">aarav.mehta@student.exitq.edu</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center pb-2 text-[11px] text-gray-400">
        ExitQ Campus Exit & Timetable Intelligence Engine
      </footer>
    </div>
  );
}
