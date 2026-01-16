import React, { useState, useEffect } from 'react';
import { DailyLog, UserProfile, Gender } from '../types';
import { calculateBMI, calculateBodyFat } from '../utils/calculations';

interface EntryFormProps {
  userProfile: UserProfile;
  onSave: (log: DailyLog) => void;
  existingLog?: DailyLog;
}

export const EntryForm: React.FC<EntryFormProps> = ({ userProfile, onSave, existingLog }) => {
  const [formData, setFormData] = useState<Partial<DailyLog>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
    caloriesIn: 0,
    steps: 0,
    caloriesBurned: 0
  });

  const [previews, setPreviews] = useState({ bmi: 0, bodyFat: 0 });

  useEffect(() => {
    if (existingLog) {
      setFormData(existingLog);
    }
  }, [existingLog]);

  // Live calculation of metrics
  useEffect(() => {
    const w = Number(formData.weight) || 0;
    const n = Number(formData.neck) || 0;
    const wa = Number(formData.waist) || 0;
    const h = Number(formData.hip) || 0;

    const bmi = calculateBMI(w, userProfile.height);
    const bf = calculateBodyFat(userProfile.gender, wa, n, userProfile.height, h);

    setPreviews({ bmi, bodyFat: bf });
  }, [formData, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'date' ? value : parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) return;

    const fullLog: DailyLog = {
      date: formData.date,
      weight: Number(formData.weight) || 0,
      bmi: previews.bmi,
      neck: Number(formData.neck) || 0,
      waist: Number(formData.waist) || 0,
      hip: Number(formData.hip) || 0,
      bodyFat: previews.bodyFat,
      caloriesIn: Number(formData.caloriesIn) || 0,
      steps: Number(formData.steps) || 0,
      caloriesBurned: Number(formData.caloriesBurned) || 0,
    };

    onSave(fullLog);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6">New Daily Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border-slate-200 focus:border-teal-500 focus:ring-teal-500 p-2.5 bg-slate-50 border"
          />
        </div>

        {/* Section 1: Body Metrics */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Body Measurements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" name="weight" value={formData.weight || ''} onChange={handleChange} className="w-full rounded-md border-slate-200 p-2" placeholder="0.0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Neck (cm)</label>
              <input type="number" step="0.1" name="neck" value={formData.neck || ''} onChange={handleChange} className="w-full rounded-md border-slate-200 p-2" placeholder="0.0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Waist (cm)</label>
              <input type="number" step="0.1" name="waist" value={formData.waist || ''} onChange={handleChange} className="w-full rounded-md border-slate-200 p-2" placeholder="0.0" />
            </div>
            {userProfile.gender === Gender.Female && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hip (cm)</label>
                <input type="number" step="0.1" name="hip" value={formData.hip || ''} onChange={handleChange} className="w-full rounded-md border-slate-200 p-2" placeholder="Required for Female BF%" />
              </div>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border border-slate-200 text-center">
              <span className="block text-xs text-slate-500">Calculated BMI</span>
              <span className="block text-lg font-bold text-teal-600">{previews.bmi}</span>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200 text-center">
              <span className="block text-xs text-slate-500">Est. Body Fat %</span>
              <span className="block text-lg font-bold text-teal-600">{previews.bodyFat}%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Activity */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Activity & Nutrition</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Calories In</label>
              <input type="number" name="caloriesIn" value={formData.caloriesIn || ''} onChange={handleChange} className="w-full rounded-md border-slate-200 p-2" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Daily Steps</label>
              <input type="number" name="steps" value={formData.steps || ''} onChange={handleChange} className="w-full rounded-md border-slate-200 p-2" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Calories Burned</label>
              <input type="number" name="caloriesBurned" value={formData.caloriesBurned || ''} onChange={handleChange} className="w-full rounded-md border-slate-200 p-2" placeholder="0" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors shadow-sm active:scale-[0.99]"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};