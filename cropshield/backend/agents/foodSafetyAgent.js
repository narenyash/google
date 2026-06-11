const YIELD_MAP = {
  maize: 2500,
  wheat: 2000,
  rice: 2700,
  tomato: 8000,
  onion: 6000
};

export function calculateFoodSafety(affectedPercent, fieldSizeAcres, cropType) {
  const yieldPerAcre = YIELD_MAP[cropType?.toLowerCase()] ?? 2000;
  const pesticideSavedPercent = 100 - affectedPercent;
  const totalYieldKg = yieldPerAcre * fieldSizeAcres;
  const contaminationPreventedKg = (pesticideSavedPercent / 100) * totalYieldKg;

  return {
    traditionalSprayPercent: 100,
    cropShieldSprayPercent: Math.round(affectedPercent * 10) / 10,
    pesticideSavedPercent: Math.round(pesticideSavedPercent * 10) / 10,
    totalYieldKg: Math.round(totalYieldKg),
    contaminationPreventedKg: Math.round(contaminationPreventedKg),
    comparisonMessage: `CropShield saves ${Math.round(pesticideSavedPercent * 10) / 10}% pesticide and protects ${Math.round(contaminationPreventedKg)}kg of food from contamination`
  };
}
