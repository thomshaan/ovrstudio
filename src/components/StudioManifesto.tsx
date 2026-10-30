import React from 'react';
import { ArrowRight, Heart, Smile, Sparkles, MessageCircle, Star } from 'lucide-react';
import { sound } from '../utils/audio';
import { CollaborationItem } from '../types';

interface StudioManifestoProps {
  collaborations: CollaborationItem[];
  onOpenContact: () => void;
  onOpenCMS?: () => void;
}

export const StudioManifesto: React.FC<StudioManifestoProps> = ({
  collaborations,
  onOpenContact,
  onOpenCMS,
}) => {
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
        
        {/* Section Header */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
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

        {/* Dynamic Friendly Collaborations Section (CRUD Managed via CMS) */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#0b1d3a] text-xs sm:text-sm font-semibold mb-2">
                <MessageCircle className="w-4 h-4 text-[#0b1d3a]" />
                <span>Client &amp; Partner Voices</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0b1d3a]">
                Friendly Collaborations
              </h3>
            </div>
            {onOpenCMS && (
              <button
                onClick={() => {
                  sound.playTick();
                  onOpenCMS();
                }}
                className="text-xs text-slate-500 hover:text-orange-600 transition-colors font-medium self-start sm:self-auto cursor-pointer"
              >
                Manage cards in Studio CMS &rarr;
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborations.map((collab) => (
              <div
                key={collab.id}
                className="p-7 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-100">
                      {collab.badge || 'Friendly collaboration'}
                    </span>
                    {collab.year && (
                      <span className="text-xs text-slate-600 font-medium">{collab.year}</span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic mb-6">
                    &ldquo;{collab.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  {collab.avatarUrl ? (
                    <img
                      src={collab.avatarUrl}
                      alt={collab.clientName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/30 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-sm">
                      {collab.clientName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0b1d3a] truncate">
                      {collab.clientName}
                    </div>
                    <div className="text-xs text-slate-600 truncate">
                      {collab.clientRole} · {collab.projectOrCompany}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ocean Blue Callout Banner with Orange CTA */}
        <div className="p-8 sm:p-14 bg-[#0b1d3a] text-white rounded-[32px] sm:rounded-[48px] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-medium mb-4">
              <Star className="w-4 h-4 text-orange-400 fill-current" />
              <span>Have a project in mind?</span>
            </div>
            <p className="text-xl sm:text-3xl font-display font-medium text-white leading-snug mb-4">
              Let&apos;s build an extraordinary game or 3D world together.
            </p>
            <div className="text-sm font-medium text-slate-300">
              Direct communication · Transparent milestones · Fast iterations
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
