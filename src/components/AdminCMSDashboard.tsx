import React, { useState } from 'react';
import { Project, DisciplineItem, TeamMember, CollaborationItem, BackgroundAudioConfig, ProjectCategory } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/projects';
import { DEFAULT_DISCIPLINES } from '../data/disciplines';
import { TEAM_MEMBERS as DEFAULT_TEAM } from '../data/team';
import { DEFAULT_COLLABORATIONS } from '../data/collaborations';
import { sound } from '../utils/audio';
import { CMSMediaUploader } from './CMSMediaUploader';
import { Model3DViewer } from './Model3DViewer';
import { PRESET_AUDIO_TRACKS, uploadFileToR2 } from '../utils/mediaUpload';
import { resolveAssetUrl } from '../utils/assets';
import {
  Lock,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ArrowLeft,
  Search,
  CheckCircle2,
  Box,
  Users,
  Film,
  Music,
  RefreshCw,
  X,
  ExternalLink,
  Save,
  AlertCircle,
  MessageCircle,
  Cloud,
  Download,
  UploadCloud,
  Volume2,
  Sparkles,
  Upload,
  Check,
} from 'lucide-react';



interface AdminCMSDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  disciplines: DisciplineItem[];
  team: TeamMember[];
  collaborations: CollaborationItem[];
  bgAudioConfig: BackgroundAudioConfig;
  siteVisuals: import('../types').SiteVisualsConfig;
  custom3DModel: import('../types').Custom3DModelConfig;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateDisciplines: (disciplines: DisciplineItem[]) => void;
  onUpdateTeam: (team: TeamMember[]) => void;
  onUpdateCollaborations: (collaborations: CollaborationItem[]) => void;
  onUpdateBgAudioConfig: (config: BackgroundAudioConfig) => void;
  onUpdateSiteVisuals: (visuals: import('../types').SiteVisualsConfig) => void;
  onUpdateCustom3DModel: (model: import('../types').Custom3DModelConfig) => void;
}


const MASTER_PASSWORD = 'ovr2026';

const PRESET_IMAGES = [
  { label: '3D Character Art', url: 'assets/images/ovr_art_2d_1793175838956.jpg' },
  { label: 'Unity Indie Game', url: 'assets/images/ovr_game_unity_1793175840681.jpg' },
  { label: 'Mixed Reality VR/AR', url: 'assets/images/ovr_vr_experience_1793175841126.jpg' },
  { label: 'Graphic Design', url: 'assets/images/ovr_design_branding_1793175840098.jpg' },
  { label: 'Studio Life', url: 'assets/images/ovr_story_studio_life_1793177350433.jpg' },
  { label: 'Team Founder', url: 'assets/images/ovr_team_founder_1793177349401.jpg' },
  { label: 'Team Lead Artist', url: 'assets/images/ovr_team_lead_artist_1793177349612.jpg' },
  { label: 'Team Tech Artist', url: 'assets/images/ovr_team_tech_artist_1793177350136.jpg' },
];

