import thawannyImg from '../assets/thawanny.png';
import fabianaImg from '../assets/fabiana.png';
import phoenixImg from '../assets/phoenix.png';

const ASSET_MAP = {
  '/thawanny.png': thawannyImg,
  'thawanny.png': thawannyImg,
  '/fabiana.png': fabianaImg,
  'fabiana.png': fabianaImg,
  '/phoenix.png': phoenixImg,
  'phoenix.png': phoenixImg,
  '/favicon.png': phoenixImg,
  'favicon.png': phoenixImg
};

/**
 * Resolves static asset paths correctly for local dev and subpath production (e.g. GitHub Pages)
 * @param {string} url
 * @returns {string}
 */
export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  const cleanUrl = url.trim();
  
  if (ASSET_MAP[cleanUrl]) {
    return ASSET_MAP[cleanUrl];
  }

  // Check without leading slash
  if (cleanUrl.startsWith('/') && ASSET_MAP[cleanUrl.slice(1)]) {
    return ASSET_MAP[cleanUrl.slice(1)];
  }

  // External or base64 data URLs
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // Handle root relative path with Vite BASE_URL
  if (cleanUrl.startsWith('/')) {
    const base = import.meta.env.BASE_URL || './';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return `${normalizedBase}${cleanUrl.slice(1)}`;
  }

  return cleanUrl;
}

export { thawannyImg, fabianaImg, phoenixImg };
