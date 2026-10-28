import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface WatchReelBannerProps {
  onExploreProjects: () => void;
}

export const WatchReelBanner: React.FC<WatchReelBannerProps> = ({ onExploreProjects }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <section className="w-full bg-white pt-2 pb-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Ocean Gradient Banner with Orange Play Button */}
        <div
          onClick={() => {
            sound.playChime(680, 0.15);
            setModalOpen(true);
          }}
          className="relative w-full h-48 sm:h-60 rounded-[32px] sm:rounded-[44px] bg-gradient-to-r from-[#0096c7] via-[#023e8a] to-[#03045e] p-8 sm:p-12 flex items-center justify-between overflow-hidden shadow-xl cursor-pointer group hover:shadow-2xl transition-all duration-300"
        >
          {/* Subtle curved wave SVG inside */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 200" fill="none" preserveAspectRatio="none">
              <path d="M0 100 C 300 20, 600 180, 1000 100 L 1000 200 L 0 200 Z" fill="#ffffff" />
            </svg>
          </div>

          {/* Left Text */}
          <div className="relative z-10 text-white space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold tracking-wide uppercase text-white">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Studio Showreel · 2026</span>
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight uppercase text-white">
              WATCH STUDIO TRAILER
            </h3>
            <p className="text-sm sm:text-base text-slate-100 max-w-lg leading-relaxed">
              Watch 45 seconds of gameplay, stylized 3D art, and immersive VR headsets in motion.
            </p>
          </div>

          {/* Right Floating Orange Play Circle (Icon color same as text: white) */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300 shrink-0">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current translate-x-0.5" />
          </div>
        </div>

      </div>

      {/* Showreel Video Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#061530] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between bg-[#040e22]">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
                <span>OVRStudio Showreel</span>
                <span className="text-slate-500">/</span>
                <span>Unity Games, 3D Art &amp; AR/VR</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full text-white hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Video preview area */}
            <div className="relative w-full aspect-16/9 bg-black overflow-hidden flex items-center justify-center">
              <img
                src="/src/assets/images/ovr_art_2d_1793175838956.jpg"
                alt="Studio Reel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span>0:45 Studio Montage · 60 FPS</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMuted(!muted)}
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
                  >
                    {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      onExploreProjects();
                    }}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs uppercase"
                  >
                    Explore Individual Works
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
