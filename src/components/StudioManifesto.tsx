import React from 'react';
import { ArrowRight, Heart, Smile, Sparkles, MessageCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface StudioManifestoProps {
  onOpenContact: () => void;
}

export const StudioManifesto: React.FC<StudioManifestoProps> = ({ onOpenContact }) => {
  const beliefs = [
    {
      icon: Smile,
      title: 'Games Should Feel Good in Your Hands',
      body: 'Whether it is piloting a tiny submarine or swimming with friendly manta rays, a game must feel intuitive, cozy, and delightful within the first five seconds.',
    },
    {
      icon: Heart,
      title: 'Art Needs Real Human Heart',
      body: 'We believe people fall in love with quirks, warm hand-painted strokes, and characters who look like they have real stories to tell.',
    },
    {
      icon: Sparkles,
      title: 'Virtual Worlds for Everyone',
      body: 'VR and AR should not require reading complicated manuals. We design spatial experiences so natural that both young kids and grandparents instantly smile.',
    },
  ];

  return (
    <section id="manifesto" className="relative bg-[#f8fafc] border-t border-slate-200 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            <span>Our Studio Beliefs</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-[#0b1d3a] tracking-tight leading-[1.15] mb-5 text-balance">
            Crafted by artists and developers who care about every pixel.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            At OVRStudio, we are a small, tight-knit group of game makers, 2D illustrators, and 3D animators. We do not make generic templates or cold corporate software. We make games you want to stay up late playing, illustrations you want to frame on your wall, and virtual worlds that make you say &ldquo;wow.&rdquo;
          </p>
        </div>

        {/* 3 Human Beliefs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {beliefs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 bg-white border border-slate-200 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0b1d3a] mb-3">
                  {item.title}
                </h3>
                <p className="text-base text-slate-600 font-normal leading-relaxed">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Ocean Blue Testimonial Banner with Orange CTA */}
        <div className="p-8 sm:p-14 bg-[#0b1d3a] text-white rounded-[36px] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Friendly collaboration</span>
            </div>
            <p className="text-xl sm:text-3xl font-display font-medium text-white leading-snug mb-4">
              &ldquo;OVRStudio made our dream ocean game feel cozy, playful, and alive. They listen carefully, work fast, and bring pure passion to the table.&rdquo;
            </p>
            <div className="text-sm font-semibold text-orange-400">
              Maya Lin · Producer at Coral Reef Games
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                sound.playChime(640, 0.15);
                onOpenContact();
              }}
              className="group relative overflow-hidden w-full md:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all duration-200 active:scale-95 hover:scale-[1.03] flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700"
            >
              <span>Say Hello to OVRStudio</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
