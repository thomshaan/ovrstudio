import React, { useState, useRef } from 'react';
import { Project, ProjectCategory } from '../types';
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Gamepad2, Box, Layers, Glasses } from 'lucide-react';
import { ProjectMediaPreview } from './ProjectMediaPreview';
import { sound } from '../utils/audio';

interface ProjectTabsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectTabs: React.FC<ProjectTabsProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Works & Videos' },
    { id: 'unity-game', label: 'Unity Indie Games' },
    { id: '3d-art', label: '3D Art & Modeling' },
    { id: 'graphic-design', label: 'Graphic Design' },
    { id: 'ar-vr-mr', label: 'AR / VR / MR Worlds' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory || (selectedCategory === '3d-art' && (p.category as string) === '2d-art'));

  const scrollLeft = () => {
    sound.playTick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    sound.playTick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // Helper icon for categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'unity-game':
        return <Gamepad2 className="w-4 h-4 text-orange-500" />;
      case '3d-art':
      case '2d-art':
        return <Box className="w-4 h-4 text-orange-500" />;
      case 'graphic-design':
        return <Layers className="w-4 h-4 text-orange-500" />;
      case 'ar-vr-mr':
        return <Glasses className="w-4 h-4 text-orange-500" />;
      default:
        return <Play className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <section id="projects" className="relative bg-[#f0f7ff] pt-20 pb-28 overflow-hidden">
      {/* Improvised Ambient Blurred Background with Animated Color Shapes & Project Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Softly glowing animated ocean gradient blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/40 via-blue-200/30 to-transparent blur-3xl animate-pulse duration-1000" />
        <div className="absolute top-1/3 -right-20 w-[480px] h-[480px] rounded-full bg-gradient-to-bl from-orange-200/30 via-sky-200/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-[520px] h-[520px] rounded-full bg-gradient-to-t from-blue-300/25 via-indigo-100/30 to-transparent blur-3xl" />

        {/* Ambient blurred backdrop vignette from current project image */}
        {projects[0] && (
          <div
            className="absolute inset-0 opacity-[0.06] bg-cover bg-center filter blur-2xl scale-110 pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${projects[0].image})` }}
          />
        )}
      </div>

      {/* Top Curved Wave Divider creating overlapping depth */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%] overflow-hidden leading-none pointer-events-none z-10">
        <svg
          className="relative block w-full h-12 sm:h-20"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C320,60 680,80 1040,40 C1240,20 1380,5 1440,0 L1440,80 L0,80 Z"
            fill="#f0f7ff"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header & Scroll Navigation (Matching Ocean School reference layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#0b1d3a] text-xs sm:text-sm font-semibold tracking-wide mb-3 shadow-xs border border-sky-100">
              <span>Featured Works &amp; Collections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#0b1d3a] tracking-tight">
              Games, art, and virtual worlds we made.
            </h2>
          </div>

          {/* Right Scroll Buttons (Matching < > buttons from reference image_10d2efa4.png) */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="group relative overflow-hidden w-11 h-11 rounded-full bg-white border border-slate-200 text-[#0b1d3a] hover:text-orange-600 hover:border-orange-300 flex items-center justify-center shadow-xs transition-all duration-200 active:scale-95 hover:scale-105 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-current group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollRight}
              className="group relative overflow-hidden w-11 h-11 rounded-full bg-white border border-slate-200 text-[#0b1d3a] hover:text-orange-600 hover:border-orange-300 flex items-center justify-center shadow-xs transition-all duration-200 active:scale-95 hover:scale-105 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-current group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Clean Filter Category Tabs */}
        <div className="flex items-center gap-2.5 p-1.5 bg-white/80 rounded-full overflow-x-auto mb-10 scrollbar-none max-w-fit shadow-xs border border-sky-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playTick();
                setSelectedCategory(cat.id);
              }}
              className={`relative overflow-hidden px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0b1d3a] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0b1d3a] hover:bg-sky-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Horizontal Improvised Scroll Container with Overlapping Depth & Clean White Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="w-[320px] sm:w-[380px] shrink-0 snap-start bg-white border border-slate-200/90 hover:border-orange-400 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
            >
              {/* Top Media Container with short video player */}
              <div className="relative">
                <ProjectMediaPreview
                  image={project.image}
                  title={project.title}
                  videoDuration={project.videoDuration}
                  isLarge={false}
                  onExpand={() => {
                    sound.playChime(680, 0.15);
                    onSelectProject(project);
                  }}
                />

                {/* Floating Tag over Image */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-white/95 rounded-full text-[11px] font-bold text-[#0b1d3a] shadow-sm">
                  {getCategoryIcon(project.category)}
                  <span>{project.categoryLabel}</span>
                </div>
              </div>

              {/* Card Body — Crisp White Surface with Bold Navy Text */}
              <div
                onClick={() => {
                  sound.playChime(680, 0.15);
                  onSelectProject(project);
                }}
                className="p-6 flex-1 flex flex-col justify-between cursor-pointer bg-white"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    {project.client} · {project.year}
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0b1d3a] group-hover:text-orange-600 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <div className="mt-1 text-slate-400 group-hover:text-orange-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 font-normal leading-relaxed mb-6 line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                {/* Bottom Details — clean text tags without numbers */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-semibold text-[#0b1d3a]">
                      {project.deliverables[0] || project.categoryLabel}
                    </span>
                  </div>

                  <div className="text-orange-600 font-semibold group-hover:underline flex items-center gap-1">
                    <span>Watch Story</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Curved Wave transitioning into next section */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-[99%] overflow-hidden leading-none pointer-events-none z-10">
        <svg
          className="relative block w-full h-12 sm:h-20"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C360,70 720,70 1080,20 C1240,0 1380,0 1440,20 L1440,80 L0,80 Z"
            fill="#0b1d3a"
          />
        </svg>
      </div>
    </section>
  );
};
