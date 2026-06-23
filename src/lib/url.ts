export function normalizeUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:")) return url;
  return `https://${url}`;
}
