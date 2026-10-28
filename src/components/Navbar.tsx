import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Menu, ChevronDown, Sparkles, Layers, Box, Gamepad2, Glasses, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenContact,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [audioActive, setAudioActive] = useState<boolean>(sound.enabled);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    const newState = sound.toggle();
    setAudioActive(newState);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const studioLinks = [
    { id: 'projects', label: 'Works & Short Videos', icon: Sparkles, desc: 'Browse games, 3D art, and VR worlds' },
    { id: 'disciplines', label: 'What We Do', icon: Layers, desc: '3D Art, Graphic Design, Unity & AR/VR' },
    { id: 'about', label: 'Our Story & Team', icon: Heart, desc: 'Meet our founders, artists and game creators' },
    { id: 'manifesto', label: 'Our Creative Beliefs', icon: Gamepad2, desc: 'Why we love making games with heart' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* LEFT: Dropdown of the menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              sound.playTick();
              setDropdownOpen(!dropdownOpen);
            }}
            className="group relative overflow-hidden flex items-center gap-2.5 px-4 sm:px-5 py-2.5 bg-[#0b1d3a] hover:bg-[#142a52] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 hover:scale-[1.02] shadow-sm cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700"
            aria-expanded={dropdownOpen}
          >
            <Menu className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Explore our studio</span>
            <span className="sm:hidden">Menu</span>
            <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu Modal */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Studio Directory
              </div>
              <div className="space-y-1">
                {studioLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playTick();
                        setDropdownOpen(false);
                        onNavigate(item.id);
                      }}
                      className="w-full p-2.5 rounded-xl text-left hover:bg-sky-50 transition-colors flex items-start gap-3 group"
                    >
                      <div className="p-2 rounded-lg bg-sky-100 text-[#0b1d3a] group-hover:bg-[#0b1d3a] group-hover:text-white transition-colors mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0b1d3a]">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 px-2 pb-1">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5 p-1 text-slate-700">
                    <Box className="w-3.5 h-3.5 text-orange-500" />
                    <span>3D Art</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 text-slate-700">
                    <Gamepad2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>Unity Games</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 text-slate-700">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    <span>Graphic Design</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 text-slate-700">
                    <Glasses className="w-3.5 h-3.5 text-orange-500" />
                    <span>AR / VR</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER: OVRStudio Brand Logo Mark */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              sound.playTick();
              onNavigate('hero');
            }}
            className="flex items-center gap-2.5 group text-left"
            aria-label="OVRStudio Home"
          >
            <div className="w-9 h-9 rounded-full border-2 border-[#0b1d3a] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform bg-white">
              <svg viewBox="0 0 36 36" className="w-full h-full text-[#0b1d3a]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="18" r="16" />
                <path d="M2 18 C10 10, 26 10, 34 18" />
                <path d="M2 18 C10 26, 26 26, 34 18" />
                <ellipse cx="18" cy="18" rx="8" ry="16" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#0b1d3a] group-hover:text-orange-600 transition-colors leading-none">
                OVRStudio
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                Creative Studio
              </span>
            </div>
          </button>
        </div>

        {/* RIGHT: Works & Videos link and Orange Contact CTA */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => {
              sound.playTick();
              onNavigate('projects');
            }}
            className={`text-sm font-semibold tracking-wide transition-colors whitespace-nowrap hidden md:inline-block ${
              activeSection === 'projects' ? 'text-orange-600' : 'text-slate-700 hover:text-[#0b1d3a]'
            }`}
          >
            Works &amp; Videos
          </button>

          <button
            onClick={() => {
              sound.playTick();
              onNavigate('team');
            }}
            className="text-sm font-semibold tracking-wide text-slate-700 hover:text-[#0b1d3a] transition-colors whitespace-nowrap hidden lg:inline-block cursor-pointer"
          >
            Our Team
          </button>

          {/* Sound toggle button */}
          <button
            onClick={toggleSound}
            aria-label={audioActive ? 'Mute sound' : 'Turn on sound'}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={audioActive ? 'Mute sound' : 'Turn on friendly water sound'}
          >
            {audioActive ? <Volume2 className="w-4 h-4 text-orange-500" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Orange Primary Contact CTA Button with cool interactive shine sweep & tactile press */}
          <button
            onClick={() => {
              sound.playChime(640, 0.15);
              onOpenContact();
            }}
            className="group relative overflow-hidden px-5 sm:px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 hover:scale-[1.03] shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 whitespace-nowrap flex items-center gap-1.5 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700"
          >
            <span>Say Hello</span>
          </button>
        </div>

      </div>
    </header>
  );
};
