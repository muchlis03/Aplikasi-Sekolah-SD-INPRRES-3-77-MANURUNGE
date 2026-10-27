import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Save } from 'lucide-react';
import { Student } from '../types';
import { CLASSES } from '../constants';

interface StudentManagementProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
}

export function StudentManagement({ students, setStudents }: StudentManagementProps) {
  const [formData, setFormData] = useState({ name: '', class: 'Kelas 1', nis: '', gender: 'Laki-laki' });
  const [searchTerm, setSearchTerm] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const showNotification = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nis.trim()) return;
    const newStudent: Student = { ...formData, id: Date.now().toString() };
    setStudents([...students, newStudent]);
    setFormData({ name: '', class: 'Kelas 1', nis: '', gender: 'Laki-laki' });
    showNotification('Data murid baru berhasil ditambahkan & disimpan!');
  };

  const executeDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter(s => s.id !== studentToDelete));
      setStudentToDelete(null);
      showNotification('Data murid berhasil dihapus!');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editingStudent.name.trim() || !editingStudent.nis.trim()) return;
    setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    showNotification('Perubahan data murid berhasil disimpan!');
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Notifikasi Simpan */}
      {saveMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl shadow-sm flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4">
          <div className="bg-emerald-100 p-1.5 rounded-full">
            <Save className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-sm font-medium">{saveMessage}</span>
        </div>
      )}

      {/* Modal Edit Murid */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-blue-600" /> Edit Data Murid
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">NIS</label>
                <input 
                  type="text" 
                  required 
                  value={editingStudent.nis} 
                  onChange={e => setEditingStudent({...editingStudent, nis: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required 
                  value={editingStudent.name} 
                  onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kelas</label>
                <select 
                  value={editingStudent.class} 
                  onChange={e => setEditingStudent({...editingStudent, class: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Jenis Kelamin</label>
                <select 
                  value={editingStudent.gender || 'Laki-laki'} 
                  onChange={e => setEditingStudent({...editingStudent, gender: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)} 
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6 text-sm">Apakah Anda yakin ingin menghapus data murid ini?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setStudentToDelete(null)} 
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete} 
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tambah Murid Baru</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">NIS</label>
            <input 
              type="text" 
              required 
              value={formData.nis} 
              onChange={e => setFormData({...formData, nis: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Nomor Induk"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Nama murid..."
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Kelas</label>
            <select 
              value={formData.class} 
              onChange={e => setFormData({...formData, class: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none bg-white"
            >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white rounded-lg p-2 text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Murid ({filteredStudents.length})</h3>
          <div className="relative w-full sm:w-auto">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau NIS..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 bg-white" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 border-b font-medium">NIS</th>
                <th className="p-4 border-b font-medium">Nama Murid</th>
                <th className="p-4 border-b font-medium">Kelas</th>
                <th className="p-4 border-b font-medium">Jenis Kelamin</th>
                <th className="p-4 border-b font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-mono text-gray-600">{student.nis}</td>
                  <td className="p-4 font-medium text-gray-800">{student.name}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                      {student.class}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-xs">{student.gender || '-'}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => setEditingStudent(student)} 
                        className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" 
                        title="Edit Data"
                        aria-label={`Edit ${student.name}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setStudentToDelete(student.id)} 
                        className="text-rose-600 hover:text-rose-800 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" 
                        title="Hapus Data"
                        aria-label={`Hapus ${student.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Tidak ada murid ditemukan.
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
