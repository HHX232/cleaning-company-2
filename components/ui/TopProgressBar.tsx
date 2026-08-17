"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Lightweight top progress bar (no dependency). Starts when an internal
// navigation begins — an in-app link click or a router.push (history is
// patched) — and completes when the pathname/search params actually change.
export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const clearTick = () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };

    const start = () => {
      if (activeRef.current) return;
      activeRef.current = true;
      if (doneRef.current) clearTimeout(doneRef.current);
      setVisible(true);
      setProgress(8);
      clearTick();
      // Creep toward 90% while the next route loads; the route-change effect
      // below finishes it to 100%.
      tickRef.current = setInterval(() => {
        setProgress((p) => (p < 90 ? p + (90 - p) * 0.15 : p));
      }, 200);
    };

    // Same-document (hash-only) or unchanged URLs shouldn't trigger the bar.
    const isRealNavigation = (href: string) => {
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return false;
        return url.pathname !== window.location.pathname || url.search !== window.location.search;
      } catch {
        return false;
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (isRealNavigation(anchor.href)) start();
    };

    // Catch programmatic navigation (router.push goes through history) —
    // but next/link's client router calls pushState even for a same-page
    // hash change, so this needs the same real-navigation check as clicks.
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      const url = args[2];
      if (url && isRealNavigation(String(url))) start();
      return origPush.apply(this, args);
    };
    history.replaceState = function (...args) {
      return origReplace.apply(this, args);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", start);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", start);
      history.pushState = origPush;
      history.replaceState = origReplace;
      clearTick();
    };
  }, []);

  // Route committed → finish the bar.
  useEffect(() => {
    if (!activeRef.current) return;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    activeRef.current = false;
    setProgress(100);
    doneRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_var(--color-primary,#16a34a)]"
        style={{ width: `${progress}%`, transition: "width 200ms ease" }}
      />
    </div>
  );
}
