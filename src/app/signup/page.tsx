'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StudentSignUpPage() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          studentId,
          email,
          password,
          department,
          semester: Number(semester),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create student account');
        setLoading(false);
        return;
      }

      // Success -> Redirect to student dashboard
      window.location.href = '/student';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col justify-between p-4 sm:p-8 transition-colors">
      {/* Top Header */}
      <header className="max-w-md mx-auto w-full pt-4 text-center">
        <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#344e41] text-[#dad7cd] font-black text-xl shadow-xs mb-3">
          EQ
        </Link>
        <h1 className="text-2xl font-black text-[#344e41] tracking-tight">Student Registration</h1>
        <p className="text-xs font-semibold text-[#588157] mt-0.5">Create your institutional ExitQ student profile</p>
      </header>

      {/* Form Container */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2dfd5] shadow-xs space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#c62828] rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-[#344e41] mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Aarav Mehta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-[#344e41] mb-1">Student Roll ID</label>
                <input
                  type="text"
                  placeholder="CS-2024-055"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#344e41] mb-1">Current Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41]"
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                  <option value={3}>Semester 3</option>
                  <option value={4}>Semester 4</option>
                  <option value={5}>Semester 5</option>
                  <option value={6}>Semester 6</option>
                  <option value={7}>Semester 7</option>
                  <option value={8}>Semester 8</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#344e41] mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41]"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#344e41] mb-1">College Email</label>
              <input
                type="email"
                placeholder="student.name@student.exitq.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#344e41] mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#fafaf7] border border-[#e2dfd5] rounded-xl text-xs font-medium text-[#344e41] focus:outline-none focus:border-[#588157]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#588157] hover:bg-[#3a5a40] text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <span>Registering Student...</span>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <ArrowRight className="h-4 w-4 text-[#dad7cd]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-[#e2dfd5] text-center text-xs">
            <span className="text-gray-500">Already registered? </span>
            <Link href="/" className="font-bold text-[#344e41] hover:underline">
              Sign In to ExitQ
            </Link>
          </div>
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full text-center pb-2 text-[11px] text-gray-400">
        ExitQ Secure Student Provisioning
      </footer>
    </div>
  );
}
