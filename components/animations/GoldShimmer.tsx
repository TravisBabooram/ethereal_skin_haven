"use client";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Wraps text in an animated gold gradient that sweeps left-to-right on a loop.
 * Uses the .gold-shimmer-text CSS class defined in globals.css.
 */
export default function GoldShimmer({ children, style, className }: Props) {
  return (
    <span
      className={`gold-shimmer-text${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </span>
  );
}
