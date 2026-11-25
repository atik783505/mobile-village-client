"use client";

import { useEffect, useState } from "react";

function Pad({ n }: { n: number }) {
  return (
    <span className="min-w-[2.2rem] rounded-lg bg-slate-900 px-2 py-1 text-center text-xl font-extrabold tabular-nums text-white">
      {String(n).padStart(2, "0")}
    </span>
  );
}

export default function FlashSaleTimer({ hours }: { hours: number }) {
  const [timeLeft, setTimeLeft] = useState({ h: hours, m: 0, s: 0 });

  useEffect(() => {
    const end = Date.now() + hours * 60 * 60 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hours]);

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <span>Ends in</span>
      <div className="flex items-center gap-1">
        <Pad n={timeLeft.h} />
        <span className="font-bold text-slate-500">:</span>
        <Pad n={timeLeft.m} />
        <span className="font-bold text-slate-500">:</span>
        <Pad n={timeLeft.s} />
      </div>
    </div>
  );
}
