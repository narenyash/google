import { Bug, ShieldCheck } from 'lucide-react';

export default function DetectionScreen({ data }) {
  return (
    <section className="screen two-column">
      <div>
        <p className="eyebrow">Screen 2</p>
        <h2>Pest identified</h2>
        <p className="lede">{data.detection.symptom}</p>
        <div className="metric-row">
          <Metric label="Pest" value={data.detection.pest} icon={<Bug />} />
          <Metric label="Confidence" value={`${Math.round(data.detection.confidence * 100)}%`} icon={<ShieldCheck />} />
          <Metric label="Severity" value={data.detection.severity} icon={<Bug />} />
        </div>
      </div>
      <div className="analysis-card">
        <h3>Food safety guidance</h3>
        <p>{data.safety.recommendation}</p>
        <strong>{data.safety.harvestWindow}</strong>
      </div>
    </section>
  );
}

function Metric({ label, value, icon }) {
  return (
    <article className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
