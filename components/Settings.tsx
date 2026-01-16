import React, { useRef } from 'react';
import { UserProfile, Gender } from '../types';
import { Download, Upload, Save, FileText } from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onImport: (file: File) => void;
  onExport: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  userProfile,
  onUpdateProfile,
  onImport,
  onExport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdateProfile({
      ...userProfile,
      [name]: name === 'gender' ? value : parseFloat(value)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="p-2 bg-teal-100 text-teal-700 rounded-lg"><Save size={20}/></span>
          User Profile
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Your physical attributes are required for accurate BMI and Body Fat Percentage calculations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={userProfile.height}
              onChange={handleProfileChange}
              className="w-full rounded-lg border-slate-200 p-2.5 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={userProfile.age}
              onChange={handleProfileChange}
              className="w-full rounded-lg border-slate-200 p-2.5 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select
              name="gender"
              value={userProfile.gender}
              onChange={handleProfileChange}
              className="w-full rounded-lg border-slate-200 p-2.5 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 border"
            >
              <option value={Gender.Male}>Male</option>
              <option value={Gender.Female}>Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="p-2 bg-blue-100 text-blue-700 rounded-lg"><FileText size={20}/></span>
          Database Management
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Import or export your data as a <code>database.dat</code> file. This file contains all your daily entries and metrics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-900 transition-all shadow-sm active:scale-[0.99]"
          >
            <Download size={18} />
            Export Database
          </button>
          
          <div className="flex-1 relative">
            <input
              type="file"
              accept=".dat,.csv,text/plain"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 font-medium py-3 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.99]"
            >
              <Upload size={18} />
              Import Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};