import { History } from 'lucide-react';

export default function MemoryScreen({ data }) {
  return (
    <section className="screen">
      <p className="eyebrow">Screen 4</p>
      <h2>Village memory</h2>
      <div className="timeline">
        {data.memory.map((item) => (
          <article key={item}>
            <History />
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
