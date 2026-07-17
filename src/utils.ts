export function resolveCakeImage(url: string | undefined | null): string {
  const imageUrl = url?.trim();
  if (!imageUrl || imageUrl.includes('unsplash.com')) return '/gallery/1/img1.jpg';
  return imageUrl;
}
