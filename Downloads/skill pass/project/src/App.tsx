import { useEffect, useState } from 'react';
import { HomePage } from './components/HomePage';
import { JurusanDetailPage } from './components/JurusanDetailPage';
import { LoginPage } from './components/LoginPage';
import { FooterReflexGame } from './components/FooterReflexGame';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Jurusan } from './types';
import smkLogo from './assets/smk-logo.png';
import { LogOut } from 'lucide-react';

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);
  const [themeClear, setThemeClear] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'clear';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (themeClear) root.classList.add('theme-clear'); else root.classList.remove('theme-clear');
    try { localStorage.setItem('theme', themeClear ? 'clear' : 'dark'); } catch (e) { }
  }, [themeClear]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full py-3 px-4 sm:py-4 sm:px-6 border-b border-white/6 bg-gradient-to-r from-[rgba(255,255,255,0.02)] to-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={smkLogo} alt="SMK Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-white p-1 shadow-md flex-shrink-0" />
            <div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">Skill Passport</div>
                <div className="text-xs text-white/60 truncate hidden sm:block">Menuju vokasi berstandar industri & Terverifikasi</div>
              </div>
            </div>

          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="hidden sm:block text-sm text-white/70">
                Welcome, <span className="font-medium text-white">{user?.name}</span>
              </div>
              <div className={`hidden sm:flex px-2 py-1 rounded-md text-xs font-medium ${user?.role === 'teacher'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                {user?.role === 'teacher' ? 'Guru' : 'Siswa'}
              </div>
            </div>
            {/* theme toggle (only one rendered below next to avatar) */}
            <div className="flex items-center gap-2">
              <button
                aria-label="Toggle theme"
                onClick={() => setThemeClear((s) => !s)}
                title={themeClear ? 'Switch to dark' : 'Switch to clear'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/6 flex items-center justify-center bg-transparent hover:bg-white/5 transition-all text-white"
              >
                {themeClear ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>
              <button
                onClick={logout}
                aria-label="Logout"
                title="Logout"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/6 flex items-center justify-center bg-transparent hover:bg-red-500/10 hover:border-red-500/30 transition-all text-white hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${user?.role === 'teacher'
                ? 'from-indigo-400 to-blue-400'
                : 'from-purple-400 to-pink-400'
                } border border-white/6 flex items-center justify-center text-xs font-semibold`}>
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {selectedJurusan ? (
          <JurusanDetailPage
            jurusan={selectedJurusan}
            onBack={() => setSelectedJurusan(null)}
          />
        ) : (
          <HomePage onSelectJurusan={setSelectedJurusan} />
        )}
      </main>
      <FooterReflexGame />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

