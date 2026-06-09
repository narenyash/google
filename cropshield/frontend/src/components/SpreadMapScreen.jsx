import { Radar } from 'lucide-react';

export default function SpreadMapScreen({ data }) {
  return (
    <section className="screen two-column">
      <div>
        <p className="eyebrow">Screen 5</p>
        <h2>Disease spread circles</h2>
        <div className="spread-map">
          <span className="circle outer" />
          <span className="circle middle" />
          <span className="circle inner" />
          <Radar className="radar-icon" />
        </div>
      </div>
      <div className="risk-list">
        {data.spread.map((zone) => (
          <article key={zone.radius}>
            <strong>{zone.radius}</strong>
            <span>{zone.farms} farms</span>
            <em>{zone.risk}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
