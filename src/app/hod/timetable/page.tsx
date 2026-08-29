'use client';

import React, { useEffect, useState } from 'react';
import { Lecture, TimetableVersion } from '@/lib/types';
import { TimetableGrid } from '@/components/ui/TimetableGrid';
import { Upload, FileText, CheckCircle2, History, Sparkles, RefreshCw } from 'lucide-react';

export default function HODTimetablePage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [versions, setVersions] = useState<TimetableVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<TimetableVersion | null>(null);

  // Upload & OCR Sim state
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<Lecture[] | null>(null);

  useEffect(() => {
    fetch('/api/timetable')
      .then((res) => res.json())
      .then((data) => {
        setLectures(data.lectures || []);
        setVersions(data.versions || []);
        setCurrentVersion(data.currentVersion || null);
      });
  }, []);

  const handleSimulatePDFUpload = () => {
    setUploading(true);
    setTimeout(() => {
      // Simulate OCR extraction from timetable PDF
      setExtractedData([
        {
          id: `lec_ocr_1`,
          day: 'MON',
          startTime: '10:00',
          endTime: '11:00',
          subject: 'Database Management Systems',
          subjectCode: 'CS401',
          facultyId: 'usr_fac_1',
          facultyName: 'Prof. Rajesh Kumar',
          room: 'Lab 204',
          department: 'Computer Science & Engineering',
          semester: 4,
        },
        {
          id: `lec_ocr_2`,
          day: 'MON',
          startTime: '11:00',
          endTime: '12:00',
          subject: 'Operating Systems',
          subjectCode: 'CS402',
          facultyId: 'usr_fac_2',
          facultyName: 'Prof. Meera Iyer',
          room: 'Hall 301',
          department: 'Computer Science & Engineering',
          semester: 4,
        },
        {
          id: `lec_ocr_3`,
          day: 'MON',
          startTime: '12:00',
          endTime: '13:00',
          subject: 'Computer Networks',
          subjectCode: 'CS403',
          facultyId: 'usr_fac_3',
          facultyName: 'Prof. Vikram Patel',
          room: 'Hall 301',
          department: 'Computer Science & Engineering',
          semester: 4,
        },
      ]);
      setUploading(false);
    }, 1200);
  };

  const handlePublishOCR = () => {
    if (!extractedData) return;
    fetch('/api/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lectures: extractedData,
        actorId: 'usr_hod_1',
        actorName: 'Dr. Ananya Sharma',
        summary: 'Uploaded and verified new PDF timetable version.',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.version) {
          setLectures(extractedData);
          setVersions((prev) => [data.version, ...prev]);
          setCurrentVersion(data.version);
          setExtractedData(null);
        }
      });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#344e41] tracking-tight">Timetable Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Master schedule control, PDF OCR extraction, versioning history, and lecture evaluation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#588157]/10 text-[#3a5a40] font-bold text-xs rounded-xl border border-[#a3b18a]/30">
            Active: Timetable v{currentVersion?.version || 1}
          </span>
        </div>
      </div>

      {/* PDF Drag & Drop Upload Zone (Spec item 17) */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#344e41] flex items-center gap-2">
              <Upload className="h-4 w-4 text-[#588157]" /> PDF & Image Timetable Upload (OCR Extraction)
            </h2>
            <p className="text-xs text-gray-500">
              Upload scanned college timetable PDF or image. ExitQ will extract structured schedule for review.
            </p>
          </div>
        </div>

        {!extractedData ? (
          <div
            onClick={handleSimulatePDFUpload}
            className="border-2 border-dashed border-[#a3b18a] bg-[#fafaf7] hover:bg-[#dad7cd]/20 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2"
          >
            {uploading ? (
              <div className="space-y-2">
                <RefreshCw className="h-8 w-8 text-[#588157] animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#344e41]">Extracting schedule via OCR engine...</p>
                <p className="text-[11px] text-gray-400">Parsing subjects, time slots, and room numbers</p>
              </div>
            ) : (
              <>
                <FileText className="h-10 w-10 text-[#588157] mx-auto opacity-70" />
                <div className="font-bold text-xs text-[#344e41]">
                  Click to Upload Timetable PDF / Image (Demo Simulation)
                </div>
                <p className="text-[11px] text-gray-400">Supports PDF, PNG, JPG files up to 10MB</p>
              </>
            )}
          </div>
        ) : (
          /* Human Review & Extraction Table (Spec item 17) */
          <div className="space-y-4 p-4 bg-[#fafaf7] rounded-2xl border border-[#e2dfd5] animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#b78103]" />
                <span className="font-bold text-xs text-[#344e41]">
                  Extracted Timetable Review (3 Lectures Found) — Verify Before Publishing
                </span>
              </div>
              <button
                onClick={() => setExtractedData(null)}
                className="text-xs font-semibold text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bg-white rounded-xl border border-[#e2dfd5]">
                <thead>
                  <tr className="bg-[#f0eee6] border-b border-[#e2dfd5] text-[10px] font-bold text-[#344e41] uppercase">
                    <th className="p-2.5">DAY</th>
                    <th className="p-2.5">TIME</th>
                    <th className="p-2.5">SUBJECT</th>
                    <th className="p-2.5">FACULTY</th>
                    <th className="p-2.5">ROOM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2dfd5]">
                  {extractedData.map((lec, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-[#344e41]">{lec.day}</td>
                      <td className="p-2.5 font-semibold text-[#344e41]">
                        {lec.startTime} - {lec.endTime}
                      </td>
                      <td className="p-2.5 font-semibold text-[#344e41]">{lec.subject}</td>
                      <td className="p-2.5 text-gray-600">{lec.facultyName}</td>
                      <td className="p-2.5 text-gray-600">{lec.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handlePublishOCR}
              className="w-full py-2.5 bg-[#588157] text-white font-bold text-xs rounded-xl hover:bg-[#3a5a40] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Confirm & Publish Timetable v{versions.length + 1}
            </button>
          </div>
        )}
      </div>

      {/* Active Master Timetable Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#344e41] uppercase tracking-wider">
          MASTER SCHEDULE — SEMESTER 4
        </h2>
        <TimetableGrid lectures={lectures} />
      </div>

      {/* Timetable Version History Audit View (Spec item 16) */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2dfd5] shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#344e41] flex items-center gap-2">
          <History className="h-4 w-4 text-[#588157]" /> Timetable Versioning Audit History
        </h2>

        <div className="space-y-2">
          {versions.map((ver) => (
            <div
              key={ver.version}
              className="p-3 bg-[#fafaf7] rounded-xl border border-[#e2dfd5] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-[#344e41]">Timetable v{ver.version}</span>
                <p className="text-[11px] text-gray-500">{ver.changeSummary}</p>
              </div>
              <div className="text-right text-[11px] text-gray-400">
                <span className="font-semibold text-[#344e41] block">{ver.modifiedByName}</span>
                {new Date(ver.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
