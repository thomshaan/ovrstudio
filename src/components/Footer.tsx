import React from 'react';
import { ArrowUp, Waves, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  onOpenContact: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onNavigate }) => {
  const scrollToTop = () => {
    sound.playTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                  className="hover:text-sky-600 transition-colors"
                >
                  Works &amp; Short Videos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disciplines')}
                  className="hover:text-sky-600 transition-colors"
                >
                  What We Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Our Story &amp; Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manifesto')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Our Beliefs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Box */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Get in Touch
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have an idea for a game, an illustrated storybook, or a VR world? We would love to chat.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenContact}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-orange-500/20"
              >
                Say Hello
              </button>
              <button
                onClick={scrollToTop}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} OVRStudio. Made with</span>
            <Heart className="w-3.5 h-3.5 text-sky-600 fill-current inline" />
            <span>by artists &amp; gamers.</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <span>3D Art</span>
            <span>·</span>
            <span>Graphic Design</span>
            <span>·</span>
            <span>Unity Games</span>
            <span>·</span>
            <span>AR / VR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
