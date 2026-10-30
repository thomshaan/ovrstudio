import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProjectMediaPreviewProps {
  image: string;
  title: string;
  videoPreviewUrl?: string;
  videoDuration?: string;
  isLarge?: boolean;
  onExpand?: () => void;
  // Shared single-video autoplay coordination
  isActiveVideo?: boolean;
  onPlayRequested?: () => void;
  onVideoEnded?: () => void;
}

export const ProjectMediaPreview: React.FC<ProjectMediaPreviewProps> = ({
  image,
  title,
  videoPreviewUrl,
  videoDuration = '0:30',
  isLarge = false,
  onExpand,
  isActiveVideo = false,
  onPlayRequested,
  onVideoEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Sync with active video coordination (only 1 plays at a time)
  useEffect(() => {
    if (isActiveVideo) {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    } else {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isActiveVideo]);

  const totalSeconds = (() => {
    const parts = videoDuration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 30;
  })();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;
    img.onload = () => {
      imgRef.current = img;
    };
  }, [image]);

  // Procedural animated preview fallback if no real videoPreviewUrl provided
  useEffect(() => {
    if (videoPreviewUrl || !isPlaying) {
      cancelAnimationFrame(animFrameRef.current);
      return;
    }

    startTimeRef.current = performance.now() - (progress * totalSeconds * 1000);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrame = 0;

    const renderCanvasAnimation = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      const currentProg = (elapsed % totalSeconds) / totalSeconds;
      setProgress(currentProg);

      // Trigger transition to next card when clip completes cycle
      if (elapsed >= totalSeconds && onVideoEnded) {
        onVideoEnded();
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (imgRef.current) {
        const zoom = 1.05 + Math.sin(elapsed * 0.4) * 0.03;
        const panX = Math.sin(elapsed * 0.3) * 12;
        const panY = Math.cos(elapsed * 0.25) * 6;

        ctx.save();
        ctx.translate(w / 2 + panX, h / 2 + panY);
        ctx.scale(zoom, zoom);
        ctx.drawImage(imgRef.current, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      // Fluid liquid caustics
      const t = elapsed * 1.5;
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = '#60a5fa';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const yBase = (h / 4) * i;
        ctx.moveTo(0, yBase + Math.sin(t + i) * 18);
        for (let x = 0; x <= w; x += 40) {
          const y = yBase + Math.sin(x * 0.015 + t + i * 1.2) * 16 + Math.cos(x * 0.02 - t) * 10;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Floating bubbles
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#bae6fd';
      for (let b = 0; b < 12; b++) {
        const bx = (w * 0.1 + (b * 67 + elapsed * 15) % (w * 0.8));
        const by = (h - ((elapsed * 45 + b * 50) % (h * 1.1)));
        const radius = 2 + (b % 4);
        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      localFrame = requestAnimationFrame(renderCanvasAnimation);
      animFrameRef.current = localFrame;
    };

    animFrameRef.current = requestAnimationFrame(renderCanvasAnimation);

    return () => {
      cancelAnimationFrame(localFrame);
    };
  }, [isPlaying, totalSeconds, videoPreviewUrl, onVideoEnded]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTick();
    if (!isPlaying) {
      if (onPlayRequested) {
        onPlayRequested();
      } else {
        setIsPlaying(true);
        videoRef.current?.play().catch(() => {});
      }
    } else {
      setIsPlaying(false);
      videoRef.current?.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTick();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  return (
    <div className={`relative w-full overflow-hidden bg-[#071329] select-none ${
      isLarge ? 'h-[340px] sm:h-[440px]' : 'h-[260px] sm:h-[320px]'
    }`}>
      {/* 1. Base Image */}
      <img
        src={image}
        alt={title}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 2. Real Video element if URL provided */}
      {videoPreviewUrl ? (
        <video
          ref={videoRef}
          src={videoPreviewUrl}
          playsInline
          muted={isMuted}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) {
              setProgress(v.currentTime / v.duration);
            }
          }}
          onEnded={() => {
            if (onVideoEnded) {
              onVideoEnded();
            } else if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      ) : (
        /* 3. High-quality cinematic procedural canvas loop fallback */
        <canvas
          ref={canvasRef}
          width={720}
          height={480}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Ocean Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050f22] via-[#050f22]/20 to-transparent pointer-events-none" />

      {/* Top Left Media Badge (Orange accent, icon matches text: all white) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer ${
            isPlaying
              ? 'bg-orange-500 text-white shadow-orange-500/30'
              : 'bg-[#0b1d3a]/90 text-white border border-white/20 hover:bg-[#142a52]'
          }`}
          title={isPlaying ? 'Pause video clip' : 'Play video clip'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-white" />
              <span>Playing Reel</span>
            </>
          ) : (
            <>
              {videoPreviewUrl ? <Film className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white fill-current" />}
              <span>Watch Video ({videoDuration})</span>
            </>
          )}
        </button>
      </div>

      {/* Top Right Fullscreen Button */}
      {onExpand && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playTick();
              onExpand();
            }}
            className="p-2 rounded-full bg-[#0b1d3a]/80 text-white hover:bg-[#142a52] border border-white/20 transition-colors shadow-md cursor-pointer"
            title="Inspect project details"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Center Big Play Button (Orange when hovered, icon all white) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Play video preview"
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#0b1d3a]/90 border border-white/30 text-white flex items-center justify-center hover:scale-110 hover:bg-orange-500 transition-all shadow-xl group cursor-pointer"
        >
          <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
        </button>
      )}

      {/* Floating Video Control Bar with Orange Scrubber */}
      {isPlaying && (
        <div className="absolute bottom-3 left-4 right-4 z-10 p-2.5 rounded-2xl bg-[#030917]/90 border border-white/20 flex items-center gap-3 text-xs sm:text-sm text-white">
          <button
            onClick={togglePlay}
            className="p-1 hover:text-orange-400 transition-colors text-white cursor-pointer"
            title="Pause"
          >
            <Pause className="w-4 h-4 text-white" />
          </button>

          {/* Time & Scrub Track */}
          <div className="flex-1 flex items-center gap-2">
            <span className="font-semibold text-xs text-white tabular-nums">
              {formatTime(progress * totalSeconds)}
            </span>
            <div
              className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProg = Math.max(0, Math.min(1, clickX / rect.width));
                setProgress(newProg);
                if (videoRef.current && videoRef.current.duration) {
                  videoRef.current.currentTime = newProg * videoRef.current.duration;
                } else {
                  startTimeRef.current = performance.now() - (newProg * totalSeconds * 1000);
                }
              }}
            >
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="font-medium text-xs text-slate-300 tabular-nums">
              {videoDuration}
            </span>
          </div>

          <button
            onClick={toggleMute}
            className="p-1 hover:text-orange-400 transition-colors text-white cursor-pointer"
            title={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        </div>
      )}
    </div>
  );
};
