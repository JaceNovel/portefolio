"use client";

import * as React from "react";

type AutoScrollRowProps = {
  children: React.ReactNode;
  className?: string;
  speedPxPerSecond?: number;
};

export function AutoScrollRow({ children, className, speedPxPerSecond = 35 }: AutoScrollRowProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const pausedRef = React.useRef(false);
  const rafRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number | null>(null);
  const positionRef = React.useRef<number>(0);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    positionRef.current = element.scrollLeft;

    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const tick = (time: number) => {
      const currentElement = containerRef.current;
      if (!currentElement) return;

      const isDesktop = mediaQuery.matches;
      if (!pausedRef.current && isDesktop) {
        const lastTime = lastTimeRef.current ?? time;
        const deltaMs = time - lastTime;
        lastTimeRef.current = time;

        const deltaPx = (deltaMs / 1000) * speedPxPerSecond;
        positionRef.current += deltaPx;
        currentElement.scrollLeft = positionRef.current;

        const maxScrollLeft = currentElement.scrollWidth - currentElement.clientWidth;
        if (maxScrollLeft > 0 && currentElement.scrollLeft >= maxScrollLeft - 1) {
          positionRef.current = 0;
          currentElement.scrollLeft = 0;
        }
      } else {
        lastTimeRef.current = time;
        positionRef.current = currentElement.scrollLeft;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [speedPxPerSecond]);

  return (
    <div
      ref={containerRef}
      className={className}
      onScroll={() => {
        if (!containerRef.current) return;
        positionRef.current = containerRef.current.scrollLeft;
      }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {children}
    </div>
  );
}
