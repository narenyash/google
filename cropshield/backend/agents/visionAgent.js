export async function visionAgent({ crop = 'Tomato' } = {}) {
  return {
    crop,
    pest: 'Whitefly',
    confidence: 0.94,
    severity: 'High',
    symptom: 'Leaf curling with sticky honeydew patches'
  };
}
