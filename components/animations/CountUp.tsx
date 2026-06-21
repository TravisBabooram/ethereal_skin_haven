"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function CountUp({ to, duration = 1.8, prefix = "", suffix = "", decimals = 0, style, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-30px" });
  const [value, setValue] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current || to === 0) return;
    animated.current = true;

    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * to).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration, decimals]);

  return (
    <span ref={ref} style={style} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
