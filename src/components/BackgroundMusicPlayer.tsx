import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Disc3 } from 'lucide-react';
import { BackgroundAudioConfig } from '../types';
import { sound } from '../utils/audio';

interface BackgroundMusicPlayerProps {
  config: BackgroundAudioConfig;
  onToggleEnabled: () => void;
  onUpdateVolume: (volume: number) => void;
}

export const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  config,
  onToggleEnabled,
  onUpdateVolume,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    if (config.audioUrl && audio.src !== config.audioUrl) {
      audio.src = config.audioUrl;
      if (config.enabled) {
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }

    audio.volume = Math.max(0, Math.min(1, config.volume));

    if (config.enabled && audio.paused && config.audioUrl) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else if (!config.enabled && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [config.audioUrl, config.enabled, config.volume]);

  const togglePlayback = () => {
    sound.playTick();
    onToggleEnabled();
  };

  if (!config.audioUrl) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="bg-[#0b1d3a]/90 backdrop-blur-md border border-white/20 text-white rounded-full shadow-2xl p-1.5 flex items-center gap-2 transition-all duration-300">
        
        {/* Disc Spin / Play Button */}
        <button
          onClick={togglePlayback}
          className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md"
          title={config.enabled ? 'Pause background song' : 'Play background song'}
          aria-label={config.enabled ? 'Pause background song' : 'Play background song'}
        >
          {config.enabled ? (
            <Disc3 className="w-5 h-5 animate-spin duration-3000 text-white" />
          ) : (
            <Play className="w-4 h-4 ml-0.5 fill-current text-white" />
          )}
        </button>

        {/* Track Info (collapsible) */}
        <div className="flex items-center gap-2 pr-3">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer select-none max-w-[120px] sm:max-w-[180px] overflow-hidden"
          >
            <div className="text-[11px] font-bold text-white truncate leading-tight flex items-center gap-1">
              <Music className="w-3 h-3 text-orange-400 shrink-0" />
              <span>{config.title || 'Studio Ambient'}</span>
            </div>
            <div className="text-[9px] text-slate-300 truncate">
              {config.enabled ? 'Playing' : 'Paused'} · {config.artist || 'OVRStudio'}
            </div>
          </div>

          {/* Volume slider control */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-white/20 pl-2">
            <button
              onClick={() => {
                sound.playTick();
                onUpdateVolume(config.volume === 0 ? 0.5 : 0);
              }}
              className="text-slate-300 hover:text-white"
              title="Mute / Unmute music"
            >
              {config.volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-orange-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.volume}
              onChange={(e) => onUpdateVolume(parseFloat(e.target.value))}
              className="w-14 h-1 accent-orange-500 cursor-pointer bg-white/30 rounded-lg"
              title={`Volume: ${Math.round(config.volume * 100)}%`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
