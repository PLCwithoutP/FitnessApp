import { DailyLog, UserProfile, Gender } from '../types';

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

export const generateCSV = (logs: DailyLog[], profile: UserProfile): string => {
  // Add metadata row at the top
  const metadataRow = `METADATA,${profile.height},${profile.age},${profile.gender}`;
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
  return [metadataRow, headerRow, ...rows].join('\n');
};

export const parseCSV = (csvContent: string): { logs: DailyLog[], profile?: UserProfile } => {
  const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return { logs: [] };

  let profile: UserProfile | undefined;
  let logStartIndex = 0;

  // Check for Metadata
  // Format: METADATA,Height,Age,Gender
  if (lines[0].startsWith('METADATA')) {
    const parts = lines[0].split(',').map(p => p.trim());
    if (parts.length >= 4) {
      const h = parseFloat(parts[1]);
      const a = parseFloat(parts[2]);
      const g = parts[3] as Gender;
      
      if (!isNaN(h) && !isNaN(a) && (g === Gender.Male || g === Gender.Female)) {
        profile = { height: h, age: a, gender: g };
      }
    }
    logStartIndex = 1;
  }

  // Ensure we have enough lines for headers + data
  if (lines.length <= logStartIndex) {
    // If only metadata exists, return it with empty logs
    return { logs: [], profile };
  }

  // Skip header row
  const dataLines = lines.slice(logStartIndex + 1);
  const logs: DailyLog[] = [];

  for (const line of dataLines) {
    const cols = line.split(',').map(c => c.trim());
    if (cols.length < 9) continue; // Basic validation

    // Mapping based on HEADERS index
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
  return { 
    logs: logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    profile
  };
};

export const downloadDatabaseFile = (logs: DailyLog[], profile: UserProfile) => {
  const csv = generateCSV(logs, profile);
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