const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const MAX_IDS_PER_REQUEST = 50;

class YouTubeApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function extractYoutubeVideoId(link) {
  if (!link) return null;

  let url;
  try {
    url = new URL(link);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  let videoId = null;

  if (hostname === 'youtu.be') {
    videoId = url.pathname.split('/').filter(Boolean)[0];
  } else if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(hostname)) {
    const segments = url.pathname.split('/').filter(Boolean);
    if (url.pathname === '/watch') videoId = url.searchParams.get('v');
    else if (['embed', 'shorts', 'live'].includes(segments[0])) videoId = segments[1];
  }

  return videoId && VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
}

function formatDuration(value) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value);
  if (!match) return null;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

async function getYoutubeVideoMetadata(links) {
  const videoIds = [...new Set(links.map(extractYoutubeVideoId).filter(Boolean))];
  if (videoIds.length === 0) return new Map();

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new YouTubeApiError('A integração com o YouTube não está configurada.', 503);
  }

  const metadata = new Map();

  for (let index = 0; index < videoIds.length; index += MAX_IDS_PER_REQUEST) {
    const ids = videoIds.slice(index, index + MAX_IDS_PER_REQUEST);
    const url = new URL(YOUTUBE_API_URL);
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('id', ids.join(','));
    url.searchParams.set('key', apiKey);

    let response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    } catch {
      throw new YouTubeApiError('Não foi possível consultar os vídeos no YouTube.', 502);
    }

    if (!response.ok) {
      throw new YouTubeApiError('O YouTube não conseguiu retornar os dados dos vídeos.', 502);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new YouTubeApiError('O YouTube retornou uma resposta inválida.', 502);
    }

    if (!Array.isArray(data.items)) {
      throw new YouTubeApiError('O YouTube retornou uma resposta inválida.', 502);
    }

    for (const item of data.items) {
      const duration = formatDuration(item.contentDetails?.duration);
      if (!item.id || !item.snippet?.title || !duration) continue;

      const thumbnails = item.snippet.thumbnails || {};
      metadata.set(item.id, {
        title: item.snippet.title,
        thumbnailUrl:
          thumbnails.maxres?.url ||
          thumbnails.high?.url ||
          thumbnails.medium?.url ||
          thumbnails.default?.url ||
          null,
        duration,
      });
    }
  }

  return metadata;
}

module.exports = { extractYoutubeVideoId, getYoutubeVideoMetadata };
