import { Gender } from '../types';

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(2));
};

export const calculateBodyFat = (
  gender: Gender,
  waistCm: number,
  neckCm: number,
  heightCm: number,
  hipCm: number = 0
): number => {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0) return 0;

  let bodyFat = 0;

  // U.S. Navy Method
  if (gender === Gender.Male) {
    // Male: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const waistNeckDiff = waistCm - neckCm;
    if (waistNeckDiff <= 0) return 0; // Invalid measurement
    
    const logWaistNeck = Math.log10(waistNeckDiff);
    const logHeight = Math.log10(heightCm);
    
    const denominator = 1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight;
    bodyFat = 495 / denominator - 450;
  } else {
    // Female: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    // Note: Standard Navy method for women usually requires hips. 
    // If hip is missing (0), the calc will be inaccurate, but we will try to proceed or fallback.
    const hipValue = hipCm || waistCm; // Fallback if hip not provided (though inaccuracy is high)
    const waistHipNeckDiff = waistCm + hipValue - neckCm;
    
    if (waistHipNeckDiff <= 0) return 0;

    const logWaistHipNeck = Math.log10(waistHipNeckDiff);
    const logHeight = Math.log10(heightCm);
    
    const denominator = 1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight;
    bodyFat = 495 / denominator - 450;
  }

  return Math.max(0, parseFloat(bodyFat.toFixed(2)));
};