import { useState, useEffect } from 'react';
import { HeroScene3D } from './components/HeroScene3D';
import { Navbar } from './components/Navbar';
import { WatchReelBanner } from './components/WatchReelBanner';
import { ProjectTabs } from './components/ProjectTabs';
import { StudioDisciplines } from './components/StudioDisciplines';
import { StudioTeam } from './components/StudioTeam';
import { StudioManifesto } from './components/StudioManifesto';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { AdminCMSDashboard } from './components/AdminCMSDashboard';
import { Footer } from './components/Footer';
import { PROJECTS as DEFAULT_PROJECTS } from './data/projects';
import { DEFAULT_DISCIPLINES } from './data/disciplines';
import { TEAM_MEMBERS as DEFAULT_TEAM } from './data/team';
import { Project, DisciplineItem, TeamMember } from './types';
import { Lock, Unlock, Sparkles } from 'lucide-react';
import { sound } from './utils/audio';

const STORAGE_PROJECTS_KEY = 'ovr_studio_projects_v2';
const STORAGE_DISCIPLINES_KEY = 'ovr_studio_disciplines_v2';
const STORAGE_TEAM_KEY = 'ovr_studio_team_v2';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');

  // 1. Projects State (Works Cards)
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROJECTS;
  });

  // 2. Disciplines State (What We Do Best Cards)
  const [disciplines, setDisciplines] = useState<DisciplineItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DISCIPLINES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_DISCIPLINES;
  });

  // 3. Team State (People Cards)
  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEAM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_TEAM;
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactOpen, setContactOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [contactInitialMessage, setContactInitialMessage] = useState<string>('');

  // Sync to localStorage
  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(newProjects));
    } catch {
      // storage quota
    }
  };

  const handleUpdateDisciplines = (newDisciplines: DisciplineItem[]) => {
    setDisciplines(newDisciplines);
    try {
      localStorage.setItem(STORAGE_DISCIPLINES_KEY, JSON.stringify(newDisciplines));
    } catch {
      // storage quota
    }
  };

  const handleUpdateTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    try {
      localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(newTeam));
    } catch {
      // storage quota
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquireSimilar = (projectName: string) => {
    setSelectedProject(null);
    setContactInitialMessage(`Hello! We were inspired by your work on "${projectName}". We would love to discuss a project with a similar vision.`);
    setContactOpen(true);
  };

  const isAdminUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('ovr_admin_unlocked') === 'true';

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-orange-200 selection:text-orange-950 font-sans overflow-x-hidden">
      {/* Improvised Fluid Background Color Aura & Shapes */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-sky-100/60 blur-3xl opacity-70 animate-pulse duration-1000" />
        <div className="absolute top-1/2 -left-20 w-[550px] h-[550px] rounded-full bg-blue-100/50 blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full bg-orange-100/40 blur-3xl opacity-50" />
      </div>

      {/* 1. Global Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenContact={() => {
          setContactInitialMessage('');
          setContactOpen(true);
        }}
      />

      <main>
        {/* 2. Hero Section with 3D Submarine/Manta Viewport & "What is OVRStudio?" */}
        <HeroScene3D
          onExploreProjects={() => handleNavigate('projects')}
          onOpenBuilder={() => setAdminOpen(true)}
          onDiveDeeper={() => handleNavigate('about')}
        />

        {/* 3. Ocean School Styled Watch Trailer / Reel Banner */}
        <WatchReelBanner onExploreProjects={() => handleNavigate('projects')} />

        {/* 4. Filterable Works & Short Videos (Cards accommodating video playback) */}
        <ProjectTabs
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* 5. What We Do Best Cards (Managed via CMS) */}
        <StudioDisciplines disciplines={disciplines} />

        {/* 6. Our Story & Team with Team Pictures (Managed via CMS) */}
        <StudioTeam
          team={team}
          onOpenContact={() => {
            setContactInitialMessage('');
            setContactOpen(true);
          }}
        />

        {/* 7. Studio Story & Manifesto */}
        <StudioManifesto
          onOpenContact={() => {
            setContactInitialMessage('');
            setContactOpen(true);
          }}
        />
      </main>

      {/* 8. Studio Footer */}
      <Footer
        onOpenContact={() => {
          setContactInitialMessage('');
          setContactOpen(true);
        }}
        onNavigate={handleNavigate}
      />

      {/* Floating Password-Protected Studio CMS Button with Interactive Shine Sweep */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            sound.playTick();
            setAdminOpen(true);
          }}
          className="group relative overflow-hidden px-4.5 py-3 bg-[#0b1d3a] hover:bg-[#142a52] text-white rounded-full text-xs font-semibold tracking-wide shadow-2xl flex items-center gap-2 border border-slate-700 transition-all duration-200 active:scale-95 hover:scale-105 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700"
          title="Studio CMS: Manage Works Cards, Disciplines, and People Cards"
        >
          {isAdminUnlocked ? (
            <Unlock className="w-4 h-4 text-orange-400" />
          ) : (
            <Lock className="w-4 h-4 text-white group-hover:text-orange-400 transition-colors" />
          )}
          <span>Studio CMS</span>
          <Sparkles className="w-3.5 h-3.5 text-orange-400 ml-0.5" />
        </button>
      </div>

      {/* Fullscreen Project Case Study Modal with Short Video */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquireSimilar={handleInquireSimilar}
      />

      {/* Contact & Commission Modal */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        initialMessage={contactInitialMessage}
      />

      {/* Dedicated Full-Screen Real CMS Admin Dashboard (Pass: ovr2026) */}
      <AdminCMSDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        projects={projects}
        disciplines={disciplines}
        team={team}
        onUpdateProjects={handleUpdateProjects}
        onUpdateDisciplines={handleUpdateDisciplines}
        onUpdateTeam={handleUpdateTeam}
      />
    </div>
  );
}
