import { useEffect, useState } from "react";
import Card from "@/components/common/Card";

const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const from = display;
    const to = Number(value || 0);
    if (from === to) return;

    let frame;
    const start = performance.now();
    const duration = 360;

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.round(from + (to - from) * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display}</span>;
};

const StatsCards = ({ devices, activityFeed }) => {
  const onlineCount = devices.filter((item) => item.isOnline).length;
  const updatesLastMinute = activityFeed.filter(
    (item) => Date.now() - new Date(item.timestamp).getTime() < 60 * 1000,
  ).length;

  const cards = [
    { title: "Total Devices", value: devices.length },
    { title: "Online Devices", value: onlineCount },
    { title: "Updates / Min", value: updatesLastMinute },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={card.title} className="p-4" delay={0.04 * index}>
          <p className="text-xs font-medium uppercase tracking-wide text-base-500">{card.title}</p>
          <p className="mt-2 text-2xl font-semibold text-base-800">
            <AnimatedCounter value={card.value} />
          </p>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;

