import React from 'react';
import { TeamMember } from '../types';
import { Heart, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface StudioTeamProps {
  team: TeamMember[];
  onOpenContact: () => void;
  storyImage?: string;
}

export const StudioTeam: React.FC<StudioTeamProps> = ({ team, onOpenContact, storyImage }) => {
  return (
    <section id="about" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-24">
        
        {/* Story Section Split — Matching Ocean School "One ocean connects us" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-orange-600 fill-current" />
              <span>Our Story</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#0b1d3a] tracking-tight leading-tight">
              One passion connects everything we make.
            </h2>

            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
              <strong className="text-[#0b1d3a] font-semibold">OVRStudio’s mission</strong> is to help everyone feel wonder and joy through games, art, and immersive technology. We aim to empower game creators, storytellers, and brands with experiences that feel genuine, cozy, and memorable.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              We started out as artists and developers who loved sketching characters and tinkering with Unity game prototypes. Today, our multidisciplinary team blends 3D art &amp; modeling, graphic design, game engineering, and AR/VR spatial craft.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playChime(640, 0.15);
                  onOpenContact();
                }}
                className="group relative overflow-hidden px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.03] shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 inline-flex items-center gap-2 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700"
              >
                <span>Partner with us</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Image Squircle Frame (Ocean School style squircle) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square max-w-md mx-auto rounded-[48px] overflow-hidden shadow-2xl border-4 border-white bg-sky-50">
              <img
                src={storyImage || "/src/assets/images/ovr_story_studio_life_1793175840681.jpg"}
                alt="OVRStudio Team Collaborating"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to story image
                  (e.target as HTMLImageElement).src = '/src/assets/images/ovr_art_2d_1793175838956.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d3a]/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-semibold text-orange-300 uppercase tracking-wider mb-1">
                  Inside the Studio
                </div>
                <div className="text-base font-semibold leading-snug text-white">
                  Brainstorming character sketches and Unity physics for our next release.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Meet the Team Grid */}
        <div id="team" className="pt-10 border-t border-slate-100 scroll-mt-24">
          <div className="max-w-2xl mb-12">
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-600 mb-2">
              Meet the Humans Behind OVRStudio
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-bold text-[#0b1d3a] tracking-tight">
              Artists, game developers &amp; spatial thinkers.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-[#f8fafc] border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all group hover:border-orange-300"
              >
                <div>
                  {/* Photo Avatar */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-6 shadow-md border-2 border-white bg-slate-200">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <h4 className="text-xl font-display font-bold text-[#0b1d3a] group-hover:text-orange-600 transition-colors">
                    {member.name}
                  </h4>
                  <div className="text-xs sm:text-sm font-semibold text-orange-600 mb-1.5">
                    {member.role}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mb-4">
                    Discipline: {member.discipline}
                  </div>

                  <p className="text-base text-slate-600 leading-relaxed font-normal">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium">
                  <span>Favorite craft tool:</span>
                  <span className="font-bold text-[#0b1d3a]">
                    {member.favoriteTool}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
