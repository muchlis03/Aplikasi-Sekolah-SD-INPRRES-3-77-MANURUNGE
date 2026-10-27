import React from 'react';
import { Users, UserCheck, UserX, BookOpen, GraduationCap, BarChart } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import { SchoolInfo, Student, AttendanceMap } from '../types';
import { CLASSES, CHART_COLORS } from '../constants';
import { SchoolLogo } from './Logos';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceMap;
  schoolInfo: SchoolInfo;
  colors?: string[];
}

export function Dashboard({ students, attendance, schoolInfo, colors = CHART_COLORS }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance[today] || {};
  
  const totalStudents = students.length;
  const presentCount = Object.values(todayAttendance).filter(v => v === 'Hadir').length;
  const absentCount = Object.values(todayAttendance).filter(v => ['Sakit', 'Izin', 'Alpa'].includes(v)).length;
  
  const classDistribution = CLASSES.map(cls => ({
    name: cls,
    value: students.filter(s => s.class === cls).length
  })).filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <StatCard title="Total Murid" value={totalStudents} icon={Users} color="bg-blue-600" />
        <StatCard title="Hadir Hari Ini" value={presentCount} icon={UserCheck} color="bg-emerald-600" />
        <StatCard title="Tidak Hadir" value={absentCount} icon={UserX} color="bg-rose-600" />
        <StatCard title="Total Kelas" value={CLASSES.length} icon={BookOpen} color="bg-cyan-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 print:hidden">
        {schoolInfo.teacherPhoto ? (
          <img 
            src={schoolInfo.teacherPhoto} 
            alt="Profil Guru" 
            className="w-24 h-24 rounded-xl object-cover border-4 border-blue-100 shadow-md flex-shrink-0" 
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-blue-50 flex items-center justify-center border-4 border-blue-100 shadow-md flex-shrink-0 text-blue-400">
            <Users className="w-12 h-12" />
          </div>
        )}
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-xl font-bold text-gray-800">{schoolInfo.principal}</h3>
          <p className="text-sm font-medium text-blue-600 mb-2">{schoolInfo.principalTitle}</p>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Selamat datang di Sistem Informasi Presensi & Nilai <strong>Guru Hebat</strong>. 
            Sistem ini dirancang untuk mempermudah Bapak/Ibu dalam mengelola data kehadiran murid serta manajemen nilai asesmen Kurikulum Merdeka secara digital dan efisien di {schoolInfo.name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600 print:hidden" /> Identitas Sekolah
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
            <SchoolLogo large src={schoolInfo.schoolLogo} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm w-full flex-1">
              <InfoItem label="Nama" value={schoolInfo.name} />
              <InfoItem label="NPSN" value={schoolInfo.npsn} />
              <InfoItem label="Alamat" value={schoolInfo.address} />
              <InfoItem label="Telepon" value={schoolInfo.phone} />
              <InfoItem label="Kepala Sekolah" value={schoolInfo.headmaster || '-'} />
              <InfoItem label="NIP Kepala Sekolah" value={schoolInfo.headmasterNip || '-'} />
              <InfoItem label={schoolInfo.principalTitle} value={schoolInfo.principal} />
              <InfoItem label="NIP Pengampu" value={schoolInfo.principalNip || '-'} />
              <InfoItem label="Tahun Ajaran" value={schoolInfo.academicYear} />
              <InfoItem label="Semester" value={schoolInfo.semester || 'Ganjil'} />
              {schoolInfo.customFields && schoolInfo.customFields.map((field, idx) => (
                <InfoItem key={idx} label={field.label || 'Info Tambahan'} value={field.value} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-600" /> Distribusi Murid Per Kelas
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <RechartsLegend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="hidden print:flex justify-between w-full mt-12 px-8">
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
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: any; color: string }) {
  return (
    <div className={`p-6 rounded-xl shadow-sm text-white flex items-center justify-between ${color}`}>
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <h4 className="text-3xl font-bold mt-1">{value}</h4>
      </div>
      <div className="bg-white/20 p-3 rounded-lg">
        <Icon className="h-8 w-8 text-white" />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs font-medium uppercase">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}
