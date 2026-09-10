/**
 * Thumbnail Service
 * Automatically captures or generates live screenshots for websites, portfolio links, and products.
 */

export const thumbnailService = {
  /**
   * Generates an automatic high-resolution screenshot URL for any given website link.
   * Uses reliable, fast, zero-auth CDN snapshot providers with fallback support.
   *
   * @param {string} url - Website URL to capture
   * @param {number} [width=1200] - Snapshot viewport width
   * @returns {string} Image URL
   */
  getWebsiteScreenshot(url, width = 1200) {
    if (!url || typeof url !== 'string' || !url.trim()) return '';
    const cleanUrl = url.trim();

    // Primary: WordPress mShots CDN (Fast, highly reliable, renders full modern web apps)
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=${width}`;
  },

  /**
   * Fallback screenshot provider (Thum.io CDN)
   */
  getFallbackScreenshot(url, width = 1200) {
    if (!url || typeof url !== 'string' || !url.trim()) return '';
    const cleanUrl = url.trim();
    return `https://image.thum.io/get/width/${width}/crop/800/noanimate/${cleanUrl}`;
  },

  /**
   * Resolves the best preview image for a project or product:
   * 1. Explicitly uploaded/assigned image (if present)
   * 2. Automatic live screenshot from project link/URL
   * 3. null (falls back to UI placeholder)
   *
   * @param {Object} project
   * @returns {string|null}
   */
  getProjectImage(project) {
    if (!project) return null;

    // Check images array
    if (Array.isArray(project.images) && project.images.length > 0 && project.images[0]) {
      return project.images[0];
    }

    // Check direct imageUrl property
    if (project.imageUrl && typeof project.imageUrl === 'string' && project.imageUrl.trim()) {
      return project.imageUrl.trim();
    }

    // Automatically generate from project link if available
    if (project.link && typeof project.link === 'string' && project.link.trim().startsWith('http')) {
      return this.getWebsiteScreenshot(project.link);
    }

    return null;
  }
};
