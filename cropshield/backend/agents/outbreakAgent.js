export async function outbreakAgent() {
  return {
    sprayZones: [
      { row: 'A1-A4', dose: 'High', coverage: 82 },
      { row: 'B1-B3', dose: 'Medium', coverage: 56 },
      { row: 'C1-C2', dose: 'Low', coverage: 24 }
    ],
    spread: [
      { radius: '100 m', farms: 4, risk: 'Critical' },
      { radius: '300 m', farms: 13, risk: 'Watch' },
      { radius: '700 m', farms: 31, risk: 'Monitor' }
    ]
  };
}
