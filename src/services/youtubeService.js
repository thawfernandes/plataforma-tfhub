import { mockDb } from './mockDb';

const CACHE_KEY = 'tf_youtube_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Cache helpers ──────────────────────────────────────────────────────────

function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { videos, fetchedAt } = JSON.parse(raw);
    const isExpired = Date.now() - fetchedAt > CACHE_DURATION_MS;
    if (isExpired) return null;
    return videos;
  } catch {
    return null;
  }
}

function setCache(videos) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ videos, fetchedAt: Date.now() }));
  } catch {
    // localStorage might be full — fail silently
  }
}

// ─── Main Service ────────────────────────────────────────────────────────────

export const youtubeService = {
  /**
   * Returns the latest videos from the TF Hub YouTube channel.
   *
   * Strategy:
   * 1. If a valid cached result exists (< 24h old), return it immediately.
   * 2. Otherwise, try the real YouTube Data API v3 (only if an API key is set).
   * 3. On error, or if no key is configured, fall back to the locally-simulated
   *    videos stored in localStorage (tf_youtube_videos).
   */
  async getLatestVideos() {
    // 1. Return cached data if still fresh
    const cached = getCache();
    if (cached) return cached;

    // 2. Try real YouTube Data API v3
    const settings = mockDb.get('settings') || {};
    const apiKey   = settings.youtubeApiKey?.trim();
    const channelId = settings.youtubeChannelId?.trim() || 'UC46pM5Nvd0qC8281V2yV21A';

    if (apiKey) {
      try {
        const url =
          `https://www.googleapis.com/youtube/v3/search` +
          `?key=${apiKey}` +
          `&channelId=${channelId}` +
          `&part=snippet,id` +
          `&order=date` +
          `&maxResults=6` +
          `&type=video`;

        const res = await fetch(url);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn('[TF Hub YouTube] API error:', res.status, err?.error?.message);
          // Fall through to local fallback
        } else {
          const data = await res.json();
          const videos = (data.items || []).map(item => ({
            id: `yt_${item.id.videoId}`,
            type: 'video',
            title: item.snippet.title,
            body: item.snippet.description || '',
            images: [
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url
            ],
            metadata: {
              videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
              duration: 'Vídeo YouTube'
            },
            publishedAt: item.snippet.publishedAt
          }));

          setCache(videos);
          return videos;
        }
      } catch (err) {
        console.warn('[TF Hub YouTube] Failed to fetch videos:', err.message);
        // Fall through to local fallback
      }
    }

    // 3. Local fallback — simulated channel uploads
    return this._getLocalVideos();
  },

  /**
   * Returns the locally simulated video list (used when no API key is
   * configured, or when the API call fails).
   * Starts with an empty list — only populated when the admin runs
   * simulateNewUpload() to test the sync flow.
   */
  _getLocalVideos() {
    try {
      const raw = localStorage.getItem('tf_youtube_videos');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Simulates a new video being published on the channel.
   * Inserts a video at the top of the local list, busts the cache, and
   * dispatches the `tf_youtube_synced` event so all listening components
   * refresh automatically without a page reload.
   */
  simulateNewUpload(title, desc, videoUrl, imageUrl) {
    const list = this._getLocalVideos();
    const newVideo = {
      id: `yt_vid_${Date.now()}`,
      type: 'video',
      title: title || 'Novo vídeo publicado no canal TF Hub',
      body:  desc  || 'Confira o novo conteúdo publicado no canal oficial da TF Hub no YouTube.',
      images: [imageUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop'],
      metadata: {
        videoUrl: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 'YouTube'
      },
      publishedAt: new Date().toISOString()
    };

    list.unshift(newVideo);
    localStorage.setItem('tf_youtube_videos', JSON.stringify(list));

    // Bust the 24-hour cache so the next getLatestVideos() call re-fetches
    localStorage.removeItem(CACHE_KEY);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tf_youtube_synced', { detail: newVideo }));
    }

    return newVideo;
  },

  /**
   * Manually invalidate the cache (e.g. after changing API key in settings).
   */
  clearCache() {
    localStorage.removeItem(CACHE_KEY);
  }
};
