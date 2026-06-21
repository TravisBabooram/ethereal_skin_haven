"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = "Before", afterLabel = "After", alt = "Before & After", style }: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); dragging.current = true; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp = () => { dragging.current = false; };
  const onTouchStart = (e: React.TouchEvent) => { e.preventDefault(); dragging.current = true; updatePos(e.touches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX); };
  const onTouchEnd = () => { dragging.current = false; };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        cursor: "col-resize",
        userSelect: "none",
        touchAction: "none",
        ...style,
      }}
    >
      {/* After image — base layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={`${alt} — after`}
        draggable={false}
        style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Before image — clipped to slider position */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: `${position}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={`${alt} — before`}
          draggable={false}
          style={{ display: "block", width: width || "100%", maxWidth: "none", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Divider */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          transform: "translateX(-50%)",
          width: 2,
          background: "linear-gradient(180deg, transparent 0%, var(--gold) 15%, var(--gold) 85%, transparent 100%)",
          zIndex: 10,
          cursor: "col-resize",
        }}
      >
        {/* Handle circle */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
          border: "2px solid rgba(255,255,255,0.25)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,44,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}>
          {/* Arrow indicators */}
          <span style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "6px solid rgba(8,8,8,0.7)", display: "block" }} />
          <span style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "6px solid rgba(8,8,8,0.7)", display: "block" }} />
        </div>
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", bottom: 14, left: 14, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.95)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", padding: "5px 10px", borderRadius: 2, pointerEvents: "none" }}>
        {beforeLabel}
      </div>
      <div style={{ position: "absolute", bottom: 14, right: 14, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.95)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", padding: "5px 10px", borderRadius: 2, pointerEvents: "none" }}>
        {afterLabel}
      </div>
    </div>
  );
}
