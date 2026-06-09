import { CheckCircle2, MapPinned, Sprout } from 'lucide-react';

export default function Dashboard({ data }) {
  return (
    <section className="screen">
      <p className="eyebrow">Final summary</p>
      <h2>{data.farm}</h2>
      <div className="dashboard-grid">
        <Summary icon={<Sprout />} label="Crop" value={data.crop} />
        <Summary icon={<CheckCircle2 />} label="Incident" value={data.incidentId} />
        <Summary icon={<MapPinned />} label="Primary risk" value={data.detection.pest} />
      </div>
      <div className="analysis-card wide">
        <h3>Action plan</h3>
        <p>{data.safety.recommendation}</p>
        <p>Focus treatment on rows {data.sprayZones[0].row}, then monitor spread within {data.spread[1].radius}.</p>
      </div>
    </section>
  );
}

function Summary({ icon, label, value }) {
  return (
    <article className="summary-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
