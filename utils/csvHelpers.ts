import { DailyLog } from '../types';

const HEADERS = [
  'Date',
  'Weight(kg)',
  'BMI',
  'Neck(cm)',
  'Waist(cm)',
  'Hip(cm)',
  'BodyFat(%)',
  'CaloriesIn',
  'Steps',
  'CaloriesBurned'
];

export const generateCSV = (logs: DailyLog[]): string => {
  const headerRow = HEADERS.join(',');
  const rows = logs.map(log => {
    return [
      log.date,
      log.weight,
      log.bmi,
      log.neck,
      log.waist,
      log.hip || 0,
      log.bodyFat,
      log.caloriesIn,
      log.steps,
      log.caloriesBurned
    ].join(',');
  });
  return [headerRow, ...rows].join('\n');
};

export const parseCSV = (csvContent: string): DailyLog[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  // Skip header
  const dataLines = lines.slice(1);
  const logs: DailyLog[] = [];

  for (const line of dataLines) {
    const cols = line.split(',').map(c => c.trim());
    if (cols.length < 9) continue; // Basic validation

    // Mapping based on HEADERS index
    // 0:Date, 1:Weight, 2:BMI, 3:Neck, 4:Waist, 5:Hip, 6:BodyFat, 7:CalIn, 8:Steps, 9:CalOut
    const log: DailyLog = {
      date: cols[0],
      weight: parseFloat(cols[1]) || 0,
      bmi: parseFloat(cols[2]) || 0,
      neck: parseFloat(cols[3]) || 0,
      waist: parseFloat(cols[4]) || 0,
      hip: parseFloat(cols[5]) || 0,
      bodyFat: parseFloat(cols[6]) || 0,
      caloriesIn: parseFloat(cols[7]) || 0,
      steps: parseFloat(cols[8]) || 0,
      caloriesBurned: parseFloat(cols[9]) || 0,
    };
    logs.push(log);
  }

  // Sort by date ascending
  return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const downloadDatabaseFile = (logs: DailyLog[]) => {
  const csv = generateCSV(logs);
  const blob = new Blob([csv], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'database.dat';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};