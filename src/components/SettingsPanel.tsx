import React, { useState } from 'react';
import { Settings, Save, Plus, Trash2, Users } from 'lucide-react';
import { SchoolInfo } from '../types';
import { SchoolLogo } from './Logos';

interface SettingsPanelProps {
  schoolInfo: SchoolInfo;
  setSchoolInfo: (info: SchoolInfo) => void;
}

export function SettingsPanel({ schoolInfo, setSchoolInfo }: SettingsPanelProps) {
  const [formData, setFormData] = useState<SchoolInfo>({
    ...schoolInfo,
    customFields: schoolInfo.customFields || []
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolInfo(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, teacherPhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, schoolLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomField = () => {
    setFormData({
      ...formData,
      customFields: [...(formData.customFields || []), { label: '', value: '' }]
    });
  };

  const handleCustomFieldChange = (index: number, key: 'label' | 'value', newValue: string) => {
    const newFields = [...(formData.customFields || [])];
    newFields[index][key] = newValue;
    setFormData({ ...formData, customFields: newFields });
  };

  const handleRemoveCustomField = (index: number) => {
    const newFields = (formData.customFields || []).filter((_, i) => i !== index);
    setFormData({ ...formData, customFields: newFields });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-blue-600" /> Pengaturan Identitas Sekolah
      </h3>
      {saved && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg mb-6 text-sm font-medium border border-emerald-200 flex items-center gap-2">
          <Save className="w-4 h-4 text-emerald-600" />
          Berhasil menyimpan pengaturan identitas sekolah!
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah</label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NPSN</label>
            <input 
              type="text" 
              value={formData.npsn} 
              onChange={e => setFormData({...formData, npsn: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengampu (Guru)</label>
            <input 
              type="text" 
              required 
              value={formData.principal} 
              onChange={e => setFormData({...formData, principal: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIP Pengampu (Guru)</label>
            <input 
              type="text" 
              value={formData.principalNip || ''} 
              onChange={e => setFormData({...formData, principalNip: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Masukkan NIP..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan Pengampu</label>
            <input 
              type="text" 
              value={formData.principalTitle} 
              onChange={e => setFormData({...formData, principalTitle: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
            <input 
              type="text" 
              value={formData.academicYear} 
              onChange={e => setFormData({...formData, academicYear: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select 
              value={formData.semester || 'Ganjil'} 
              onChange={e => setFormData({...formData, semester: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Sekolah</label>
            <input 
              type="text" 
              value={formData.headmaster || ''} 
              onChange={e => setFormData({...formData, headmaster: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Masukkan nama kepala sekolah..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIP Kepala Sekolah</label>
            <input 
              type="text" 
              value={formData.headmasterNip || ''} 
              onChange={e => setFormData({...formData, headmasterNip: e.target.value})} 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Masukkan NIP kepala sekolah..." 
            />
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Informasi Tambahan Sekolah</label>
            <button 
              type="button" 
              onClick={handleAddCustomField} 
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 flex items-center gap-1 font-medium transition-colors"
            >
              <Plus className="h-4 w-4" /> Tambah Info
            </button>
          </div>
          {(formData.customFields || []).length === 0 && (
            <p className="text-xs text-gray-500 italic mb-2">Belum ada informasi tambahan. Klik "Tambah Info" untuk menambahkan kolom baru seperti Email, Website, atau Akreditasi.</p>
          )}
          {(formData.customFields || []).map((field, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-center">
              <input
                type="text"
                placeholder="Nama Kolom (Misal: Email)"
                value={field.label}
                onChange={(e) => handleCustomFieldChange(idx, 'label', e.target.value)}
                className="w-full sm:w-1/3 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Isi informasi..."
                value={field.value}
                onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)}
                className="w-full sm:flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="button" 
                onClick={() => handleRemoveCustomField(idx)} 
                className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg self-end sm:self-auto transition-colors" 
                title="Hapus Info"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil Guru / Admin</label>
          <div className="flex items-center gap-4">
            {formData.teacherPhoto ? (
              <img src={formData.teacherPhoto} alt="Preview" className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 shadow-sm" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 shadow-sm">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
            />
          </div>
        </div>

        <div className="mt-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo Sekolah</label>
          <div className="flex items-center gap-4">
            {formData.schoolLogo ? (
              <img src={formData.schoolLogo} alt="Preview Logo" className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 shadow-sm bg-white" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 shadow-sm overflow-hidden">
                <SchoolLogo large={false} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" /> Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
