"use client";

import { useEffect, useState, useRef } from "react";

export function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const prefix = value.replace(/[0-9.,]/g, "");
  const isNumeric = !Number.isNaN(numeric) && /\d/.test(value);

  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const startRef = useRef(0);

  useEffect(() => {
    if (!isNumeric) return;
    let raf: number;
    const duration = 1200;
    const startTime = performance.now();
    startRef.current = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(numeric * ease);
      if (current !== startRef.current) {
        startRef.current = current;
        setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);
      }
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isNumeric, numeric, prefix, suffix]);

  if (!isNumeric) return <span>{`${value}${suffix}`}</span>;

  return <span aria-label={`${value}${suffix}`}>{display}</span>;
}
