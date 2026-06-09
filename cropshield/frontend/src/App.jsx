import { useMemo, useState } from 'react';
import UploadScreen from './components/UploadScreen.jsx';
import DetectionScreen from './components/DetectionScreen.jsx';
import SprayMapScreen from './components/SprayMapScreen.jsx';
import MemoryScreen from './components/MemoryScreen.jsx';
import SpreadMapScreen from './components/SpreadMapScreen.jsx';
import AlertScreen from './components/AlertScreen.jsx';
import Dashboard from './components/Dashboard.jsx';

const demoResult = {
  incidentId: 'INC-2409',
  farm: 'Rampur East Field',
  crop: 'Tomato',
  detection: {
    pest: 'Whitefly',
    confidence: 0.94,
    severity: 'High',
    symptom: 'Leaf curling with sticky honeydew patches'
  },
  safety: {
    recommendation: 'Use neem oil first; isolate affected rows before chemical spray.',
    harvestWindow: 'Safe harvest after 5 days if botanical spray is used'
  },
  sprayZones: [
    { row: 'A1-A4', dose: 'High', coverage: 82 },
    { row: 'B1-B3', dose: 'Medium', coverage: 56 },
    { row: 'C1-C2', dose: 'Low', coverage: 24 }
  ],
  memory: [
    'Similar whitefly cluster reported 11 days ago near the canal.',
    'Neem oil reduced spread by 62% in the last village incident.',
    'Avoid broad spraying near row D because pollinator activity is high.'
  ],
  spread: [
    { radius: '100 m', farms: 4, risk: 'Critical' },
    { radius: '300 m', farms: 13, risk: 'Watch' },
    { radius: '700 m', farms: 31, risk: 'Monitor' }
  ],
  alerts: {
    sent: 18,
    channels: ['SMS', 'WhatsApp', 'Village dashboard']
  }
};

const screens = [
  { key: 'upload', label: 'Upload', Component: UploadScreen },
  { key: 'detection', label: 'Detect', Component: DetectionScreen },
  { key: 'spray', label: 'Spray', Component: SprayMapScreen },
  { key: 'memory', label: 'Memory', Component: MemoryScreen },
  { key: 'spread', label: 'Spread', Component: SpreadMapScreen },
  { key: 'alerts', label: 'Alerts', Component: AlertScreen },
  { key: 'dashboard', label: 'Summary', Component: Dashboard }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const current = screens[index];
  const CurrentScreen = current.Component;

  const progress = useMemo(() => Math.round(((index + 1) / screens.length) * 100), [index]);

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="CropShield progress">
        <div>
          <p className="eyebrow">CropShield</p>
          <h1>Farm incident response</h1>
        </div>
        <div className="step-list">
          {screens.map((screen, stepIndex) => (
            <button
              key={screen.key}
              className={stepIndex === index ? 'active' : ''}
              onClick={() => setIndex(stepIndex)}
              type="button"
            >
              {screen.label}
            </button>
          ))}
        </div>
      </nav>

      <section className="progress-track" aria-label={`Progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </section>

      <CurrentScreen data={demoResult} />

      <footer className="flow-actions">
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
          Back
        </button>
        <button disabled={index === screens.length - 1} onClick={() => setIndex(index + 1)} type="button">
          Next
        </button>
      </footer>
    </main>
  );
}
