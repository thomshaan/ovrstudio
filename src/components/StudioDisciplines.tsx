import React from 'react';
import { Box, Layers, Gamepad2, Glasses, Sparkles, Palette } from 'lucide-react';
import { DisciplineItem } from '../types';
import { DEFAULT_DISCIPLINES } from '../data/disciplines';

interface StudioDisciplinesProps {
  disciplines?: DisciplineItem[];
}

const ICON_MAP = {
  Box,
  Layers,
  Gamepad2,
  Glasses,
  Sparkles,
  Palette,
};

export const StudioDisciplines: React.FC<StudioDisciplinesProps> = ({
  disciplines = DEFAULT_DISCIPLINES,
}) => {
  return (
    <section id="disciplines" className="relative bg-[#0b1d3a] text-white pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              <span>What We Do Best</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              Our core creative crafts under one friendly roof.
            </h2>
          </div>
          <p className="text-base text-slate-200 max-w-md font-normal leading-relaxed">
            Whether you need a full indie game in Unity, stylized 3D character sculpts, or an immersive VR world, we love turning ideas into something you can touch and play.
          </p>
        </div>

        {/* Dynamic Disciplines Cards with Deep Navy Glass styling, white icons matching text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {disciplines.map((item) => {
            const IconComponent = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || Box;
            return (
              <div
                key={item.id}
                className="p-8 bg-[#10274c] border border-white/10 hover:border-orange-400 rounded-3xl transition-all duration-300 group shadow-lg flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <div className="p-3 rounded-2xl bg-[#0b1d3a] text-white group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-base text-slate-200 font-normal leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2.5">
                    Common Deliverables
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed space-y-1.5">
                    {item.whatWeMake.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Wave transitioning into White "Our Story & Team" */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-[99%] overflow-hidden leading-none pointer-events-none z-10">
        <svg
          className="relative block w-full h-12 sm:h-20"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C400,60 800,80 1200,30 C1320,15 1400,5 1440,0 L1440,80 L0,80 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
};
