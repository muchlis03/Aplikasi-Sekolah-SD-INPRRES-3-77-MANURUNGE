import React, { useState } from 'react';
import { Printer, FileSpreadsheet, CheckSquare } from 'lucide-react';
import { Student, AttendanceMap, GradeMap, SchoolInfo } from '../types';
import { CLASSES, SUBJECTS } from '../constants';
import { calculateAttendance, calculateScoreFromData } from '../utils/calculations';

interface ReportsProps {
  students: Student[];
  attendance: AttendanceMap;
  grades: GradeMap;
  schoolInfo: SchoolInfo;
}

export function Reports({ students, attendance, grades, schoolInfo }: ReportsProps) {
  const [reportType, setReportType] = useState<'attendance' | 'grades'>('attendance');
  const [selectedClass, setSelectedClass] = useState('Kelas 1');
  const [showPrintHint, setShowPrintHint] = useState(false);

  const filteredStudents = students.filter(s => s.class === selectedClass);

  const handlePrint = () => {
    setShowPrintHint(true);
    setTimeout(() => setShowPrintHint(false), 8000);
    setTimeout(() => {
      try {
        window.print();
      } catch (error) {
        console.error("Browser memblokir jendela cetak otomatis:", error);
      }
    }, 500);
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Toast Notifikasi Cetak */}
      {showPrintHint && (
        <div className="fixed top-6 right-6 bg-blue-600 text-white p-4 rounded-xl shadow-2xl z-[100] print:hidden flex items-start gap-4 max-w-sm border border-blue-500 animate-in fade-in">
           <div className="bg-blue-700 p-2 rounded-lg flex-shrink-0">
             <Printer className="h-6 w-6 text-white" />
           </div>
           <div>
             <p className="font-bold text-sm mb-1">Mempersiapkan Mode Cetak...</p>
             <p className="text-xs text-blue-100 leading-relaxed mb-2">
               Jika jendela cetak tidak otomatis muncul, silakan tekan pintasan <b className="bg-blue-800 px-1.5 py-0.5 rounded shadow-sm inline-block mx-0.5">Ctrl + P</b> (Windows) atau <b className="bg-blue-800 px-1.5 py-0.5 rounded shadow-sm inline-block mx-0.5">Cmd + P</b> (Mac) pada keyboard Anda.
             </p>
             <button onClick={() => setShowPrintHint(false)} className="text-xs font-medium text-blue-200 hover:text-white underline">
               Tutup pesan ini
             </button>
           </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 print:hidden">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setReportType('attendance')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              reportType === 'attendance' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Rekap Presensi
          </button>
          <button 
            onClick={() => setReportType('grades')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              reportType === 'grades' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Rekap Nilai
          </button>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)} 
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none bg-gray-50 focus:bg-white"
          >
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button 
            onClick={handlePrint} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 shadow-sm transition-colors"
          >
            <Printer className="h-4 w-4" /> Cetak Rekap
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:border-none print:shadow-none print:overflow-visible">
        <div className="p-6 text-center border-b border-gray-200 mb-4 hidden print:block">
          <h2 className="text-xl font-bold uppercase">{schoolInfo.name}</h2>
          <p className="text-sm">{schoolInfo.address} - NPSN: {schoolInfo.npsn}</p>
          <hr className="my-2 border-black" />
          <h3 className="font-bold text-lg mt-4">
            {reportType === 'attendance' ? 'REKAPITULASI KEHADIRAN MURID' : 'REKAPITULASI NILAI MURID'}
          </h3>
          <p className="text-sm">Kelas: {selectedClass} | Tahun Ajaran: {schoolInfo.academicYear} | Semester: {schoolInfo.semester || 'Ganjil'}</p>
        </div>

        <div className="overflow-x-auto p-4 print:overflow-visible print:p-0">
          <table className="w-full text-left border-collapse border border-gray-300 print:text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-800 text-xs uppercase text-center">
                <th className="p-3 border border-gray-300 font-bold w-12">No</th>
                <th className="p-3 border border-gray-300 font-bold text-left">Nama Murid</th>
                {reportType === 'attendance' ? (
                  <>
                    <th className="p-3 border border-gray-300 font-bold w-16" title="Hadir">H</th>
                    <th className="p-3 border border-gray-300 font-bold w-16" title="Sakit">S</th>
                    <th className="p-3 border border-gray-300 font-bold w-16" title="Izin">I</th>
                    <th className="p-3 border border-gray-300 font-bold w-16" title="Alpa">A</th>
                    <th className="p-3 border border-gray-300 font-bold w-24">% Hadir</th>
                  </>
                ) : (
                  <>
                    {SUBJECTS.map(sub => (
                      <th key={sub} className="p-3 border border-gray-300 font-bold w-16 text-center" title={sub}>
                        {sub.length > 6 ? sub.substring(0, 4) : sub}
                      </th>
                    ))}
                    <th className="p-3 border border-gray-300 font-bold w-16">Rata-Rata</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => {
                if (reportType === 'attendance') {
                  const stat = calculateAttendance(student.id, attendance);
                  return (
                    <tr key={student.id} className="text-center hover:bg-gray-50/50">
                      <td className="p-3 border border-gray-300">{idx + 1}</td>
                      <td className="p-3 border border-gray-300 text-left font-medium">
                        {student.name}
                        <span className="block text-xs text-gray-400 font-normal">{student.nis}</span>
                      </td>
                      <td className="p-3 border border-gray-300 text-emerald-600 font-bold">{stat.had}</td>
                      <td className="p-3 border border-gray-300 text-amber-600 font-bold">{stat.sak}</td>
                      <td className="p-3 border border-gray-300 text-orange-500 font-bold">{stat.iz}</td>
                      <td className="p-3 border border-gray-300 text-rose-600 font-bold">{stat.alp}</td>
                      <td className="p-3 border border-gray-300 text-blue-600 font-bold bg-blue-50/50">
                        {stat.percentage}%
                      </td>
                    </tr>
                  );
                } else {
                  let total = 0;
                  let count = 0;
                  return (
                    <tr key={student.id} className="text-center hover:bg-gray-50/50">
                      <td className="p-3 border border-gray-300">{idx + 1}</td>
                      <td className="p-3 border border-gray-300 text-left font-medium">
                        {student.name}
                        <span className="block text-xs text-gray-400 font-normal">{student.nis}</span>
                      </td>
                      {SUBJECTS.map(sub => {
                        const classSubjectKey = `${selectedClass}-${sub}`;
                        const gradeData = grades[classSubjectKey]?.[student.id];
                        const numericScore = calculateScoreFromData(gradeData);

                        if (numericScore !== null) {
                          total += numericScore;
                          count++;
                        }
                        
                        return (
                          <td key={sub} className="p-3 border border-gray-300">
                            {numericScore !== null ? numericScore : '-'}
                          </td>
                        );
                      })}
                      <td className="p-3 border border-gray-300 font-bold bg-gray-50">
                        {count > 0 ? (total / count).toFixed(1) : '-'}
                      </td>
                    </tr>
                  );
                }
              }) : (
                <tr>
                  <td 
                    colSpan={reportType === 'attendance' ? 7 : SUBJECTS.length + 3} 
                    className="p-8 text-center text-gray-500 border border-gray-300"
                  >
                    Tidak ada murid di kelas yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Cetak */}
        <div className="hidden print:flex justify-between p-8 mt-8 w-full">
          <div className="text-center w-64">
            <p className="mb-24">Mengetahui,<br/>Kepala Sekolah</p>
            <p className="font-bold underline">{schoolInfo.headmaster || '...................................'}</p>
            <p className="text-sm">NIP. {schoolInfo.headmasterNip || '...................................'}</p>
          </div>
          <div className="text-center w-64">
            <p className="mb-24"><br/>{schoolInfo.principalTitle}</p>
            <p className="font-bold underline">{schoolInfo.principal}</p>
            <p className="text-sm">NIP. {schoolInfo.principalNip || '...................................'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
