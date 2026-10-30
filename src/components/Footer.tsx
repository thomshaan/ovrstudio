import React from 'react';
import { ArrowUp, Waves, Heart, Lock, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  onOpenContact: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenCMS?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onNavigate, onOpenCMS }) => {
  const scrollToTop = () => {
    sound.playTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('ovr_admin_unlocked') === 'true';

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-100">
          
          {/* Studio Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0b1d3a] flex items-center justify-center text-white">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-display font-bold text-[#0b1d3a] tracking-tight">
                OVRStudio
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              We make joyful 3D art, graphic design, cozy Unity indie games, and mixed reality worlds people love to explore.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-sky-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Open for creative partnerships in 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Explore
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-sky-600 transition-colors cursor-pointer"
                >
                  Works &amp; Short Videos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disciplines')}
                  className="hover:text-sky-600 transition-colors cursor-pointer"
                >
                  What We Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-sky-600 transition-colors cursor-pointer"
                >
                  Our Story &amp; Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manifesto')}
                  className="hover:text-sky-600 transition-colors cursor-pointer"
                >
                  Our Beliefs &amp; Collaborations
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Box & Studio CMS access */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Get in Touch
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have an idea for a game, an illustrated storybook, or a VR world? We would love to chat.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenContact}
                className="group relative overflow-hidden px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md shadow-orange-500/20 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700"
              >
                Say Hello
              </button>

              {/* Studio CMS Button in Footer as requested */}
              {onOpenCMS && (
                <button
                  onClick={() => {
                    sound.playTick();
                    onOpenCMS();
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-[#0b1d3a] hover:text-white text-[#0b1d3a] rounded-full text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  title="Manage cards, videos, audio, and collaborations"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Studio CMS</span>
                  {isAdminUnlocked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              )}

              <button
                onClick={scrollToTop}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer ml-auto"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Studio CMS discreet link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} OVRStudio. Made with</span>
            <Heart className="w-3.5 h-3.5 text-sky-600 fill-current inline" />
            <span>by artists &amp; gamers.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>3D Art</span>
            <span>·</span>
            <span>Graphic Design</span>
            <span>·</span>
            <span>Unity Games</span>
            <span>·</span>
            <span>AR / VR</span>
            {onOpenCMS && (
              <>
                <span>·</span>
                <button
                  onClick={() => {
                    sound.playTick();
                    onOpenCMS();
                  }}
                  className="hover:text-orange-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span>Admin CMS</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