export const AdminCMSDashboard: React.FC<AdminCMSDashboardProps> = ({
  isOpen,
  onClose,
  projects,
  disciplines,
  team,
  collaborations,
  bgAudioConfig,
  siteVisuals,
  custom3DModel,
  onUpdateProjects,
  onUpdateDisciplines,
  onUpdateTeam,
  onUpdateCollaborations,
  onUpdateBgAudioConfig,
  onUpdateSiteVisuals,
  onUpdateCustom3DModel,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ovr_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'works' | 'collaborations' | 'disciplines' | 'team' | 'site-images' | 'models-3d' | 'audio' | 'settings'>('works');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editing state for Project
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Editing state for Discipline
  const [editingDiscipline, setEditingDiscipline] = useState<DisciplineItem | null>(null);
  const [isCreatingDiscipline, setIsCreatingDiscipline] = useState(false);

  // Editing state for Team Member
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isCreatingTeamMember, setIsCreatingTeamMember] = useState(false);

  // Editing state for Collaboration Card
  const [editingCollaboration, setEditingCollaboration] = useState<CollaborationItem | null>(null);
  const [isCreatingCollaboration, setIsCreatingCollaboration] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === MASTER_PASSWORD) {
      sound.playChime(750, 0.2);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('ovr_admin_unlocked', 'true');
      } catch {
        // ignore
      }
      setAuthError('');
    } else {
      sound.playTick();
      setAuthError('Incorrect studio password. Please try again.');
    }
  };

  const handleLogout = () => {
    sound.playTick();
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('ovr_admin_unlocked');
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#07172b]/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0b1d3a] mb-2">
            Studio CMS Portal
          </h2>
          <p className="text-sm text-slate-600 mb-8 leading-relaxed">
            Enter the studio master key to manage <strong>Works Cards</strong>, <strong>Collaborations</strong>, <strong>People Cards</strong>, and <strong>Background Audio</strong>.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError('');
                }}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-center text-lg text-slate-800"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-600 mt-2 font-medium flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold tracking-wider uppercase text-sm shadow-lg shadow-orange-500/30 transition-all duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
            >
              Access CMS Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
            Hint for studio team: Default password is <code className="bg-slate-100 text-orange-700 px-2 py-0.5 rounded font-mono font-bold">ovr2026</code>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full-Screen CMS Dashboard
  return (
    <div className="fixed inset-0 z-50 bg-[#07172b] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top CMS Header Bar */}
      <header className="h-18 bg-[#0b1d3a] border-b border-white/10 px-6 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playTick();
              onClose();
            }}
            className="group relative overflow-hidden flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Portfolio</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/15 pl-4">
            <span className="text-base font-bold text-white tracking-wider">OVRStudio CMS</span>
            <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[11px] font-bold rounded-full uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Local Sync Active</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Lock / Logout
          </button>
        </div>
      </header>

      {/* Main CMS Layout (Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left CMS Navigation Sidebar */}
        <aside className="w-64 bg-[#091b35] border-r border-white/10 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Content Collections
            </div>

            {/* Works Cards Tab */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('works');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'works'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4" />
                <span>Works &amp; Videos</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'works' ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {projects.length}
              </span>
            </button>

            {/* Friendly Collaborations Tab */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('collaborations');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'collaborations'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4" />
                <span>Collaborations</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'collaborations' ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {collaborations.length}
              </span>
            </button>

            {/* What We Do Best Cards Tab */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('disciplines');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'disciplines'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4" />
                <span>What We Do Best</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'disciplines' ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {disciplines.length}
              </span>
            </button>

            {/* People & Team Cards Tab */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('team');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>People &amp; Team</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'team' ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {team.length}
              </span>
            </button>

            {/* All Site Images Tab (Make all image in the web changeable) */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('site-images');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'site-images'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4" />
                <span>Site Images</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-orange-300 font-bold uppercase">All</span>
            </button>

            {/* 3D Model Lab (Upload OBJ/FBX files for interactive inspect) */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('models-3d');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'models-3d'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>3D Model Lab</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">OBJ</span>
            </button>

            {/* Background Audio & Song Tab */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('audio');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4" />
                <span>Background Song</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-orange-400" />
            </button>


            {/* Deploy & Storage Settings */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('settings');
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Storage &amp; Deploy</span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400">
            <div>OVRStudio Engine v2.4</div>
            <div className="text-slate-500">Live Client Sync</div>
          </div>
        </aside>

        {/* Right Content Workspace */}
        <main className="flex-1 bg-[#061426] p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: WORKS & VIDEOS */}
          {activeTab === 'works' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    Works &amp; Short Videos Cards
                  </h1>
                  <p className="text-sm text-slate-400">
                    Upload images and videos, edit tags, stories, and showcase deliverables.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playChime(640, 0.1);
                      setIsCreatingProject(true);
                    }}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project Card</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#0b1d3a] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group"
                  >
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={resolveAssetUrl(proj.image)}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 uppercase">
                        {proj.categoryLabel}
                      </div>
                      {proj.videoPreviewUrl && (
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          <span>Video Attached</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-orange-400 font-semibold mb-1">{proj.client} · {proj.year}</div>
                        <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">{proj.summary}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-[11px] text-slate-400">ID: {proj.id}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              sound.playTick();
                              setEditingProject(proj);
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              sound.playTick();
                              const cloned = { ...proj, id: `proj-${Date.now()}`, title: `${proj.title} (Copy)` };
                              onUpdateProjects([cloned, ...projects]);
                              showToast('Project cloned successfully');
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            title="Clone project"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${proj.title}"?`)) {
                                sound.playTick();
                                onUpdateProjects(projects.filter((p) => p.id !== proj.id));
                                showToast('Project deleted');
                              }
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FRIENDLY COLLABORATIONS (CRUD) */}
          {activeTab === 'collaborations' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    Friendly Collaboration Cards
                  </h1>
                  <p className="text-sm text-slate-400">
                    Add, edit, and manage partner quotes, co-productions, and client stories with avatar photos.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playChime(640, 0.1);
                    setIsCreatingCollaboration(true);
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Collaboration Card</span>
                </button>
              </div>

              {/* Collaborations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborations.map((collab) => (
                  <div
                    key={collab.id}
                    className="bg-[#0b1d3a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold border border-orange-500/30">
                          {collab.badge || 'Collaboration'}
                        </span>
                        {collab.year && <span className="text-xs text-slate-400">{collab.year}</span>}
                      </div>

                      <p className="text-sm text-slate-200 italic mb-6 leading-relaxed">
                        &ldquo;{collab.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {collab.avatarUrl ? (
                          <img
                            src={resolveAssetUrl(collab.avatarUrl)}
                            alt={collab.clientName}
                            className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-300 font-bold flex items-center justify-center shrink-0">
                            {collab.clientName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{collab.clientName}</div>
                          <div className="text-[11px] text-slate-400 truncate">{collab.clientRole} · {collab.projectOrCompany}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => {
                            sound.playTick();
                            setEditingCollaboration(collab);
                          }}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                          title="Edit collaboration"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            sound.playTick();
                            const cloned = { ...collab, id: `collab-${Date.now()}`, clientName: `${collab.clientName} (Copy)` };
                            onUpdateCollaborations([cloned, ...collaborations]);
                            showToast('Collaboration card cloned');
                          }}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                          title="Clone"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete collaboration from "${collab.clientName}"?`)) {
                              sound.playTick();
                              onUpdateCollaborations(collaborations.filter((c) => c.id !== collab.id));
                              showToast('Collaboration card removed');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WHAT WE DO BEST CARDS */}
          {activeTab === 'disciplines' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    What We Do Best Cards
                  </h1>
                  <p className="text-sm text-slate-400">
                    Manage studio specializations: 3D Art, Graphic Design, Unity Games, and AR/VR/MR.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playChime(640, 0.1);
                    setIsCreatingDiscipline(true);
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Discipline Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {disciplines.map((disc) => (
                  <div
                    key={disc.id}
                    className="bg-[#0b1d3a] border border-white/10 rounded-2xl p-6 flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                          {disc.tag}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              sound.playTick();
                              setEditingDiscipline(disc);
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete discipline "${disc.title}"?`)) {
                                sound.playTick();
                                onUpdateDisciplines(disciplines.filter((d) => d.id !== disc.id));
                                showToast('Discipline card deleted');
                              }
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{disc.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-4">{disc.description}</p>

                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-400 uppercase">Deliverables:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {disc.whatWeMake.map((item, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-slate-200">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PEOPLE & TEAM */}
          {activeTab === 'team' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    People &amp; Team Cards
                  </h1>
                  <p className="text-sm text-slate-400">
                    Add and edit team member profiles, roles, bios, and upload portraits.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playChime(640, 0.1);
                    setIsCreatingTeamMember(true);
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[#0b1d3a] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group"
                  >
                    <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                      <img
                        src={resolveAssetUrl(m.avatar)}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                        {m.discipline}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-orange-400 font-semibold mb-1">{m.role}</div>
                        <h3 className="text-lg font-bold text-white mb-2">{m.name}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">{m.bio}</p>
                        <div className="text-[11px] text-slate-400">
                          <strong>Go-to Tool:</strong> {m.favoriteTool}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10 mt-4">
                        <button
                          onClick={() => {
                            sound.playTick();
                            setEditingTeamMember(m);
                          }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${m.name}" from the team?`)) {
                              sound.playTick();
                              onUpdateTeam(team.filter((t) => t.id !== m.id));
                              showToast('Team member removed');
                            }
                          }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SITE-WIDE IMAGES (Make all images in the web changeable) */}
          {activeTab === 'site-images' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Site-Wide Images &amp; Media Manager
                </h1>
                <p className="text-sm text-slate-400">
                  Easily replace every static image on the website (Tablet Preview, Showreel Modal, Our Story Life Frame).
                </p>
              </div>

              <div className="bg-[#0b1d3a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8">
                {/* 1. Hero Tablet Preview Image */}
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>1. 3D Hero Tablet Screen Image</span>
                    <span className="text-xs text-orange-400 font-mono">Hero Section Tablet</span>
                  </div>
                  <CMSMediaUploader
                    label="Tablet Display Graphic"
                    mediaType="image"
                    currentUrl={siteVisuals.tabletImage}
                    onMediaSelect={(url) => {
                      onUpdateSiteVisuals({
                        ...siteVisuals,
                        tabletImage: url,
                      });
                      showToast('Hero tablet screen image updated');
                    }}
                    presetOptions={PRESET_IMAGES}
                    recommendedNotice="This image is displayed inside the beveled tablet device screen in the hero section."
                  />
                </div>

                {/* 2. Watch Studio Trailer Modal Thumbnail */}
                <div className="space-y-2 pt-6 border-t border-white/10">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>2. Watch Studio Trailer Video Thumbnail</span>
                    <span className="text-xs text-orange-400 font-mono">Showreel Modal</span>
                  </div>
                  <CMSMediaUploader
                    label="Showreel Thumbnail Graphic"
                    mediaType="image"
                    currentUrl={siteVisuals.watchReelThumbnail}
                    onMediaSelect={(url) => {
                      onUpdateSiteVisuals({
                        ...siteVisuals,
                        watchReelThumbnail: url,
                      });
                      showToast('Showreel thumbnail image updated');
                    }}
                    presetOptions={PRESET_IMAGES}
                    recommendedNotice="Displayed when visitors click the 'WATCH STUDIO TRAILER' banner."
                  />
                </div>

                {/* 3. Our Story Inside the Studio Image */}
                <div className="space-y-2 pt-6 border-t border-white/10">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>3. Inside the Studio (Our Story) Squircle Image</span>
                    <span className="text-xs text-orange-400 font-mono">About Section</span>
                  </div>
                  <CMSMediaUploader
                    label="Studio Story Graphic"
                    mediaType="image"
                    currentUrl={siteVisuals.storyImage}
                    onMediaSelect={(url) => {
                      onUpdateSiteVisuals({
                        ...siteVisuals,
                        storyImage: url,
                      });
                      showToast('Story squircle image updated');
                    }}
                    presetOptions={PRESET_IMAGES}
                    recommendedNotice="Displayed in the large squircle frame beside 'One passion connects everything we make'."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: 3D MODEL LAB (Upload OBJ / FBX 3D files to inspect & interact) */}
          {activeTab === 'models-3d' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Studio 3D Model Lab &amp; Upload
                </h1>
                <p className="text-sm text-slate-400">
                  Upload your own 3D models (.OBJ, .FBX meshes) so clients and visitors can rotate, zoom, and inspect your 3D assets in real-time WebGL.
                </p>
              </div>

              {/* 3D Model Interactive Component */}
              <div className="bg-[#091b35] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <Model3DViewer
                  customObjContent={custom3DModel.dataUrlOrPath}
                  customModelName={custom3DModel.name}
                  onModelUploaded={(filename, content) => {
                    onUpdateCustom3DModel({
                      ...custom3DModel,
                      name: filename,
                      dataUrlOrPath: content,
                    });
                    showToast(`Uploaded and rendered 3D model: ${filename}`);
                  }}
                  showUploadButton={true}
                />

                <div className="p-4 bg-[#061224] border border-white/10 rounded-2xl text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>3D Model Capabilities:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Interactive Turntable:</strong> Click and drag to inspect in 360°, scroll mouse wheel or pinch to zoom.</li>
                    <li><strong className="text-slate-200">Supported Formats:</strong> Standard <code className="text-orange-300">.obj</code> 3D meshes (exportable from Blender, Maya, 3ds Max, ZBrush).</li>
                    <li><strong className="text-slate-200">PBR Studio Lighting:</strong> Rendered with physical materials, studio softboxes, and real-time reflections.</li>
                    <li><strong className="text-slate-200">Wireframe Mode:</strong> Click the topology button to inspect clean quad/triangle polygon edge flow.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BACKGROUND SONG & AUDIO UPLOAD */}
          {activeTab === 'audio' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Background Song &amp; Audio Lab
                </h1>
                <p className="text-sm text-slate-400">
                  Upload an audio track (MP3, WAV, OGG) to play softly in the background of your portfolio.
                </p>
              </div>


              <div className="bg-[#0b1d3a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Background Music Status</div>
                      <div className="text-xs text-slate-400">Control auto-play and loop behavior</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playTick();
                      onUpdateBgAudioConfig({
                        ...bgAudioConfig,
                        enabled: !bgAudioConfig.enabled,
                      });
                      showToast(bgAudioConfig.enabled ? 'Background music disabled' : 'Background music enabled');
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      bgAudioConfig.enabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {bgAudioConfig.enabled ? 'Enabled (Active)' : 'Disabled'}
                  </button>
                </div>

                {/* Media Uploader for Audio */}
                <CMSMediaUploader
                  label="Background Song File (MP3, WAV, OGG)"
                  mediaType="audio"
                  currentUrl={bgAudioConfig.audioUrl}
                  onMediaSelect={(url) => {
                    onUpdateBgAudioConfig({
                      ...bgAudioConfig,
                      audioUrl: url,
                    });
                    showToast('Audio track updated');
                  }}
                  presetOptions={PRESET_AUDIO_TRACKS.map((t) => ({ label: t.title, url: t.url }))}
                  recommendedNotice="Upload a cozy studio soundtrack or ambient ocean loop (under 12MB recommended)."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Track Title
                    </label>
                    <input
                      type="text"
                      value={bgAudioConfig.title}
                      onChange={(e) => onUpdateBgAudioConfig({ ...bgAudioConfig, title: e.target.value })}
                      placeholder="e.g. Ocean School Ambient"
                      className="w-full px-4 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Artist / Composer
                    </label>
                    <input
                      type="text"
                      value={bgAudioConfig.artist}
                      onChange={(e) => onUpdateBgAudioConfig({ ...bgAudioConfig, artist: e.target.value })}
                      placeholder="e.g. OVRStudio Sound Lab"
                      className="w-full px-4 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Default Volume Level ({Math.round(bgAudioConfig.volume * 100)}%)
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={bgAudioConfig.volume}
                    onChange={(e) => onUpdateBgAudioConfig({ ...bgAudioConfig, volume: parseFloat(e.target.value) })}
                    className="w-full accent-orange-500 cursor-pointer h-2 bg-white/10 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STORAGE & DEPLOYMENT GUIDE */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Storage &amp; Deployment Guide
                </h1>
                <p className="text-sm text-slate-400">
                  How your images, videos, and portfolio are stored and deployed to production.
                </p>
              </div>

              {/* Storage Overview */}
              <div className="bg-[#0b1d3a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-orange-400" />
                  <span>How Media Storage Works</span>
                </h3>
                
                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <p>
                    <strong>1. Cloudflare R2 Media Storage:</strong><br />
                    Uploaded images, gallery artwork, videos, audio, and 3D model files are sent to your Cloudflare Worker and stored in R2. The CMS saves only the public R2 URL, keeping large media files out of browser localStorage.
                  </p>

                  <p>
                    <strong>2. Upload security:</strong><br />
                    Uploads require the private Worker token and are validated server-side. Keep the token private; it is requested when you upload and retained only for the current browser tab session.
                  </p>
                  
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-300">
                    <li><strong className="text-white">Public delivery:</strong> Media URLs use your configured Cloudflare R2 public domain.</li>
                    <li><strong className="text-white">Cross-device use:</strong> Public URLs can be loaded by every visitor; CMS metadata still remains in the browser's localStorage.</li>
                  </ul>
                </div>

                {/* Backup & Export / Import */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      sound.playChime(640, 0.1);
                      const backupData = {
                        projects,
                        disciplines,
                        team,
                        collaborations,
                        bgAudioConfig,
                        exportedAt: new Date().toISOString(),
                      };
                      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ovr-studio-content-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Content backup downloaded');
                    }}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>

                  <label className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                    <UploadCloud className="w-4 h-4" />
                    <span>Restore from JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          try {
                            const data = JSON.parse(reader.result as string);
                            if (data.projects) onUpdateProjects(data.projects);
                            if (data.disciplines) onUpdateDisciplines(data.disciplines);
                            if (data.team) onUpdateTeam(data.team);
                            if (data.collaborations) onUpdateCollaborations(data.collaborations);
                            if (data.bgAudioConfig) onUpdateBgAudioConfig(data.bgAudioConfig);
                            showToast('Content restored from backup successfully!');
                          } catch {
                            alert('Invalid JSON file format.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (confirm('Reset all content back to factory studio defaults?')) {
                        sound.playTick();
                        onUpdateProjects(DEFAULT_PROJECTS);
                        onUpdateDisciplines(DEFAULT_DISCIPLINES);
                        onUpdateTeam(DEFAULT_TEAM);
                        onUpdateCollaborations(DEFAULT_COLLABORATIONS);
                        showToast('Reset to factory defaults');
                      }
                    }}
                    className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT PROJECT */}
      {(editingProject || isCreatingProject) && (
        <ProjectEditorModal
          project={editingProject}
          isCreating={isCreatingProject}
          onClose={() => {
            setEditingProject(null);
            setIsCreatingProject(false);
          }}
          onSave={(saved) => {
            if (isCreatingProject) {
              onUpdateProjects([saved, ...projects]);
              showToast('New project card created!');
            } else {
              onUpdateProjects(projects.map((p) => (p.id === saved.id ? saved : p)));
              showToast('Project card updated!');
            }
            setEditingProject(null);
            setIsCreatingProject(false);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT COLLABORATION */}
      {(editingCollaboration || isCreatingCollaboration) && (
        <CollaborationEditorModal
          collaboration={editingCollaboration}
          isCreating={isCreatingCollaboration}
          onClose={() => {
            setEditingCollaboration(null);
            setIsCreatingCollaboration(false);
          }}
          onSave={(saved) => {
            if (isCreatingCollaboration) {
              onUpdateCollaborations([saved, ...collaborations]);
              showToast('New collaboration card added!');
            } else {
              onUpdateCollaborations(collaborations.map((c) => (c.id === saved.id ? saved : c)));
              showToast('Collaboration card updated!');
            }
            setEditingCollaboration(null);
            setIsCreatingCollaboration(false);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT DISCIPLINE */}
      {(editingDiscipline || isCreatingDiscipline) && (
        <DisciplineEditorModal
          discipline={editingDiscipline}
          isCreating={isCreatingDiscipline}
          onClose={() => {
            setEditingDiscipline(null);
            setIsCreatingDiscipline(false);
          }}
          onSave={(saved) => {
            if (isCreatingDiscipline) {
              onUpdateDisciplines([...disciplines, saved]);
              showToast('New discipline card added!');
            } else {
              onUpdateDisciplines(disciplines.map((d) => (d.id === saved.id ? saved : d)));
              showToast('Discipline card updated!');
            }
            setEditingDiscipline(null);
            setIsCreatingDiscipline(false);
          }}
        />
      )}

      {/* MODAL: ADD / EDIT TEAM MEMBER */}
      {(editingTeamMember || isCreatingTeamMember) && (
        <TeamMemberEditorModal
          member={editingTeamMember}
          isCreating={isCreatingTeamMember}
          onClose={() => {
            setEditingTeamMember(null);
            setIsCreatingTeamMember(false);
          }}
          onSave={(saved) => {
            if (isCreatingTeamMember) {
              onUpdateTeam([...team, saved]);
              showToast('New team member added!');
            } else {
              onUpdateTeam(team.map((t) => (t.id === saved.id ? saved : t)));
              showToast('Team member updated!');
            }
            setEditingTeamMember(null);
            setIsCreatingTeamMember(false);
          }}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-MODAL: Project Editor with Direct Image & Video Upload
// -------------------------------------------------------------
interface ProjectEditorModalProps {
  project: Project | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  project,
  isCreating,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(project?.title || '');
  const [client, setClient] = useState(project?.client || '');
  const [category, setCategory] = useState<Exclude<ProjectCategory, 'all'>>(project?.category || 'unity-game');
  const [categoryLabel, setCategoryLabel] = useState(project?.categoryLabel || 'Unity Indie Game');
  const [year, setYear] = useState(project?.year || '2026');
  const [subtitle, setSubtitle] = useState(project?.subtitle || '');
  const [summary, setSummary] = useState(project?.summary || '');
  const [story, setStory] = useState(project?.story || '');
  const [image, setImage] = useState(project?.image || PRESET_IMAGES[1].url);
  const [galleryImages, setGalleryImages] = useState<string[]>(project?.galleryImages || []);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(project?.videoPreviewUrl || '');
  const [deliverablesStr, setDeliverablesStr] = useState(project?.deliverables.join(', ') || '');
  const [toolsStr, setToolsStr] = useState(project?.toolsUsed.join(', ') || '');

  // 3D Model state for this project
  const [has3D, setHas3D] = useState<boolean>(Boolean(project?.model3D));
  const [model3DName, setModel3DName] = useState<string>(project?.model3D?.name || 'Project 3D Model');
  const [model3DData, setModel3DData] = useState<string>(project?.model3D?.dataUrlOrPath || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(750, 0.15);

    const deliverables = deliverablesStr.split(',').map((s) => s.trim()).filter(Boolean);
    const toolsUsed = toolsStr.split(',').map((s) => s.trim()).filter(Boolean);

    const savedProject: Project = {
      id: project?.id || `proj-${Date.now()}`,
      title,
      client,
      category,
      categoryLabel,
      year,
      subtitle: subtitle || summary,
      summary,
      story: story || summary,
      deliverables: deliverables.length > 0 ? deliverables : ['Interactive Build', 'Source Code'],
      toolsUsed: toolsUsed.length > 0 ? toolsUsed : ['Unity', 'Blender'],
      highlights: project?.highlights || [
        { label: 'Platform', value: 'PC / Mobile' },
        { label: 'Rating', value: '4.9 ★' },
      ],
      quote: project?.quote,
      image,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      model3D: has3D ? {
        name: model3DName,
        format: 'obj',
        dataUrlOrPath: model3DData,
      } : undefined,
      videoPreviewUrl: videoPreviewUrl || undefined,
      videoDuration: project?.videoDuration || '0:45',
      featured: project?.featured ?? true,
    };

    onSave(savedProject);
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#091b35] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            {isCreating ? 'Create New Project Card' : `Edit: ${project?.title}`}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client / Studio *</label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as Exclude<ProjectCategory, 'all'>;
                  setCategory(val);
                  const labels: Record<string, string> = {
                    '3d-art': '3D Art',
                    '2d-art': '2D Art',
                    'graphic-design': 'Graphic Design',
                    'unity-game': 'Unity Game',
                    'ar-vr-mr': 'AR / VR / MR',
                  };
                  setCategoryLabel(labels[val] || val);
                }}
                className="w-full px-3 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="unity-game">Unity Game</option>
                <option value="3d-art">3D Art</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="ar-vr-mr">AR / VR / MR</option>
                <option value="2d-art">2D Art</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Label</label>
              <input
                type="text"
                value={categoryLabel}
                onChange={(e) => setCategoryLabel(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Short Summary *</label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Story &amp; Behind the Scenes</label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Direct Cover Image Upload */}
          <CMSMediaUploader
            label="Project Cover Image (Primary)"
            mediaType="image"
            currentUrl={image}
            onMediaSelect={(url) => setImage(url)}
            presetOptions={PRESET_IMAGES}
            recommendedNotice="Upload an image file from your computer (JPG, PNG, WEBP) or enter a web link."
          />

          {/* Multiple Gallery Images Upload Feature as requested */}
          <div className="p-4 bg-[#061224] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-orange-400" />
                  <span>Additional Project Gallery Images ({galleryImages.length})</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Upload several screenshots, sketches, or artwork slides for this project.
                </div>
              </div>

              <label className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      sound.playTick();
                      const uploaded = await uploadFileToR2(file);
                      setGalleryImages([...galleryImages, uploaded.url]);
                      sound.playChime(750, 0.15);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Error uploading image');
                    }
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            {/* Gallery Thumbnails List */}
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {galleryImages.map((imgUrl, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/20 group/thumb bg-slate-900">
                    <img src={resolveAssetUrl(imgUrl)} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white opacity-80 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-white/5 rounded-xl text-center text-xs text-slate-400">
                No additional gallery images added yet. Click &ldquo;Add Image&rdquo; to upload more views.
              </div>
            )}
          </div>

          {/* Interactive 3D Model Attachment for this Project */}
          <div className="p-4 bg-[#061224] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Interactive 3D Model Attachment (.OBJ)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Attach a 3D model so clients can interactively rotate and inspect this project in 3D.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playTick();
                  setHas3D(!has3D);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  has3D ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {has3D ? '3D Model Attached (Active)' : '+ Enable 3D Viewer'}
              </button>
            </div>

            {has3D && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    3D Model Asset Name
                  </label>
                  <input
                    type="text"
                    value={model3DName}
                    onChange={(e) => setModel3DName(e.target.value)}
                    placeholder="e.g. Subsea Diver High-Poly Model"
                    className="w-full px-3 py-2 bg-[#091b35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                    <Upload className="w-3.5 h-3.5 text-white" />
                    <span>Upload 3D File (.OBJ)</span>
                    <input
                      type="file"
                      accept=".obj"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          sound.playTick();
                          const uploaded = await uploadFileToR2(file);
                          setModel3DData(uploaded.url);
                          setModel3DName(file.name);
                          sound.playChime(750, 0.15);
                        } catch {
                          alert('Failed to upload 3D file');
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {model3DData ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Custom .OBJ stored in R2</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Using standard studio 3D diorama preset
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Direct Video Preview Upload */}
          <CMSMediaUploader
            label="Short Video Preview (MP4/WebM)"
            mediaType="video"
            currentUrl={videoPreviewUrl}
            onMediaSelect={(url) => setVideoPreviewUrl(url)}
            recommendedNotice="Upload a short gameplay reel, 3D turntable, or looping trailer (under 12MB recommended)."
          />


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deliverables (comma-separated)</label>
              <input
                type="text"
                value={deliverablesStr}
                onChange={(e) => setDeliverablesStr(e.target.value)}
                placeholder="Unity Playable Build, 3D Models, Sound FX"
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tools Used (comma-separated)</label>
              <input
                type="text"
                value={toolsStr}
                onChange={(e) => setToolsStr(e.target.value)}
                placeholder="Unity 6, Blender, Substance 3D, Figma"
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isCreating ? 'Create Project Card' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-MODAL: Collaboration Editor with Photo Upload
// -------------------------------------------------------------
interface CollaborationEditorModalProps {
  collaboration: CollaborationItem | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: (collaboration: CollaborationItem) => void;
}

const CollaborationEditorModal: React.FC<CollaborationEditorModalProps> = ({
  collaboration,
  isCreating,
  onClose,
  onSave,
}) => {
  const [clientName, setClientName] = useState(collaboration?.clientName || '');
  const [clientRole, setClientRole] = useState(collaboration?.clientRole || '');
  const [projectOrCompany, setProjectOrCompany] = useState(collaboration?.projectOrCompany || '');
  const [quote, setQuote] = useState(collaboration?.quote || '');
  const [badge, setBadge] = useState(collaboration?.badge || 'Friendly collaboration');
  const [avatarUrl, setAvatarUrl] = useState(collaboration?.avatarUrl || '');
  const [year, setYear] = useState(collaboration?.year || '2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(750, 0.15);

    const saved: CollaborationItem = {
      id: collaboration?.id || `collab-${Date.now()}`,
      clientName,
      clientRole,
      projectOrCompany,
      quote,
      badge,
      avatarUrl: avatarUrl || undefined,
      year,
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#091b35] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            {isCreating ? 'Add Friendly Collaboration Card' : `Edit: ${collaboration?.clientName}`}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Partner / Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Title *</label>
              <input
                type="text"
                required
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                placeholder="e.g. Executive Producer"
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Studio *</label>
              <input
                type="text"
                required
                value={projectOrCompany}
                onChange={(e) => setProjectOrCompany(e.target.value)}
                placeholder="e.g. Coral Reef Games"
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Tag</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Friendly collaboration"
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Collaboration Quote / Feedback *</label>
            <textarea
              required
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What they said about collaborating with OVRStudio..."
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Photo / Avatar Upload */}
          <CMSMediaUploader
            label="Client / Partner Photo Upload"
            mediaType="image"
            currentUrl={avatarUrl}
            onMediaSelect={(url) => setAvatarUrl(url)}
            presetOptions={PRESET_IMAGES}
            recommendedNotice="Upload a portrait photo or company logo."
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isCreating ? 'Add Collaboration' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-MODAL: Discipline Editor Modal
// -------------------------------------------------------------
interface DisciplineEditorModalProps {
  discipline: DisciplineItem | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: (discipline: DisciplineItem) => void;
}

const DisciplineEditorModal: React.FC<DisciplineEditorModalProps> = ({
  discipline,
  isCreating,
  onClose,
  onSave,
}) => {
  const [tag, setTag] = useState(discipline?.tag || 'DISCIPLINE');
  const [title, setTitle] = useState(discipline?.title || '');
  const [description, setDescription] = useState(discipline?.description || '');
  const [whatWeMakeStr, setWhatWeMakeStr] = useState(discipline?.whatWeMake.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(750, 0.15);

    const whatWeMake = whatWeMakeStr.split(',').map((s) => s.trim()).filter(Boolean);

    const saved: DisciplineItem = {
      id: discipline?.id || `disc-${Date.now()}`,
      tag,
      title,
      iconName: discipline?.iconName || 'Box',
      description,
      whatWeMake: whatWeMake.length > 0 ? whatWeMake : ['3D Assets', 'Visuals'],
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#091b35] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            {isCreating ? 'Create Discipline Card' : `Edit: ${discipline?.title}`}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tag</label>
            <input
              type="text"
              required
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">What We Make (comma-separated)</label>
            <input
              type="text"
              value={whatWeMakeStr}
              onChange={(e) => setWhatWeMakeStr(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Discipline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-MODAL: Team Member Editor with Photo Upload
// -------------------------------------------------------------
interface TeamMemberEditorModalProps {
  member: TeamMember | null;
  isCreating: boolean;
  onClose: () => void;
  onSave: (member: TeamMember) => void;
}

const TeamMemberEditorModal: React.FC<TeamMemberEditorModalProps> = ({
  member,
  isCreating,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [discipline, setDiscipline] = useState(member?.discipline || 'Unity & Gameplay');
  const [bio, setBio] = useState(member?.bio || '');
  const [avatar, setAvatar] = useState(member?.avatar || PRESET_IMAGES[4].url);
  const [favoriteTool, setFavoriteTool] = useState(member?.favoriteTool || 'Blender + Unity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(750, 0.15);

    const saved: TeamMember = {
      id: member?.id || `team-${Date.now()}`,
      name,
      role,
      discipline,
      bio,
      avatar,
      favoriteTool,
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#091b35] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            {isCreating ? 'Add Team Member' : `Edit: ${member?.name}`}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Discipline</label>
              <input
                type="text"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Favorite Tool</label>
              <input
                type="text"
                value={favoriteTool}
                onChange={(e) => setFavoriteTool(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#061224] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Direct Avatar Photo Upload */}
          <CMSMediaUploader
            label="Team Member Portrait Upload"
            mediaType="image"
            currentUrl={avatar}
            onMediaSelect={(url) => setAvatar(url)}
            presetOptions={PRESET_IMAGES}
            recommendedNotice="Upload a portrait photo from your computer."
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
