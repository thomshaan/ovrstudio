/** Cloudflare R2 media upload helpers for the OVRStudio CMS. */
import { clearCmsToken, getCmsToken } from './cmsSync';
export const MAX_FILE_SIZE_MB = 50;
const UPLOAD_TOKEN_KEY = 'ovr_r2_upload_token';

export interface FileUploadResult {
  url: string;
  key: string;
  name: string;
  size: number;
  type: string;
}

export async function uploadFileToR2(file: File): Promise<FileUploadResult> {
  const endpoint = (import.meta.env.VITE_R2_UPLOAD_ENDPOINT as string | undefined)?.trim();
  if (!endpoint) {
    throw new Error('R2 upload is not configured. Set VITE_R2_UPLOAD_ENDPOINT to your deployed Cloudflare Worker URL and rebuild the site.');
  }

  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File is ${(file.size / (1024 * 1024)).toFixed(1)}MB. The maximum upload size is ${MAX_FILE_SIZE_MB}MB.`);
  }

  // A signed CMS session is accepted by the upload Worker; no second token prompt is needed.
  let token = getCmsToken();
  try { if (!token) token = window.sessionStorage.getItem(UPLOAD_TOKEN_KEY) || ''; } catch { /* private browsing */ }
  if (!token) {
    token = window.prompt('Sign in to the OVRStudio CMS first, or enter the legacy R2 upload token:')?.trim() || '';
    if (!token) throw new Error('Upload cancelled: an upload token is required.');
    try { window.sessionStorage.setItem(UPLOAD_TOKEN_KEY, token); } catch { /* session storage unavailable */ }
  }

  const form = new FormData();
  form.append('file', file, file.name);
  const response = await fetch(`${endpoint.replace(/\/$/, '')}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      try { window.sessionStorage.removeItem(UPLOAD_TOKEN_KEY); } catch { /* ignore */ }
      if (getCmsToken()) clearCmsToken();
    }
    throw new Error(payload.error || `R2 upload failed (${response.status}).`);
  }
  if (!payload.url || typeof payload.url !== 'string') {
    throw new Error('The upload service returned an invalid public URL.');
  }

  return {
    url: payload.url,
    key: payload.key || '',
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
  };
}

export const PRESET_AUDIO_TRACKS = [
  {
    id: 'track-ocean-synth',
    title: 'Ocean Deep Ambient Drone',
    artist: 'OVRStudio Soundscapes',
    url: 'https://actions.google.com/sounds/v1/water/gentle_ocean_waves_with_seagulls.ogg',
  },
  {
    id: 'track-cozy-stream',
    title: 'Peaceful Water Stream & Piano',
    artist: 'OVRStudio Ambient Lab',
    url: 'https://actions.google.com/sounds/v1/water/water_lapping_against_boat.ogg',
  },
];
