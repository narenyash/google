import { BellRing, Send } from 'lucide-react';

export default function AlertScreen({ data }) {
  return (
    <section className="screen two-column">
      <div>
        <p className="eyebrow">Screen 6</p>
        <h2>Alerts sent</h2>
        <p className="lede">{data.alerts.sent} nearby farmers and coordinators were notified.</p>
        <div className="channel-list">
          {data.alerts.channels.map((channel) => (
            <span key={channel}>{channel}</span>
          ))}
        </div>
      </div>
      <div className="alert-pulse">
        <BellRing size={58} />
        <Send size={28} />
      </div>
    </section>
  );
}
