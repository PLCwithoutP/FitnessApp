export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export interface UserProfile {
  height: number; // in cm
  gender: Gender;
  age: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  weight: number; // kg
  bmi: number;
  neck: number; // cm
  waist: number; // cm
  hip?: number; // cm, optional, primarily for female body fat calc
  bodyFat: number; // percentage
  caloriesIn: number;
  steps: number;
  caloriesBurned: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  height: 170,
  gender: Gender.Male,
  age: 30,
};