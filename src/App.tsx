import { useEffect, useState } from 'react';
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
import { BackgroundMusicPlayer } from './components/BackgroundMusicPlayer';
import { Footer } from './components/Footer';
import { PROJECTS as DEFAULT_PROJECTS } from './data/projects';
import { DEFAULT_DISCIPLINES } from './data/disciplines';
import { TEAM_MEMBERS as DEFAULT_TEAM } from './data/team';
import { DEFAULT_COLLABORATIONS } from './data/collaborations';
import { Project, DisciplineItem, TeamMember, CollaborationItem, BackgroundAudioConfig, SiteVisualsConfig, Custom3DModelConfig } from './types';
import { PRESET_AUDIO_TRACKS } from './utils/mediaUpload';
import { fetchCmsSnapshot, migrateCmsSnapshot, publishCmsContent, type CmsSnapshot } from './utils/cmsSync';

function reportCmsSyncError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Could not sync this change to the cloud.';
  window.dispatchEvent(new CustomEvent('ovr-cms-sync-error', { detail: message }));
}

const STORAGE_PROJECTS_KEY = 'ovr_studio_projects_v2';
const STORAGE_DISCIPLINES_KEY = 'ovr_studio_disciplines_v2';
const STORAGE_TEAM_KEY = 'ovr_studio_team_v2';
const STORAGE_COLLABORATIONS_KEY = 'ovr_studio_collaborations_v2';
const STORAGE_BG_AUDIO_KEY = 'ovr_studio_bg_audio_v2';
const STORAGE_SITE_VISUALS_KEY = 'ovr_studio_site_visuals_v2';
const STORAGE_CUSTOM_3D_KEY = 'ovr_studio_custom_3d_v2';

const DEFAULT_BG_AUDIO: BackgroundAudioConfig = {
  enabled: false,
  title: PRESET_AUDIO_TRACKS[0].title,
  artist: PRESET_AUDIO_TRACKS[0].artist,
  audioUrl: PRESET_AUDIO_TRACKS[0].url,
  volume: 0.4,
};

const DEFAULT_SITE_VISUALS: SiteVisualsConfig = {
  tabletImage: 'assets/images/ovr_game_unity_1793175840681.jpg',
  watchReelThumbnail: 'assets/images/ovr_art_2d_1793175838956.jpg',
  storyImage: 'assets/images/ovr_story_studio_life_1793177350433.jpg',
};

