export async function foodSafetyAgent(visionResult) {
  const highRisk = visionResult.severity === 'High';

  return {
    recommendation: highRisk
      ? 'Use neem oil first; isolate affected rows before chemical spray.'
      : 'Monitor affected leaves and use botanical spray if spread increases.',
    harvestWindow: highRisk ? 'Safe harvest after 5 days if botanical spray is used' : 'No harvest delay expected'
  };
}
