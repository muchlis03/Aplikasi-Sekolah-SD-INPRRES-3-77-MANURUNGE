import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, UserCheck, Users } from 'lucide-react';
import { Student, AttendanceMap } from '../types';
import { CLASSES } from '../constants';

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceMap;
  setAttendance: (attendance: AttendanceMap) => void;
}

export function Attendance({ students, attendance, setAttendance }: AttendanceProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');

  const filteredStudents = selectedClass === 'Semua Kelas' ? students : students.filter(s => s.class === selectedClass);
  const currentAttendance = attendance[date] || {};

  const handleMark = (studentId: string, status: string) => {
    setAttendance({
      ...attendance,
      [date]: { ...currentAttendance, [studentId]: status }
    });
  };

  const handleMarkAllPresent = () => {
    const updated = { ...currentAttendance };
    filteredStudents.forEach(s => {
      updated[s.id] = 'Hadir';
    });
    setAttendance({
      ...attendance,
      [date]: updated
    });
  };

  const STATUSES = [
    { label: 'Hadir', activeClass: 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300' },
    { label: 'Sakit', activeClass: 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300' },
    { label: 'Izin', activeClass: 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-300' },
    { label: 'Alpa', activeClass: 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="border-none font-semibold text-gray-700 focus:ring-0 outline-none cursor-pointer bg-transparent text-sm" 
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)} 
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none bg-gray-50 focus:bg-white"
          >
            <option value="Semua Kelas">Semua Kelas</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Setel Semua Hadir
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Presensi Tanggal: <span className="text-blue-700 font-bold">{date}</span> ({filteredStudents.length} Murid)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 border-b font-medium">Nama Murid</th>
                <th className="p-4 border-b font-medium">Kelas</th>
                <th className="p-4 border-b font-medium text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredStudents.length > 0 ? filteredStudents.map(student => {
                const status = currentAttendance[student.id] || 'Belum Diabsen';
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">
                      {student.name}
                      <span className="block text-xs text-gray-400 font-normal">NIS: {student.nis}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {student.class}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {STATUSES.map(s => {
                          const isSelected = status === s.label;
                          return (
                            <button 
                              key={s.label} 
                              onClick={() => handleMark(student.id, s.label)} 
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isSelected ? s.activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    Tidak ada murid di kelas yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