const DEFAULT_CUSTOM_3D: Custom3DModelConfig = {
  id: 'drone-default',
  name: 'OVR Submersible Drone',
  format: 'obj',
  dataUrlOrPath: '',
};


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

  // 4. Friendly Collaborations State (CRUD Managed)
  const [collaborations, setCollaborations] = useState<CollaborationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLABORATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_COLLABORATIONS;
  });

  // 5. Background Song / Audio State
  const [bgAudioConfig, setBgAudioConfig] = useState<BackgroundAudioConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BG_AUDIO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_BG_AUDIO;
  });

  // 6. Site-wide Visuals State (Tablet screen, Showreel thumbnail, Story frame)
  const [siteVisuals, setSiteVisuals] = useState<SiteVisualsConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SITE_VISUALS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_SITE_VISUALS;
  });

  // 7. Custom 3D Model State (.OBJ / .FBX mesh upload & inspection)
  const [custom3DModel, setCustom3DModel] = useState<Custom3DModelConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_3D_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_CUSTOM_3D;
  });

  const applyCmsSnapshot = (content: CmsSnapshot) => {
    if (Array.isArray(content.projects)) { setProjects(content.projects as Project[]); localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(content.projects)); }
    if (Array.isArray(content.disciplines)) { setDisciplines(content.disciplines as DisciplineItem[]); localStorage.setItem(STORAGE_DISCIPLINES_KEY, JSON.stringify(content.disciplines)); }
    if (Array.isArray(content.team)) { setTeam(content.team as TeamMember[]); localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(content.team)); }
    if (Array.isArray(content.collaborations)) { setCollaborations(content.collaborations as CollaborationItem[]); localStorage.setItem(STORAGE_COLLABORATIONS_KEY, JSON.stringify(content.collaborations)); }
    if (content.bgAudioConfig && typeof content.bgAudioConfig === 'object') { setBgAudioConfig(content.bgAudioConfig as BackgroundAudioConfig); localStorage.setItem(STORAGE_BG_AUDIO_KEY, JSON.stringify(content.bgAudioConfig)); }
    if (content.siteVisuals && typeof content.siteVisuals === 'object') { setSiteVisuals(content.siteVisuals as SiteVisualsConfig); localStorage.setItem(STORAGE_SITE_VISUALS_KEY, JSON.stringify(content.siteVisuals)); }
    if (content.custom3DModel && typeof content.custom3DModel === 'object') { setCustom3DModel(content.custom3DModel as Custom3DModelConfig); localStorage.setItem(STORAGE_CUSTOM_3D_KEY, JSON.stringify(content.custom3DModel)); }
  };

  // D1 is authoritative once the first authenticated migration has completed.
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      try {
        const snapshot = await fetchCmsSnapshot();
        if (!cancelled && snapshot.initialized) applyCmsSnapshot(snapshot.content);
      } catch {
        // Keep the local cache/default content available while the API is being configured.
      }
    };
    void refresh();
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, 5000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, []);

  const handleAdminAuthenticated = async () => {
    let snapshot = await fetchCmsSnapshot();
    if (!snapshot.initialized) {
      try {
        snapshot = await migrateCmsSnapshot({
          projects, disciplines, team, collaborations, bgAudioConfig, siteVisuals, custom3DModel,
        });
      } catch (error) {
        // Another authenticated browser may have completed the one-time import first.
        if (!(error instanceof Error) || !error.message.includes('already initialized')) throw error;
        snapshot = await fetchCmsSnapshot();
      }
    }
    if (snapshot.initialized) applyCmsSnapshot(snapshot.content);
  };

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactOpen, setContactOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [contactInitialMessage, setContactInitialMessage] = useState<string>('');

  // Sync to localStorage
  const handleUpdateSiteVisuals = (newVisuals: SiteVisualsConfig) => {
    setSiteVisuals(newVisuals);
    try {
      localStorage.setItem(STORAGE_SITE_VISUALS_KEY, JSON.stringify(newVisuals));
      void publishCmsContent('siteVisuals', newVisuals).catch(reportCmsSyncError);
    } catch {
      // storage quota
    }
  };

  const handleUpdateCustom3DModel = (newModel: Custom3DModelConfig) => {
    setCustom3DModel(newModel);
    try {
      localStorage.setItem(STORAGE_CUSTOM_3D_KEY, JSON.stringify(newModel));
      void publishCmsContent('custom3DModel', newModel).catch(reportCmsSyncError);
    } catch {
      // storage quota
    }
  };

  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(newProjects));
      void publishCmsContent('projects', newProjects).catch(reportCmsSyncError);
    } catch {
      // storage quota
    }
  };

  const handleUpdateDisciplines = (newDisciplines: DisciplineItem[]) => {
    setDisciplines(newDisciplines);
    try {
      localStorage.setItem(STORAGE_DISCIPLINES_KEY, JSON.stringify(newDisciplines));
      void publishCmsContent('disciplines', newDisciplines).catch(reportCmsSyncError);
    } catch {
      // storage quota
    }
  };

  const handleUpdateTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    try {
      localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(newTeam));
      void publishCmsContent('team', newTeam).catch(reportCmsSyncError);
    } catch {
      // storage quota
    }
  };

  const handleUpdateCollaborations = (newCollaborations: CollaborationItem[]) => {
    setCollaborations(newCollaborations);
    try {
      localStorage.setItem(STORAGE_COLLABORATIONS_KEY, JSON.stringify(newCollaborations));
      void publishCmsContent('collaborations', newCollaborations).catch(reportCmsSyncError);
    } catch {
      // storage quota
    }
  };

  const handleUpdateBgAudioConfig = (newConfig: BackgroundAudioConfig) => {
    setBgAudioConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_BG_AUDIO_KEY, JSON.stringify(newConfig));
      void publishCmsContent('bgAudioConfig', newConfig).catch(reportCmsSyncError);
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

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-orange-200 selection:text-orange-950 font-sans overflow-x-hidden">
      {/* 
        Clean White Base:
        Note: Removed the outer ambient backdrop blur from behind the 3D viewport hero window,
        leaving the hero section clean, bright, and isolated on pure white.
      */}

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
        {/* 2. Hero Section with 3D Viewport (Crisp white isolation, pt-32, no ambient backdrop) */}
        <HeroScene3D
          onExploreProjects={() => handleNavigate('projects')}
          onOpenBuilder={() => setAdminOpen(true)}
          onDiveDeeper={() => handleNavigate('about')}
          tabletImage={siteVisuals.tabletImage}
        />

        {/* 3. Ocean School Styled Watch Trailer / Reel Banner */}
        <WatchReelBanner
          onExploreProjects={() => handleNavigate('projects')}
          thumbnailImage={siteVisuals.watchReelThumbnail}
        />

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
          storyImage={siteVisuals.storyImage}
          onOpenContact={() => {
            setContactInitialMessage('');
            setContactOpen(true);
          }}
        />

        {/* 7. Studio Story, Beliefs & Dynamic Friendly Collaborations */}
        <StudioManifesto
          collaborations={collaborations}
          onOpenContact={() => {
            setContactInitialMessage('');
            setContactOpen(true);
          }}
          onOpenCMS={() => setAdminOpen(true)}
        />
      </main>

      {/* 8. Studio Footer with Studio CMS Access Button */}
      <Footer
        onOpenContact={() => {
          setContactInitialMessage('');
          setContactOpen(true);
        }}
        onNavigate={handleNavigate}
        onOpenCMS={() => setAdminOpen(true)}
      />

      {/* Background Music Player (User Uploadable & Configurable via Studio CMS) */}
      <BackgroundMusicPlayer
        config={bgAudioConfig}
        onToggleEnabled={() => handleUpdateBgAudioConfig({ ...bgAudioConfig, enabled: !bgAudioConfig.enabled })}
        onUpdateVolume={(vol) => handleUpdateBgAudioConfig({ ...bgAudioConfig, volume: vol })}
      />

      {/* Fullscreen Project Case Study Modal with Short Video */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquireSimilar={handleInquireSimilar}
      />

      {/* Contact & Commission Modal (No budget dropdown, directs directly to thomassiahaan31@gmail.com) */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        initialMessage={contactInitialMessage}
      />

      {/* Dedicated Real CMS Admin Dashboard */}
      <AdminCMSDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        projects={projects}
        disciplines={disciplines}
        team={team}
        collaborations={collaborations}
        bgAudioConfig={bgAudioConfig}
        siteVisuals={siteVisuals}
        custom3DModel={custom3DModel}
        onUpdateProjects={handleUpdateProjects}
        onUpdateDisciplines={handleUpdateDisciplines}
        onUpdateTeam={handleUpdateTeam}
        onUpdateCollaborations={handleUpdateCollaborations}
        onUpdateBgAudioConfig={handleUpdateBgAudioConfig}
        onUpdateSiteVisuals={handleUpdateSiteVisuals}
        onUpdateCustom3DModel={handleUpdateCustom3DModel}
        onAdminAuthenticated={handleAdminAuthenticated}
      />

    </div>
  );
}
