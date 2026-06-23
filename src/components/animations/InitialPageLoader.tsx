"use client";

import { useEffect, useState } from "react";
import { SnakeLadderLoader } from "./SnakeLadderLoader";

export function InitialPageLoader() {
  const [phase, setPhase] = useState<"loading" | "finishing" | "hidden">("loading");

  useEffect(() => {
    let timeoutId = 0;

    const finish = () => {
      setPhase("finishing");
      timeoutId = window.setTimeout(() => setPhase("hidden"), 500);
    };

    const tryFinish = () => {
      Promise.all([
        new Promise<void>((resolve) => {
          if (document.readyState === "complete") resolve();
          else window.addEventListener("load", () => resolve(), { once: true });
        }),
        document.fonts.ready,
      ]).then(() => requestAnimationFrame(() => finish()));
    };

    tryFinish();
    return () => { if (timeoutId) window.clearTimeout(timeoutId); };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={[
        "loader-overlay fixed inset-0 z-50 flex items-center justify-center bg-background px-6",
        phase === "finishing" ? "loader-overlay--finishing" : "",
      ].join(" ")}
    >
      <SnakeLadderLoader phase={phase === "finishing" ? "finishing" : "loading"} />
    </div>
  );
}
