const INSTAGRAM_MEDIA_FIELDS = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp',
  'children{media_type,media_url,thumbnail_url,permalink,timestamp}'
].join(',');

function getImageUrl(media) {
  if (!media) return '';
  if (media.media_type === 'VIDEO') return media.thumbnail_url || '';
  return media.media_url || media.thumbnail_url || '';
}

function getImageSet(media) {
  const children = Array.isArray(media?.children?.data) ? media.children.data : [];
  const childImages = children
    .map(getImageUrl)
    .filter(Boolean);

  const primaryImage = getImageUrl(media);
  const images = childImages.length > 0 ? childImages : [primaryImage].filter(Boolean);

  return Array.from(new Set(images));
}

function formatDate(timestamp) {
  if (!timestamp) return 'Instagram';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(timestamp));
}

function normalizeMedia(media) {
  const images = getImageSet(media);
  if (images.length === 0) return null;

  return {
    id: media.id,
    imageUrl: images[0],
    images,
    caption: media.caption || 'Cakeasy creation from Instagram.',
    likes: 0,
    commentsCount: 0,
    date: formatDate(media.timestamp),
    permalink: media.permalink || '',
    comments: []
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(503).json({
      posts: [],
      error: 'Instagram sync is not configured'
    });
  }

  const limit = Math.min(Math.max(Number(process.env.INSTAGRAM_MEDIA_LIMIT) || 50, 1), 100);
  const url = new URL('https://graph.instagram.com/me/media');
  url.searchParams.set('fields', INSTAGRAM_MEDIA_FIELDS);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('access_token', accessToken);

  try {
    const instagramResponse = await fetch(url);
    const instagramPayload = await instagramResponse.json();

    if (!instagramResponse.ok) {
      return res.status(instagramResponse.status).json({
        posts: [],
        error: 'Instagram API request failed'
      });
    }

    const posts = (instagramPayload.data || [])
      .map(normalizeMedia)
      .filter(Boolean);

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({ posts, source: 'instagram' });
  } catch (error) {
    return res.status(502).json({
      posts: [],
      error: 'Instagram sync temporarily unavailable'
    });
  }
}
