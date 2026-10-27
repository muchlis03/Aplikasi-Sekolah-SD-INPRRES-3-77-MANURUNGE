import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  GraduationCap, 
  LayoutDashboard, 
  Award, 
  LogOut, 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  HardDrive,
  WifiOff
} from 'lucide-react';

import { SchoolInfo, Student, AttendanceMap, GradeMap } from './types';
import { defaultSchoolInfo, initialStudents, CHART_COLORS } from './constants';
import { SchoolLogo } from './components/Logos';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { Attendance } from './components/Attendance';
import { Grades } from './components/Grades';
import { Reports } from './components/Reports';
import { SettingsPanel } from './components/SettingsPanel';
import { Login } from './components/Login';
import { 
  auth, 
  loginWithGoogle, 
  logout, 
  subscribeToUserData, 
  saveUserData, 
  testConnection 
} from './services/firebase';

// LocalStorage helpers
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(`guru_hebat_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(`guru_hebat_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Gagal menyimpan ke penyimpanan lokal:", e);
  }
};

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [localUser, setLocalUser] = useState<{ displayName: string } | null>(() => {
    return loadFromStorage<{ displayName: string } | null>('session', null);
  });
  const [isDbReady, setIsDbReady] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'saved_local' | 'error'>('idle');
  const [syncErrorMessage, setSyncErrorMessage] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'attendance' | 'grades' | 'reports' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => loadFromStorage('schoolInfo', defaultSchoolInfo));
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', initialStudents));
  const [attendance, setAttendance] = useState<AttendanceMap>(() => loadFromStorage('attendance', {}));
  const [grades, setGrades] = useState<GradeMap>(() => loadFromStorage('grades', {}));

  // Track pending autosave debounce timers
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Inisialisasi Autentikasi Firebase
  useEffect(() => {
    testConnection().then(() => setIsDbReady(true)).catch(() => setIsDbReady(true));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsDbReady(true);
    });

    return () => unsubscribe();
  }, []);

  // 2. Tarik & Sinkronisasi Data Real-Time dari Cloud Firestore berdasarkan UID
  useEffect(() => {
    if (!firebaseUser) return;

    const uid = firebaseUser.uid;
    const unsubscribes: Array<() => void> = [];

    // Real-time listener for School Info
    unsubscribes.push(
      subscribeToUserData<SchoolInfo>(
        uid, 
        'schoolInfo', 
        (data) => {
          if (data && data.name) {
            setSchoolInfo(data);
            saveToStorage('schoolInfo', data);
          }
        },
        (err) => {
          console.warn("Gagal membaca schoolInfo dari Firestore:", err);
          setSyncStatus('error');
          setSyncErrorMessage('Gagal sinkronisasi data sekolah.');
        }
      )
    );

    // Real-time listener for Students
    unsubscribes.push(
      subscribeToUserData<{ list: Student[] }>(
        uid, 
        'students', 
        (data) => {
          if (data && Array.isArray(data.list)) {
            setStudents(data.list);
            saveToStorage('students', data.list);
          }
        },
        (err) => {
          console.warn("Gagal membaca data murid dari Firestore:", err);
        }
      )
    );

    // Real-time listener for Attendance
    unsubscribes.push(
      subscribeToUserData<AttendanceMap>(
        uid, 
        'attendance', 
        (data) => {
          if (data) {
            setAttendance(data);
            saveToStorage('attendance', data);
          }
        },
        (err) => {
          console.warn("Gagal membaca presensi dari Firestore:", err);
        }
      )
    );

    // Real-time listener for Grades
    unsubscribes.push(
      subscribeToUserData<GradeMap>(
        uid, 
        'grades', 
        (data) => {
          if (data) {
            setGrades(data);
            saveToStorage('grades', data);
          }
        },
        (err) => {
          console.warn("Gagal membaca nilai dari Firestore:", err);
        }
      )
    );

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [firebaseUser]);

  // Fungsi Debounced Auto-Save ke Firestore dengan konfirmasi sukses
  const handleAutoSave = (docName: string, data: any) => {
    // 1. Simpan segera ke localStorage (optimistic & zero-data-loss guarantee)
    saveToStorage(docName, data);

    // Jika belum login via cloud, tandai sebagai tersimpan lokal
    if (!firebaseUser) {
      setSyncStatus('saved_local');
      setTimeout(() => setSyncStatus('idle'), 2500);
      return;
    }

    // Clear existing timer for this document
    if (debounceTimers.current[docName]) {
      clearTimeout(debounceTimers.current[docName]);
    }

    setSyncStatus('syncing');

    // Debounce save to Firestore to prevent excessive writes while typing
    debounceTimers.current[docName] = setTimeout(async () => {
      try {
        await saveUserData(firebaseUser.uid, docName, data);
        setSyncStatus('saved');
        setSyncErrorMessage('');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } catch (error: any) {
        console.error(`Gagal menyimpan ${docName} ke Firestore:`, error);
        setSyncStatus('error');
        setSyncErrorMessage('Gagal sinkron ke Cloud. Data aman di penyimpanan lokal.');
      }
    }, 600);
  };

  const handleSetSchoolInfo = (info: SchoolInfo) => {
    setSchoolInfo(info);
    handleAutoSave('schoolInfo', info);
  };

  const handleSetStudents = (list: Student[]) => {
    setStudents(list);
    handleAutoSave('students', { list });
  };

  const handleSetAttendance = (data: AttendanceMap) => {
    setAttendance(data);
    handleAutoSave('attendance', data);
  };

  const handleSetGrades = (data: GradeMap) => {
    setGrades(data);
    handleAutoSave('grades', data);
  };

  const handleOfflineLogin = (name?: string) => {
    const userObj = { displayName: name || schoolInfo.principal || 'Guru Pengampu' };
    setLocalUser(userObj);
    saveToStorage('session', userObj);
  };

  const handleLogout = async () => {
    setLocalUser(null);
    saveToStorage('session', null);
    try {
      await logout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setActiveTab('dashboard');
  };

  if (!isDbReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-base">Menghubungkan ke Cloud Guru Hebat...</p>
          <p className="text-gray-400 text-xs mt-1">SD Inpres 3/77 Manurunge</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!firebaseUser || !!localUser;

  if (!isAuthenticated) {
    return (
      <Login 
        auth={auth} 
        onOfflineLogin={handleOfflineLogin} 
        isFirebaseAvailable={true} 
      />
    );
  }

  const userDisplayName = firebaseUser?.displayName || localUser?.displayName || schoolInfo.principal || 'Guru Pengampu';
  const userEmail = firebaseUser?.email || '';
  const userPhoto = firebaseUser?.photoURL || '';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} attendance={attendance} schoolInfo={schoolInfo} colors={CHART_COLORS} />;
      case 'students':
        return <StudentManagement students={students} setStudents={handleSetStudents} />;
      case 'attendance':
        return <Attendance students={students} attendance={attendance} setAttendance={handleSetAttendance} />;
      case 'grades':
        return <Grades students={students} grades={grades} setGrades={handleSetGrades} schoolInfo={schoolInfo} />;
      case 'reports':
        return <Reports students={students} attendance={attendance} grades={grades} schoolInfo={schoolInfo} />;
      case 'settings':
        return <SettingsPanel schoolInfo={schoolInfo} setSchoolInfo={handleSetSchoolInfo} />;
      default:
        return <Dashboard students={students} attendance={attendance} schoolInfo={schoolInfo} colors={CHART_COLORS} />;
    }
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as const, label: 'Data Murid', icon: Users },
    { id: 'attendance' as const, label: 'Presensi', icon: UserCheck },
    { id: 'grades' as const, label: 'Daftar Nilai', icon: Award },
    { id: 'reports' as const, label: 'Rekap & Laporan', icon: FileText },
    { id: 'settings' as const, label: 'Pengaturan', icon: Settings }
  ];

  const renderSyncStatus = () => {
    if (!isOnline) {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
          <WifiOff className="h-3.5 w-3.5 text-amber-600" /> Mode Offline (Data Tersimpan Lokal)
        </div>
      );
    }

    switch (syncStatus) {
      case 'syncing':
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <RefreshCw className="h-3 w-3 animate-spin text-blue-600" /> Menyimpan ke Cloud...
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Tersimpan di Cloud
          </div>
        );
      case 'saved_local':
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <HardDrive className="h-3.5 w-3.5 text-blue-600" /> Tersimpan Lokal
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200" title={syncErrorMessage}>
            <AlertCircle className="h-3.5 w-3.5 text-rose-600" /> {syncErrorMessage || 'Gagal Sinkron Cloud'}
          </div>
        );
      default:
        return firebaseUser ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100">
            <Cloud className="h-3.5 w-3.5 text-blue-600" /> Cloud Firestore Aktif
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <HardDrive className="h-3.5 w-3.5 text-slate-500" /> Penyimpanan Lokal
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white print:block">
      {/* Sidebar */}
      <aside 
        className={`bg-[#001f3f] text-white w-64 flex-shrink-0 transition-transform duration-300 ease-in-out z-30 fixed md:relative h-full print:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-blue-900/80">
          <div className="flex items-center gap-3">
            <SchoolLogo src={schoolInfo.schoolLogo} />
            <div>
              <span className="font-bold text-base tracking-wider block">GURU HEBAT</span>
              <span className="text-[11px] text-blue-200 block truncate max-w-[140px]">{schoolInfo.name}</span>
            </div>
          </div>
          <button 
            className="md:hidden text-gray-300 hover:text-white p-1" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Tutup Menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-165px)]">
          <p className="text-[11px] text-blue-300/80 uppercase font-bold tracking-wider mb-2 px-3">Menu Utama</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                    isActive 
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/50' 
                      : 'text-gray-300 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile in Sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-900/80 bg-[#001831]">
          <div className="flex items-center gap-3 mb-3">
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt={userDisplayName} 
                className="w-9 h-9 rounded-full object-cover border border-blue-300 shadow-sm flex-shrink-0" 
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm uppercase flex-shrink-0 shadow-sm">
                {userDisplayName.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">{userDisplayName}</p>
              {userEmail ? (
                <p className="text-[11px] text-blue-300 truncate" title={userEmail}>{userEmail}</p>
              ) : (
                <p className="text-[11px] text-blue-300 truncate">{schoolInfo.principalTitle}</p>
              )}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg transition-colors text-xs font-semibold shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" /> Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden print:h-auto print:overflow-visible">
        {/* Topbar */}
        <header className="bg-white h-16 flex items-center justify-between px-4 lg:px-8 border-b border-gray-200/80 shadow-sm flex-shrink-0 z-10 print:hidden">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900 p-1.5 rounded-lg border border-gray-200" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Buka Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600 hidden sm:block" />
              <h1 className="text-base sm:text-lg font-bold text-gray-800 tracking-tight truncate max-w-xs sm:max-w-md md:max-w-xl">
                {schoolInfo.name}
              </h1>
            </div>
            <div className="hidden md:block ml-2">
              {renderSyncStatus()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800">{userDisplayName}</p>
              <p className="text-[11px] text-gray-500">
                {userEmail || `${schoolInfo.academicYear} - ${schoolInfo.semester}`}
              </p>
            </div>
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt="Foto Profil" 
                className="h-9 w-9 rounded-full object-cover border-2 border-blue-400 shadow-sm flex-shrink-0" 
              />
            ) : schoolInfo.teacherPhoto ? (
              <img 
                src={schoolInfo.teacherPhoto} 
                alt="Guru" 
                className="h-9 w-9 rounded-full object-cover border-2 border-blue-200 shadow-sm flex-shrink-0" 
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200 shadow-sm flex-shrink-0 text-blue-700 font-bold text-sm">
                {userDisplayName.charAt(0)}
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 bg-gray-50 print:overflow-visible print:p-0 print:bg-white">
          <div className="max-w-7xl mx-auto print:max-w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
