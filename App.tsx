import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, DEFAULT_PROFILE } from './types';
import { generateCSV, parseCSV, downloadDatabaseFile } from './utils/csvHelpers';
import { Dashboard } from './components/Dashboard';
import { EntryForm } from './components/EntryForm';
import { HistoryTable } from './components/HistoryTable';
import { Settings } from './components/Settings';
import { LayoutDashboard, PlusCircle, Table2, Settings as SettingsIcon, Activity } from 'lucide-react';

enum View {
  Dashboard = 'dashboard',
  Entry = 'entry',
  History = 'history',
  Settings = 'settings',
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [logs, setLogs] = useState<DailyLog[]>([]);

  // Initialization: Load from localStorage if available
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('vitalTrack_profile');
      const savedLogs = localStorage.getItem('vitalTrack_logs');

      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error("Failed to load data from local storage:", error);
      // Fallback to defaults if parsing fails
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('vitalTrack_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('vitalTrack_logs', JSON.stringify(logs));
  }, [logs]);

  const handleSaveLog = (log: DailyLog) => {
    setLogs(prev => {
      // Remove existing entry for same date if any, then add new
      const filtered = prev.filter(l => l.date !== log.date);
      return [...filtered, log];
    });
    alert('Entry saved successfully!');
    setView(View.Dashboard);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        try {
          const parsedLogs = parseCSV(content);
          setLogs(parsedLogs);
          alert(`Successfully imported ${parsedLogs.length} entries.`);
        } catch (error) {
          alert('Failed to parse file. Please ensure it is a valid CSV/DAT file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    downloadDatabaseFile(logs);
  };

  const NavButton = ({ targetView, icon: Icon, label }: { targetView: View; icon: any; label: string }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left font-medium ${
        view === targetView
          ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} className={view === targetView ? 'text-teal-600' : 'text-slate-400'} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 sticky top-0 h-auto md:h-screen z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">VitalTrack</span>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavButton targetView={View.Dashboard} icon={LayoutDashboard} label="Dashboard" />
          <NavButton targetView={View.Entry} icon={PlusCircle} label="New Entry" />
          <NavButton targetView={View.History} icon={Table2} label="History" />
          <NavButton targetView={View.Settings} icon={SettingsIcon} label="Settings" />
        </nav>

        <div className="p-6 mt-auto hidden md:block">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium uppercase mb-2">My Stats</p>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Height:</span>
                <span className="font-semibold">{userProfile.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span>Age:</span>
                <span className="font-semibold">{userProfile.age}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto h-screen">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {view === View.Dashboard && 'Dashboard Overview'}
            {view === View.Entry && 'Log Daily Metrics'}
            {view === View.History && 'Data History'}
            {view === View.Settings && 'Settings & Database'}
          </h1>
          <div className="text-sm text-slate-500">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {view === View.Dashboard && <Dashboard logs={logs} userProfile={userProfile} />}
          
          {view === View.Entry && (
            <EntryForm 
              userProfile={userProfile} 
              onSave={handleSaveLog} 
              // Check if there is an entry for today to preload
              existingLog={logs.find(l => l.date === new Date().toISOString().split('T')[0])}
            />
          )}

          {view === View.History && <HistoryTable logs={logs} />}
          
          {view === View.Settings && (
            <Settings
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
              onImport={handleImport}
              onExport={handleExport}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;