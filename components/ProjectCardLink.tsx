"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

type ProjectCardLinkProps = {
  href: string;
  title: string;
  imageUrl?: string;
  index: number;
  className?: string;
};

export function ProjectCardLink({ href, title, imageUrl, index, className }: ProjectCardLinkProps) {
  const isExternal = href.startsWith("http");
  const rootRef = React.useRef<HTMLAnchorElement | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const onMouseMove: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    const element = rootRef.current;
    if (!element) return;

    // Keep it subtle and desktop-ish.
    if (window.matchMedia("(min-width: 768px)").matches === false) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 10; // left/right
    const rotateX = (0.5 - y) * 8; // up/down

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      element.style.setProperty("--tilt-rx", `${rotateX.toFixed(3)}deg`);
      element.style.setProperty("--tilt-ry", `${rotateY.toFixed(3)}deg`);
    });
  };

  const onMouseLeave: React.MouseEventHandler<HTMLAnchorElement> = () => {
    const element = rootRef.current;
    if (!element) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      element.style.setProperty("--tilt-rx", "0deg");
      element.style.setProperty("--tilt-ry", "0deg");
    });
  };

  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const cardClassName =
    "group overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-950/80 shadow-[0_0_24px_rgba(14,165,233,0.12)] md:flex-none md:w-[520px]";

  const cardStyle: React.CSSProperties = {
    transform: "perspective(900px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))",
    transformStyle: "preserve-3d",
    transition: "transform 250ms ease",
    willChange: "transform",
  };

  const content = (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 768px) 520px, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${
            index === 0
              ? "from-blue-900 via-slate-900 to-cyan-900"
              : index === 1
                ? "from-slate-900 via-blue-950 to-orange-900"
                : "from-slate-950 via-blue-900 to-cyan-950"
          }`}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 border-t border-cyan-400/20 bg-slate-950/75 px-4 py-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        ref={rootRef}
        href={href}
        className={[cardClassName, className].filter(Boolean).join(" ")}
        style={cardStyle}
        rel="noreferrer"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {content}
      </a>
    );
  }

  // Link forwards the underlying anchor props.
  return (
    <Link
      ref={rootRef}
      href={href}
      className={[cardClassName, className].filter(Boolean).join(" ")}
      style={cardStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </Link>
  );
}
