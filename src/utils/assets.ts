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

export function resolveAssetUrl(path: string | undefined | null): string {
  if (!path || typeof path !== 'string') {
    return resolveAssetUrl(DEFAULT_FALLBACK_IMAGE);
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return resolveAssetUrl(DEFAULT_FALLBACK_IMAGE);
  }

  // Data URLs, Blob URLs and full HTTP(S) links pass through untouched
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

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
