import React, { useMemo } from 'react';
import { DailyLog } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardProps {
  logs: DailyLog[];
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col h-80">
    <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">{title}</h3>
    <div className="flex-1 w-full min-h-0">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const chartData = useMemo(() => {
    // Sort logs by date just in case
    return [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-200"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
        <p className="text-lg font-medium text-slate-600">No data available yet.</p>
        <p className="text-sm">Start by adding a new entry or importing a database file.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
      <ChartCard title="Weight & BMI">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#0ea5e9" tick={{fontSize: 12}} domain={['auto', 'auto']} />
            <YAxis yAxisId="right" orientation="right" stroke="#6366f1" tick={{fontSize: 12}} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line yAxisId="right" type="monotone" dataKey="bmi" name="BMI" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Body Composition">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} stroke="#94a3b8" />
            <YAxis stroke="#10b981" tick={{fontSize: 12}} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Measurements (cm)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} stroke="#94a3b8" />
            <YAxis stroke="#f59e0b" tick={{fontSize: 12}} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="waist" name="Waist" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="neck" name="Neck" stroke="#ec4899" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="hip" name="Hip" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Activity & Calories">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#f97316" tick={{fontSize: 12}} />
            <YAxis yAxisId="right" orientation="right" stroke="#14b8a6" tick={{fontSize: 12}} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="caloriesIn" name="Cal In" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="caloriesBurned" name="Cal Out" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="steps" name="Steps" stroke="#14b8a6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};