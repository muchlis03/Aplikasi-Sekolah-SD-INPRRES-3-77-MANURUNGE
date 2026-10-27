import { SchoolInfo, Student } from './types';

export const CLASSES = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

export const SUBJECTS = [
  'Pendidikan Agama Islam',
  'Matematika',
  'Bahasa Indonesia',
  'IPAS',
  'PPKn',
  'Seni Budaya',
  'PJOK',
  'Bahasa Inggris',
  'Bahasa Daerah',
  'Pendidikan Pancasila'
];

export const defaultSchoolInfo: SchoolInfo = {
  name: 'SD INPRES 3/77 MANURUNGE',
  npsn: '40302982',
  level: 'SD',
  address: 'JALAN ANDALAS',
  phone: '082346049815',
  principal: 'MUCHLIS, S. Pd Gr',
  principalNip: '19850512 201001 1 015',
  principalTitle: 'Guru Mata Pelajaran',
  headmaster: 'NAMA KEPALA SEKOLAH, S.Pd., M.Pd',
  headmasterNip: '19700101 200003 2 001',
  academicYear: '2026-2027',
  semester: 'Ganjil',
  teacherPhoto: '',
  schoolLogo: '',
  customFields: []
};

export const initialStudents: Student[] = [
  { id: '1', name: 'Andi Mappanyukki', class: 'Kelas 1', nis: '1001', gender: 'Laki-laki' },
  { id: '2', name: 'Siti Aminah', class: 'Kelas 1', nis: '1002', gender: 'Perempuan' },
  { id: '3', name: 'Budi Santoso', class: 'Kelas 2', nis: '1003', gender: 'Laki-laki' },
  { id: '4', name: 'Rina Nose', class: 'Kelas 3', nis: '1004', gender: 'Perempuan' },
  { id: '5', name: 'Ahmad Dahlan', class: 'Kelas 4', nis: '1005', gender: 'Laki-laki' },
  { id: '6', name: 'Cut Nyak Dien', class: 'Kelas 5', nis: '1006', gender: 'Perempuan' },
  { id: '7', name: 'Hasanuddin', class: 'Kelas 6', nis: '1007', gender: 'Laki-laki' },
];

export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#ff7300'];
