/**
 * Universal Image & Asset Path Normalizer
 *
 * In production builds (GitHub Pages, Cloudflare Pages/Workers, etc.), files in 'public/assets/images/...'
 * are deployed at 'assets/images/...' relative to the base URL.
 * Requests to '/src/assets/...' fail in production because the src folder is compiled away by Vite.
 *
 * This helper resolves both transparently, repairs legacy saved paths in localStorage, and handles:
 * - Data URLs (data:image/...)
 * - Blob URLs (blob:...)
 * - External URLs (https://...)
 * - Local /src/assets and /assets paths
 */

const LEGACY_PATH_MAP: Record<string, string> = {
  'ovr_story_studio_life_1793175840681.jpg': 'ovr_story_studio_life_1793177350433.jpg',
  'ovr_vr_spatial_1793175840681.jpg': 'ovr_vr_experience_1793175841126.jpg',
  'ovr_design_graphic_1793175840681.jpg': 'ovr_design_branding_1793175840098.jpg',
  'ovr_team_ocean_reel_1793175840681.jpg': 'ovr_game_unity_1793175840681.jpg',
};

export const DEFAULT_FALLBACK_IMAGE = 'assets/images/ovr_art_2d_1793175838956.jpg';
const R2_PUBLIC_HOST = 'pub-fffb5bb212294005837d690a745535a1.r2.dev';
const R2_MEDIA_WORKER = ((import.meta.env.VITE_R2_UPLOAD_ENDPOINT as string | undefined)?.trim().replace(/\\/$/, '') || 'https://ovrstudio-media-upload.thomassiahaan31.workers.dev');

export function resolveAssetUrl(path: string | undefined | null): string {
  if (!path || typeof path !== 'string') {
    return resolveAssetUrl(DEFAULT_FALLBACK_IMAGE);
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return resolveAssetUrl(DEFAULT_FALLBACK_IMAGE);
  }

  // Convert legacy public R2 URLs to the media Worker. This keeps old CMS records
  // working while giving images, videos, audio, and 3D fetches consistent CORS/MIME delivery.
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    try {
      const url = new URL(trimmed);
      if (url.hostname === R2_PUBLIC_HOST) {
        const key = url.pathname.replace(/^\\/+/, '').split('/').map(encodeURIComponent).join('/');
        return `${R2_MEDIA_WORKER}/media/${key}${url.search}`;
      }
    } catch {
      // Preserve malformed external URLs so the browser can report the actual loading error.
    }
    return trimmed;
  }

  // Data URLs and Blob URLs are local browser resources and pass through unchanged.
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;

  // Strip leading slashes and relative markers
  let clean = trimmed.replace(/^(\.\/|\/)+/, '');

  // Strip 'src/' prefix if present
  if (clean.startsWith('src/')) {
    clean = clean.replace(/^src\//, '');
  }

  // Ensure it points to assets/images if it was just assets/
  if (clean.startsWith('images/')) {
    clean = `assets/${clean}`;
  }

  // Check and remap any legacy file names
  for (const [legacyName, newName] of Object.entries(LEGACY_PATH_MAP)) {
    if (clean.endsWith(legacyName)) {
      clean = clean.replace(legacyName, newName);
      break;
    }
  }

  // Vite base path handling (e.g. './' or '/subpath/')
  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;

  // Avoid duplicating prefix if clean already starts with it
  if (prefix !== './' && prefix !== '/' && clean.startsWith(prefix)) {
    return clean;
  }

  return `${prefix}${clean}`;
}
