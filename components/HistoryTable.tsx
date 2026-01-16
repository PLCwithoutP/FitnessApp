import React from 'react';
import { DailyLog } from '../types';

export const HistoryTable: React.FC<{ logs: DailyLog[] }> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No history data available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Weight (kg)</th>
              <th className="px-6 py-4 whitespace-nowrap">BMI</th>
              <th className="px-6 py-4 whitespace-nowrap">Body Fat %</th>
              <th className="px-6 py-4 whitespace-nowrap">Neck (cm)</th>
              <th className="px-6 py-4 whitespace-nowrap">Waist (cm)</th>
              <th className="px-6 py-4 whitespace-nowrap">Hip (cm)</th>
              <th className="px-6 py-4 whitespace-nowrap">Cal In</th>
              <th className="px-6 py-4 whitespace-nowrap">Steps</th>
              <th className="px-6 py-4 whitespace-nowrap">Cal Burned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedLogs.map((log) => (
              <tr key={log.date} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-900 whitespace-nowrap">{log.date}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.weight}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        log.bmi < 18.5 ? 'bg-yellow-100 text-yellow-700' :
                        log.bmi < 25 ? 'bg-green-100 text-green-700' :
                        log.bmi < 30 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        {log.bmi}
                    </span>
                </td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.bodyFat}%</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.neck}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.waist}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.hip || '-'}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.caloriesIn}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.steps}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{log.caloriesBurned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};