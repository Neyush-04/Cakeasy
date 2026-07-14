export function resolveCakeImage(url: string | undefined | null): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'; // Default celebration cake
  }
  
  const trimmedUrl = url.trim();

  // If it's already a full HTTP/HTTPS URL, return it
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Map known local assets to high quality Unsplash equivalents
  if (trimmedUrl.includes('cakeasy_bento_cake')) {
    return 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800'; // Cute pastel bento cake
  }
  if (trimmedUrl.includes('cakeasy_hero_banner') || trimmedUrl.includes('pastel_rose')) {
    return 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800'; // Exquisite wedding cake
  }
  if (trimmedUrl.includes('cakeasy_drip_cake') || trimmedUrl.includes('macaron')) {
    return 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800'; // Elegant white chocolate drip
  }

  // Fallback for any other local /src/assets paths or relative URLs
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('.')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'; // Fallback celebration
  }

  return trimmedUrl;
}
