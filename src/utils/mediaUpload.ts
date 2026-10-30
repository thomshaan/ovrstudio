/**
 * Media Upload and Processing Utilities for OVRStudio CMS
 * Supports local file upload (images, videos, audio) converted to Data URLs / Object URLs
 * for instant preview and local persistence.
 */

export const MAX_FILE_SIZE_MB = 12;

export interface FileUploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. For smooth performance, files under ${MAX_FILE_SIZE_MB}MB are recommended.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
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
