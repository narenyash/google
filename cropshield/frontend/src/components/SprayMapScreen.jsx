import { Droplets } from 'lucide-react';

export default function SprayMapScreen({ data }) {
  return (
    <section className="screen">
      <p className="eyebrow">Screen 3</p>
      <h2>Precision spray map</h2>
      <div className="spray-grid">
        {data.sprayZones.map((zone) => (
          <article className={`spray-zone ${zone.dose.toLowerCase()}`} key={zone.row}>
            <Droplets />
            <span>{zone.row}</span>
            <strong>{zone.dose}</strong>
            <small>{zone.coverage}% coverage</small>
          </article>
        ))}
      </div>
    </section>
  );
}
