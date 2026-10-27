import React, { useState } from 'react';
import { Award, Printer } from 'lucide-react';
import { Student, SchoolInfo, GradeMap, AssessmentData } from '../types';
import { CLASSES, SUBJECTS } from '../constants';
import { sanitizeScore } from '../utils/calculations';

interface GradesProps {
  students: Student[];
  grades: GradeMap;
  setGrades: (grades: GradeMap) => void;
  schoolInfo: SchoolInfo;
}

export function Grades({ students, grades, setGrades, schoolInfo }: GradesProps) {
  const [selectedClass, setSelectedClass] = useState('Kelas 1');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [showPrintHint, setShowPrintHint] = useState(false);

  const filteredStudents = students.filter(s => s.class === selectedClass);
  const key = `${selectedClass}-${selectedSubject}`;
  const currentScores = grades[key] || {};
  
  const handleAssessmentChange = (studentId: string, field: keyof AssessmentData, value: string) => {
    const rawData = currentScores[studentId];
    let studentData: AssessmentData = {
      diagnostik: '', formatif: '', s1: '', s2: '', s3: '', s4: '', s5: '',
      tp: 'Belum Dinilai', bukti: '', deskripsi: '', tindakLanjut: ''
    };

    if (typeof rawData === 'number') {
      studentData.s1 = rawData;
    } else if (rawData && typeof rawData === 'object') {
      studentData = { ...studentData, ...rawData };
    }

    let finalValue: any = value;
    // Validasi angka untuk diagnostik, formatif, dan sumatif tp 1-5
    if (['diagnostik', 'formatif', 's1', 's2', 's3', 's4', 's5'].includes(field)) {
      finalValue = sanitizeScore(value);
    }

    setGrades({
      ...grades,
      [key]: {
        ...currentScores,
        [studentId]: {
          ...studentData,
          [field]: finalValue
        }
      }
    });
  };

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

  const TP_OPTIONS = ['Belum Dinilai', 'Mulai Berkembang', 'Layak', 'Cakap', 'Mahir'];

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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between print:hidden">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Pilih Kelas</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)} 
              className="border border-gray-300 rounded-lg p-2 text-sm outline-none bg-gray-50 focus:bg-white min-w-[150px]"
            >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mata Pelajaran</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)} 
              className="border border-gray-300 rounded-lg p-2 text-sm outline-none bg-gray-50 focus:bg-white min-w-[180px]"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 flex items-center gap-2">
             <Award className="h-4 w-4" /> Input Asesmen Kurikulum Merdeka
          </div>
          <button 
            onClick={handlePrint} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4" /> Cetak Nilai
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:border-none print:shadow-none print:overflow-visible">
        {/* Header Cetak untuk Daftar Nilai */}
        <div className="p-6 text-center border-b border-gray-200 mb-4 hidden print:block">
          <h2 className="text-xl font-bold uppercase">{schoolInfo?.name}</h2>
          <p className="text-sm">{schoolInfo?.address} - NPSN: {schoolInfo?.npsn}</p>
          <hr className="my-2 border-black" />
          <h3 className="font-bold text-lg mt-4 uppercase">DAFTAR NILAI ASESMEN</h3>
          <p className="text-sm">Kelas: {selectedClass} | Mata Pelajaran: {selectedSubject}</p>
          <p className="text-sm">Tahun Ajaran: {schoolInfo?.academicYear} | Semester: {schoolInfo?.semester || 'Ganjil'}</p>
        </div>

        <div className="overflow-x-auto print:overflow-visible p-4 print:p-0">
          <table className="w-full text-left border-collapse whitespace-nowrap print:border print:border-gray-300">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider print:bg-gray-100">
                <th className="p-4 border-b font-medium sticky left-0 bg-gray-50 z-10 w-48 print:border print:border-gray-300 print:sticky-none print:bg-transparent">Nama Murid</th>
                <th className="p-4 border-b font-medium text-center w-24 print:border print:border-gray-300">Diagnostik</th>
                <th className="p-4 border-b font-medium text-center w-24 print:border print:border-gray-300">Formatif</th>
                <th className="p-4 border-b font-medium text-center w-20 print:border print:border-gray-300" title="Sumatif Tujuan Pembelajaran 1">S-TP1</th>
                <th className="p-4 border-b font-medium text-center w-20 print:border print:border-gray-300" title="Sumatif Tujuan Pembelajaran 2">S-TP2</th>
                <th className="p-4 border-b font-medium text-center w-20 print:border print:border-gray-300" title="Sumatif Tujuan Pembelajaran 3">S-TP3</th>
                <th className="p-4 border-b font-medium text-center w-20 print:border print:border-gray-300" title="Sumatif Tujuan Pembelajaran 4">S-TP4</th>
                <th className="p-4 border-b font-medium text-center w-20 print:border print:border-gray-300" title="Sumatif Tujuan Pembelajaran 5">S-TP5</th>
                <th className="p-4 border-b font-medium w-40 print:border print:border-gray-300">Ketercapaian TP</th>
                <th className="p-4 border-b font-medium w-48 print:border print:border-gray-300">Bukti Belajar</th>
                <th className="p-4 border-b font-medium w-64 print:border print:border-gray-300">Deskripsi Capaian</th>
                <th className="p-4 border-b font-medium w-64 print:border print:border-gray-300">Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredStudents.length > 0 ? filteredStudents.map(student => {
                const raw = currentScores[student.id];
                let data: AssessmentData = {
                  diagnostik: '', formatif: '', s1: '', s2: '', s3: '', s4: '', s5: '',
                  tp: 'Belum Dinilai', bukti: '', deskripsi: '', tindakLanjut: ''
                };
                if (typeof raw === 'number') {
                  data.s1 = raw;
                } else if (raw && typeof raw === 'object') {
                  data = { ...data, ...raw };
                }

                return (
                  <tr key={student.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                    <td className="p-4 font-medium text-gray-800 sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#f3f4f6] print:border print:border-gray-300 print:shadow-none print:sticky-none print:bg-transparent">
                      {student.name}
                      <span className="block text-xs text-gray-400 font-normal">{student.nis}</span>
                    </td>
                    <td className="p-4 print:border print:border-gray-300 print:text-center print:p-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={data.diagnostik ?? ''} 
                        onChange={(e) => handleAssessmentChange(student.id, 'diagnostik', e.target.value)} 
                        className="w-16 border border-gray-300 rounded-md p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent print:p-0 print:w-full" 
                        placeholder="-"
                      />
                    </td>
                    <td className="p-4 print:border print:border-gray-300 print:text-center print:p-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={data.formatif ?? ''} 
                        onChange={(e) => handleAssessmentChange(student.id, 'formatif', e.target.value)} 
                        className="w-16 border border-gray-300 rounded-md p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent print:p-0 print:w-full" 
                        placeholder="-"
                      />
                    </td>
                    {(['s1', 's2', 's3', 's4', 's5'] as const).map(numKey => (
                      <td key={numKey} className="p-4 print:border print:border-gray-300 print:text-center print:p-2">
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={data[numKey] ?? ''} 
                          onChange={(e) => handleAssessmentChange(student.id, numKey, e.target.value)} 
                          className="w-16 border border-gray-300 rounded-md p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent print:p-0 print:w-full" 
                          placeholder="-"
                        />
                      </td>
                    ))}
                    <td className="p-4 print:border print:border-gray-300 print:p-2">
                      <select 
                        value={data.tp || 'Belum Dinilai'} 
                        onChange={(e) => handleAssessmentChange(student.id, 'tp', e.target.value)} 
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm outline-none bg-gray-50 focus:bg-white print:border-none print:bg-transparent print:appearance-none print:p-0"
                      >
                        {TP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="p-4 print:border print:border-gray-300 print:p-2">
                      <input 
                        type="text" 
                        value={data.bukti || ''} 
                        onChange={(e) => handleAssessmentChange(student.id, 'bukti', e.target.value)} 
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent print:p-0 print:placeholder-transparent" 
                        placeholder="Tugas, Portofolio..."
                      />
                    </td>
                    <td className="p-4 print:border print:border-gray-300 print:p-2">
                      <input 
                        type="text" 
                        value={data.deskripsi || ''} 
                        onChange={(e) => handleAssessmentChange(student.id, 'deskripsi', e.target.value)} 
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent print:p-0 print:placeholder-transparent" 
                        placeholder="Siswa mampu..."
                      />
                    </td>
                    <td className="p-4 print:border print:border-gray-300 print:p-2">
                      <input 
                        type="text" 
                        value={data.tindakLanjut || ''} 
                        onChange={(e) => handleAssessmentChange(student.id, 'tindakLanjut', e.target.value)} 
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent print:p-0 print:placeholder-transparent" 
                        placeholder="Pengayaan/Remedial..."
                      />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-gray-500 print:border print:border-gray-300">
                    Tidak ada murid di kelas ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Cetak untuk Daftar Nilai */}
        <div className="hidden print:flex justify-between p-8 mt-8 w-full">
          <div className="text-center w-64">
            <p className="mb-24">Mengetahui,<br/>Kepala Sekolah</p>
            <p className="font-bold underline">{schoolInfo?.headmaster || '...................................'}</p>
            <p className="text-sm">NIP. {schoolInfo?.headmasterNip || '...................................'}</p>
          </div>
          <div className="text-center w-64">
            <p className="mb-24"><br/>{schoolInfo?.principalTitle}</p>
            <p className="font-bold underline">{schoolInfo?.principal}</p>
            <p className="text-sm">NIP. {schoolInfo?.principalNip || '...................................'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
