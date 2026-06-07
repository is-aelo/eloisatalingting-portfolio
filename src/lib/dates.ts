const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y) return "";
  const month = m ? MONTHS_FULL[parseInt(m) - 1] : "";
  const day = d ? parseInt(d).toString() : "";
  if (month && day) return `${month} ${day}, ${y}`;
  if (month) return `${month} ${y}`;
  return y;
}

export function formatDateRange(start: string, end: string): string {
  const [sy, sm, sd] = start.split("-");
  const [ey, em, ed] = end.split("-");
  const sMonth = sm ? MONTHS_FULL[parseInt(sm) - 1] : "";
  const eMonth = em ? MONTHS_FULL[parseInt(em) - 1] : "";
  const sDay = sd ? parseInt(sd).toString() : "";
  const eDay = ed ? parseInt(ed).toString() : "";

  if (sy === ey) {
    const startPart = [sMonth, sDay].filter(Boolean).join(" ");
    const endPart = [eMonth, eDay, ey].filter(Boolean).join(" ");
    return `${startPart} — ${endPart}`;
  }

  const startPart = [sMonth, sDay, sy].filter(Boolean).join(" ");
  const endPart = [eMonth, eDay, ey].filter(Boolean).join(" ");
  return `${startPart} — ${endPart}`;
}
