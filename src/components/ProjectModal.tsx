import React, { useEffect } from 'react';
import { Project } from '../types';
import { X, Check, ArrowRight } from 'lucide-react';
import { ProjectMediaPreview } from './ProjectMediaPreview';
import { sound } from '../utils/audio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onInquireSimilar: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquireSimilar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playTick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1d3a]">
            <span>{project.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-400">/</span>
            <span className="text-slate-500 font-medium">Project Story</span>
          </div>

          <button
            onClick={() => {
              sound.playTick();
              onClose();
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full bg-white hover:bg-slate-200 transition-colors shadow-xs"
            aria-label="Close Project"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-2">
              Client: {project.client} · Year: {project.year}
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#0b1d3a] mb-3 tracking-tight">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl">
              {project.subtitle}
            </p>
          </div>

          {/* Video & Media Player */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <ProjectMediaPreview
              image={project.image}
              title={project.title}
              videoDuration={project.videoDuration}
              isLarge={true}
            />
          </div>

          {/* Highlights in Simple Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-[#f0f7ff] border border-sky-100 rounded-2xl">
            {project.highlights.map((h, idx) => (
              <div key={idx} className="p-2">
                <div className="text-2xl sm:text-3xl font-display font-bold text-[#0b1d3a] tabular-nums">
                  {h.value}
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">
                  {h.label}
                </div>
              </div>
            ))}
          </div>

          {/* Story & What We Made */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0b1d3a]">
                The Creative Story
              </h3>
              <p className="text-base text-slate-700 font-normal leading-relaxed">
                {project.story}
              </p>

              {project.quote && (
                <div className="mt-8 p-6 bg-amber-50/60 border-l-4 border-orange-500 rounded-r-2xl">
                  <p className="text-base italic text-slate-800 mb-3">
                    &ldquo;{project.quote.text}&rdquo;
                  </p>
                  <div className="text-xs font-bold text-[#0b1d3a]">
                    {project.quote.author} · <span className="text-slate-500 font-normal">{project.quote.role}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
              {/* Deliverables */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  What We Delivered
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {project.deliverables.map((del, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools Used */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Tools &amp; Tech We Used
                </h4>
                <div className="text-sm text-[#0b1d3a] font-semibold leading-relaxed">
                  {project.toolsUsed.join(' · ')}
                </div>
              </div>

              {/* Action Button - Warm Orange with matching white icon */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    sound.playChime(640, 0.15);
                    onInquireSimilar(project.title);
                  }}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                >
                  <span>Make Something Like This</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
