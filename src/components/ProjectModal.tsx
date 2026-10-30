import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { X, Check, ArrowRight, Box, Film, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectMediaPreview } from './ProjectMediaPreview';
import { Model3DViewer } from './Model3DViewer';
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
  // Media view modes: 'video-cover' | '3d-model' | 'gallery'
  const [activeMediaTab, setActiveMediaTab] = useState<'video-cover' | '3d-model' | 'gallery'>('video-cover');
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number>(0);

  useEffect(() => {
    // Reset to video/cover when project changes
    setActiveMediaTab('video-cover');
    setSelectedGalleryIdx(0);
  }, [project?.id]);

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

  // Compile full gallery list (cover + additional uploaded gallery images)
  const allImages = Array.from(
    new Set([project.image, ...(project.galleryImages || [])].filter(Boolean))
  );

  const has3DModel = Boolean(project.model3D);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1d3a]">
            <span>{project.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-400">/</span>
            <span className="text-slate-500 font-medium">{project.title}</span>
          </div>

          <button
            onClick={() => {
              sound.playTick();
              onClose();
            }}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-full bg-white hover:bg-slate-200 transition-colors shadow-xs cursor-pointer"
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

          {/* Media Switcher Tabs (Video/Cover, Interactive 3D Model, Photo Gallery) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-fit border border-slate-200">
              {/* 1. Video / Main Cover Button */}
              <button
                onClick={() => {
                  sound.playTick();
                  setActiveMediaTab('video-cover');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeMediaTab === 'video-cover'
                    ? 'bg-[#0b1d3a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0b1d3a] hover:bg-white/60'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Video &amp; Cover Reel</span>
              </button>

              {/* 2. Photo Gallery Button (Shows count of uploaded images) */}
              {allImages.length > 1 && (
                <button
                  onClick={() => {
                    sound.playTick();
                    setActiveMediaTab('gallery');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeMediaTab === 'gallery'
                      ? 'bg-[#0b1d3a] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0b1d3a] hover:bg-white/60'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Image Gallery ({allImages.length})</span>
                </button>
              )}

              {/* 3. Interactive 3D Model Viewer Button (ONLY shown for projects with 3D model) */}
              {has3DModel && (
                <button
                  onClick={() => {
                    sound.playChime(750, 0.15);
                    setActiveMediaTab('3d-model');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeMediaTab === '3d-model'
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                      : 'text-orange-700 bg-orange-100/70 hover:bg-orange-100'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  <span>Inspect 3D Model (Interactive)</span>
                </button>
              )}
            </div>

            {/* Media Display Viewport */}
            {activeMediaTab === 'video-cover' && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <ProjectMediaPreview
                  image={project.image}
                  title={project.title}
                  videoPreviewUrl={project.videoPreviewUrl}
                  videoDuration={project.videoDuration}
                  isLarge={true}
                />
              </div>
            )}

            {/* Photo Gallery View with Thumbnails & Carousel */}
            {activeMediaTab === 'gallery' && (
              <div className="space-y-4">
                <div className="relative aspect-video max-h-[480px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md flex items-center justify-center">
                  <img
                    src={allImages[selectedGalleryIdx] || project.image}
                    alt={`${project.title} slide ${selectedGalleryIdx + 1}`}
                    className="w-full h-full object-contain bg-black/40"
                  />

                  {/* Previous / Next buttons */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          sound.playTick();
                          setSelectedGalleryIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
                        }}
                        className="absolute left-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          sound.playTick();
                          setSelectedGalleryIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-mono font-bold">
                    {selectedGalleryIdx + 1} / {allImages.length}
                  </div>
                </div>

                {/* Thumbnails Row */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playTick();
                        setSelectedGalleryIdx(idx);
                      }}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedGalleryIdx === idx
                          ? 'border-orange-500 scale-105 shadow-md'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive 3D Model View (Rendered specifically for projects with 3D model) */}
            {activeMediaTab === '3d-model' && has3DModel && (
              <div className="space-y-2">
                <Model3DViewer
                  initialPreset="crystal-relic"
                  customObjContent={project.model3D?.dataUrlOrPath}
                  customModelName={project.model3D?.name || `${project.title} 3D Asset`}
                  showUploadButton={false}
                />
                <div className="text-xs text-slate-500 text-center">
                  Drag to rotate 3D mesh in 360° · Scroll to zoom · Click wireframe button for topology
                </div>
              </div>
            )}
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
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
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
