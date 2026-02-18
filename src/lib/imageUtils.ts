/**
 * Optimize unsplash image URLs for better performance.
 * Converts to WebP format and reduces dimensions.
 */
export function optimizeImageUrl(
  url: string | undefined | null,
  width = 400,
  height = 300,
  quality = 75
): string {
  if (!url) return "";
  if (!url.includes("unsplash.com")) return url;

  let optimized = url
    .replace(/w=\d+/, `w=${width}`)
    .replace(/h=\d+/, `h=${height}`);

  // Add WebP format if not already present
  if (!optimized.includes("fm=")) {
    optimized += `&fm=webp`;
  }
  // Add quality if not already present
  if (!optimized.includes("q=")) {
    optimized += `&q=${quality}`;
  }

  return optimized;
}
