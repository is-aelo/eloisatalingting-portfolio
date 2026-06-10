import type { ReactNode } from "react";

export function renderTextWithAmpersand(text: string): ReactNode[] {
  const parts = text.split("&");
  if (parts.length === 1) return [text];

  return parts.flatMap((part, i) => {
    if (i === 0) return [part];
    return [
      <span key={`amp-${i}`} className="font-body">&</span>,
      part,
    ];
  });
}
