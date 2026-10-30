import React, { useRef, useState } from 'react';
import { Upload, X, Film, Image as ImageIcon, Music, Check, AlertCircle } from 'lucide-react';
import { readFileAsDataUrl } from '../utils/mediaUpload';
import { sound } from '../utils/audio';

interface CMSMediaUploaderProps {
  label: string;
  mediaType: 'image' | 'video' | 'audio';
  currentUrl: string;
  onMediaSelect: (url: string) => void;
  presetOptions?: { label: string; url: string }[];
  recommendedNotice?: string;
}

export const CMSMediaUploader: React.FC<CMSMediaUploaderProps> = ({
  label,
  mediaType,
  currentUrl,
  onMediaSelect,
  presetOptions = [],
  recommendedNotice,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState(currentUrl);

  const acceptTypes = {
    image: 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml',
    video: 'video/mp4,video/webm,video/ogg',
    audio: 'audio/mp3,audio/wav,audio/ogg,audio/mpeg',
  }[mediaType];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      sound.playTick();
      const dataUrl = await readFileAsDataUrl(file);
      onMediaSelect(dataUrl);
      setCustomUrlInput(dataUrl);
      sound.playChime(780, 0.15);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reading media file';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    sound.playTick();
    onMediaSelect(customUrlInput);
  };

  const handleClear = () => {
    sound.playTick();
    onMediaSelect('');
    setCustomUrlInput('');
  };

  return (
    <div className="space-y-2 bg-[#091b35] p-3.5 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          {mediaType === 'image' && <ImageIcon className="w-3.5 h-3.5 text-orange-400" />}
          {mediaType === 'video' && <Film className="w-3.5 h-3.5 text-sky-400" />}
          {mediaType === 'audio' && <Music className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{label}</span>
        </label>
        {currentUrl && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {recommendedNotice && (
        <p className="text-[11px] text-slate-400 leading-tight">
          {recommendedNotice}
        </p>
      )}

      {/* Upload Button + File Input */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Reading File...' : `Upload ${mediaType.toUpperCase()} File`}</span>
        </button>

        <span className="text-[11px] text-slate-400">or enter link:</span>

        <div className="flex-1 min-w-[200px] flex items-center gap-1">
          <input
            type="text"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            onBlur={handleApplyUrl}
            placeholder={`https://... or /assets/${mediaType}...`}
            className="w-full px-3 py-1.5 bg-[#061224] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          {customUrlInput !== currentUrl && (
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-medium cursor-pointer"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {/* Preset options */}
      {presetOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Presets:</span>
          {presetOptions.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                sound.playTick();
                onMediaSelect(opt.url);
                setCustomUrlInput(opt.url);
              }}
              className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${
                currentUrl === opt.url
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="p-2 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Preview */}
      {currentUrl && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-semibold flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Active Preview:</span>
          </div>

          {mediaType === 'image' && (
            <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/10">
              <img
                src={currentUrl}
                alt="Upload Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {mediaType === 'video' && (
            <div className="relative w-full aspect-video bg-black/60 rounded-xl overflow-hidden border border-white/10">
              <video
                src={currentUrl}
                controls
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {mediaType === 'audio' && (
            <div className="p-2 bg-black/40 rounded-xl border border-white/10">
              <audio src={currentUrl} controls className="w-full h-8" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
