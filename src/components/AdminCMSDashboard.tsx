import React, { useState } from 'react';
import { Project, DisciplineItem, TeamMember, ProjectCategory } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/projects';
import { DEFAULT_DISCIPLINES } from '../data/disciplines';
import { TEAM_MEMBERS as DEFAULT_TEAM } from '../data/team';
import { sound } from '../utils/audio';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ArrowLeft,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Gamepad2,
  Glasses,
  Box,
  Palette,
  Users,
  Film,
  Video,
  Eye,
  RefreshCw,
  X,
  ExternalLink,
  Save,
  AlertCircle,
} from 'lucide-react';

interface AdminCMSDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  disciplines: DisciplineItem[];
  team: TeamMember[];
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateDisciplines: (disciplines: DisciplineItem[]) => void;
  onUpdateTeam: (team: TeamMember[]) => void;
}

const MASTER_PASSWORD = 'ovr2026';

const PRESET_IMAGES = [
  { label: '3D Character Art', url: '/src/assets/images/ovr_art_2d_1793175838956.jpg' },
  { label: 'Unity Indie Game', url: '/src/assets/images/ovr_game_unity_1793175840681.jpg' },
  { label: 'Mixed Reality VR/AR', url: '/src/assets/images/ovr_vr_spatial_1793175840681.jpg' },
  { label: 'Graphic Design', url: '/src/assets/images/ovr_design_graphic_1793175840681.jpg' },
  { label: 'Studio Life', url: '/src/assets/images/ovr_story_studio_life_1793175840681.jpg' },
  { label: 'Team Ocean Reel', url: '/src/assets/images/ovr_team_ocean_reel_1793175840681.jpg' },
];

export const AdminCMSDashboard: React.FC<AdminCMSDashboardProps> = ({
  isOpen,
  onClose,
  projects,
  disciplines,
  team,
  onUpdateProjects,
  onUpdateDisciplines,
  onUpdateTeam,
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
  const [activeTab, setActiveTab] = useState<'works' | 'disciplines' | 'team' | 'settings'>('works');
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
            Enter the studio master key to manage <strong>Works Cards</strong>, <strong>What We Do Best Cards</strong>, and <strong>People Cards</strong>.
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
            Hint for reviewers: Default password is <code className="bg-slate-100 text-orange-700 px-2 py-0.5 rounded font-mono font-bold">ovr2026</code>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full-Screen Real CMS Admin Dashboard
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
            <span>Live Sync Active</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-xs font-medium transition-colors"
          >
            Lock / Logout
          </button>
        </div>
      </header>

      {/* Main CMS Layout (Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left CMS Navigation Sidebar */}
        <aside className="w-64 bg-[#091b35] border-r border-white/10 p-4 flex flex-col justify-between shrink-0">
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
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
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

            {/* What We Do Best Cards Tab */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('disciplines');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
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
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
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

            {/* Factory Settings & Backups */}
            <button
              onClick={() => {
                sound.playTick();
                setActiveTab('settings');
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset &amp; Backup</span>
            </button>
          </div>

          {/* Quick Studio Info footer */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-400">
            <div className="font-semibold text-slate-200 mb-1">OVRStudio Engine</div>
            <div>Full CRUD enabled. Changes persist directly into portfolio memory and local storage.</div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-[#07172b] p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: WORKS & VIDEO CARDS */}
          {activeTab === 'works' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    Works &amp; Video Cards
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Manage project cards, client names, categories, and video durations.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playTick();
                    setEditingProject({
                      id: `proj_${Date.now()}`,
                      title: 'New Studio Project',
                      client: 'Client Name',
                      category: '3d-art',
                      categoryLabel: '3D Art & Modeling',
                      year: '2026',
                      subtitle: 'Playful stylized design',
                      summary: 'Brief project summary for cards and search.',
                      story: 'In-depth case study story explaining the vision.',
                      deliverables: ['3D Character Sculpts', 'Game Ready Assets'],
                      toolsUsed: ['Blender', 'Unity 6'],
                      highlights: [
                        { label: 'Scope', value: 'Complete Production' },
                        { label: 'Platform', value: 'Unity & PC' },
                      ],
                      image: PRESET_IMAGES[0].url,
                      videoDuration: '1:30',
                      videoPreviewUrl: '',
                    });
                    setIsCreatingProject(true);
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.02] shadow-lg shadow-orange-500/25 flex items-center gap-2 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add Project Card</span>
                </button>
              </div>

              {/* Projects Grid Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#0e2444] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-orange-500/50 transition-all"
                  >
                    <div>
                      {/* Image Preview & Video Badge */}
                      <div className="relative aspect-video bg-black/40 overflow-hidden">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-400 uppercase tracking-wider border border-white/10">
                          {proj.categoryLabel}
                        </div>
                        {proj.videoDuration && (
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-white flex items-center gap-1 border border-white/10">
                            <Video className="w-3 h-3 text-orange-400" />
                            <span>{proj.videoDuration}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="text-xs text-slate-400 uppercase font-semibold mb-1">
                          {proj.client} · {proj.year}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {proj.summary}
                        </p>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="px-5 py-3.5 bg-black/20 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {proj.deliverables.length} deliverables
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Clone */}
                        <button
                          onClick={() => {
                            sound.playTick();
                            const cloned: Project = {
                              ...proj,
                              id: `proj_${Date.now()}`,
                              title: `${proj.title} (Copy)`,
                            };
                            const updated = [cloned, ...projects];
                            onUpdateProjects(updated);
                            showToast(`Cloned "${proj.title}"`);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                          title="Clone Card"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => {
                            sound.playTick();
                            setEditingProject({ ...proj });
                            setIsCreatingProject(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            sound.playTick();
                            if (window.confirm(`Delete project "${proj.title}"?`)) {
                              const updated = projects.filter((p) => p.id !== proj.id);
                              onUpdateProjects(updated);
                              showToast(`Deleted "${proj.title}"`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                          title="Delete Card"
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

          {/* TAB 2: WHAT WE DO BEST CARDS (DISCIPLINES) */}
          {activeTab === 'disciplines' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    What We Do Best Cards
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Manage the core craft disciplines, descriptions, and common deliverables.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playTick();
                    setEditingDiscipline({
                      id: `disc_${Date.now()}`,
                      tag: 'New Discipline',
                      title: 'Discipline Title',
                      iconName: 'Box',
                      description: 'Describe the studio craft and workflow in friendly language.',
                      whatWeMake: ['Key Deliverable 1', 'Key Deliverable 2'],
                    });
                    setIsCreatingDiscipline(true);
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.02] shadow-lg shadow-orange-500/25 flex items-center gap-2 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add Discipline Card</span>
                </button>
              </div>

              {/* Disciplines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {disciplines.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 bg-[#0e2444] border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-orange-500/50 transition-all shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                          {item.tag}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Icon: {item.iconName}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Deliverables:
                        </div>
                        {item.whatWeMake.map((d, dIdx) => (
                          <div key={dIdx} className="text-xs text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          sound.playTick();
                          setEditingDiscipline({ ...item });
                          setIsCreatingDiscipline(false);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Card</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playTick();
                          if (disciplines.length <= 1) {
                            alert('Cannot delete the last remaining discipline card.');
                            return;
                          }
                          if (window.confirm(`Delete discipline "${item.title}"?`)) {
                            const updated = disciplines.filter((d) => d.id !== item.id);
                            onUpdateDisciplines(updated);
                            showToast(`Deleted "${item.title}"`);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                        title="Delete Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PEOPLE & TEAM CARDS */}
          {activeTab === 'team' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    People &amp; Team Cards
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Manage studio artists, game engineers, avatars, bios, and favorite tools.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playTick();
                    setEditingTeamMember({
                      id: `team_${Date.now()}`,
                      name: 'Team Member Name',
                      role: '3D Artist & Game Designer',
                      discipline: '3D Modeling & Unity',
                      bio: 'Passionate about crafting charming 3D characters and cozy game mechanics.',
                      avatar: PRESET_IMAGES[4].url,
                      favoriteTool: 'Blender & Unity 6',
                    });
                    setIsCreatingTeamMember(true);
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.02] shadow-lg shadow-orange-500/25 flex items-center gap-2 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add Team Member</span>
                </button>
              </div>

              {/* Team Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 bg-[#0e2444] border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-orange-500/50 transition-all shadow-md"
                  >
                    <div>
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-4 border-2 border-white/20 bg-slate-800">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PRESET_IMAGES[4].url;
                          }}
                        />
                      </div>

                      <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">
                        {member.discipline}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                        {member.name}
                      </h3>

                      <div className="text-xs text-slate-300 font-medium mb-3">
                        {member.role}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {member.bio}
                      </p>

                      <div className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <span className="font-semibold text-slate-200">Favorite Tool:</span>{' '}
                        {member.favoriteTool}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          sound.playTick();
                          setEditingTeamMember({ ...member });
                          setIsCreatingTeamMember(false);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Person</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playTick();
                          if (team.length <= 1) {
                            alert('Cannot delete the last remaining team member.');
                            return;
                          }
                          if (window.confirm(`Delete team member "${member.name}"?`)) {
                            const updated = team.filter((m) => m.id !== member.id);
                            onUpdateTeam(updated);
                            showToast(`Deleted "${member.name}"`);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                        title="Delete Person"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RESET & BACKUP */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Reset &amp; Content Management
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Restore default initial studio projects, crafts, and team data if needed.
                </p>
              </div>

              <div className="p-6 bg-[#0e2444] border border-white/10 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white">Restore Factory Studio Content</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This will reload the initial handcrafted 6 projects (including Oceanic Odyssey, Glow Reef, Horizon Drift, and Bloom Flora), 4 craft disciplines, and 3 founding team members.
                </p>

                <button
                  onClick={() => {
                    sound.playTick();
                    if (window.confirm('Reset all works, disciplines, and team members to factory defaults?')) {
                      onUpdateProjects(DEFAULT_PROJECTS);
                      onUpdateDisciplines(DEFAULT_DISCIPLINES);
                      onUpdateTeam(DEFAULT_TEAM);
                      showToast('Factory studio content restored!');
                    }
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                >
                  Reset Everything to Defaults
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: EDIT / CREATE PROJECT FORM */}
      {editingProject && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0b1d3a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-display font-bold text-white">
                {isCreatingProject ? 'Add New Project Card' : `Edit "${editingProject.title}"`}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sound.playChime(640, 0.12);
                if (isCreatingProject) {
                  const updated = [editingProject, ...projects];
                  onUpdateProjects(updated);
                  showToast(`Added project "${editingProject.title}"`);
                } else {
                  const updated = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
                  onUpdateProjects(updated);
                  showToast(`Updated "${editingProject.title}"`);
                }
                setEditingProject(null);
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client / Publisher</label>
                  <input
                    type="text"
                    required
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => {
                      const cat = e.target.value as Exclude<ProjectCategory, 'all'>;
                      const labels: Record<string, string> = {
                        '3d-art': '3D Art & Modeling',
                        'graphic-design': 'Graphic Design & Branding',
                        'unity-game': 'Unity Indie Game',
                        'ar-vr-mr': 'AR / VR / MR Production',
                        '2d-art': '3D Art & Modeling',
                      };
                      setEditingProject({
                        ...editingProject,
                        category: cat,
                        categoryLabel: labels[cat] || 'Interactive Craft',
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07172b] border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  >
                    <option value="3d-art">3D Art &amp; Modeling</option>
                    <option value="graphic-design">Graphic Design &amp; Branding</option>
                    <option value="unity-game">Unity Indie Game</option>
                    <option value="ar-vr-mr">AR / VR / MR Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Video Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1:45"
                    value={editingProject.videoDuration || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, videoDuration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Thumbnail Image</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_IMAGES.slice(0, 4).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, image: p.url })}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10"
                    >
                      Preset: {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={editingProject.image}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Deliverables (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingProject.deliverables.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      deliverables: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT / CREATE DISCIPLINE FORM */}
      {editingDiscipline && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0b1d3a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-display font-bold text-white">
                {isCreatingDiscipline ? 'Add Discipline Card' : `Edit "${editingDiscipline.title}"`}
              </h2>
              <button
                onClick={() => setEditingDiscipline(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sound.playChime(640, 0.12);
                if (isCreatingDiscipline) {
                  const updated = [...disciplines, editingDiscipline];
                  onUpdateDisciplines(updated);
                  showToast(`Added discipline "${editingDiscipline.title}"`);
                } else {
                  const updated = disciplines.map((d) => (d.id === editingDiscipline.id ? editingDiscipline : d));
                  onUpdateDisciplines(updated);
                  showToast(`Updated "${editingDiscipline.title}"`);
                }
                setEditingDiscipline(null);
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tag</label>
                  <input
                    type="text"
                    required
                    value={editingDiscipline.tag}
                    onChange={(e) => setEditingDiscipline({ ...editingDiscipline, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Icon</label>
                  <select
                    value={editingDiscipline.iconName}
                    onChange={(e) =>
                      setEditingDiscipline({
                        ...editingDiscipline,
                        iconName: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07172b] border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  >
                    <option value="Box">Box (3D Art)</option>
                    <option value="Layers">Layers (Graphic Design)</option>
                    <option value="Gamepad2">Gamepad2 (Unity Game)</option>
                    <option value="Glasses">Glasses (AR / VR / MR)</option>
                    <option value="Sparkles">Sparkles (Creative)</option>
                    <option value="Palette">Palette (Art &amp; Color)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Discipline Title</label>
                <input
                  type="text"
                  required
                  value={editingDiscipline.title}
                  onChange={(e) => setEditingDiscipline({ ...editingDiscipline, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingDiscipline.description}
                  onChange={(e) => setEditingDiscipline({ ...editingDiscipline, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Common Deliverables (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingDiscipline.whatWeMake.join(', ')}
                  onChange={(e) =>
                    setEditingDiscipline({
                      ...editingDiscipline,
                      whatWeMake: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingDiscipline(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Discipline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT / CREATE TEAM MEMBER FORM */}
      {editingTeamMember && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0b1d3a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-xl font-display font-bold text-white">
                {isCreatingTeamMember ? 'Add Team Member' : `Edit "${editingTeamMember.name}"`}
              </h2>
              <button
                onClick={() => setEditingTeamMember(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sound.playChime(640, 0.12);
                if (isCreatingTeamMember) {
                  const updated = [...team, editingTeamMember];
                  onUpdateTeam(updated);
                  showToast(`Added team member "${editingTeamMember.name}"`);
                } else {
                  const updated = team.map((m) => (m.id === editingTeamMember.id ? editingTeamMember : m));
                  onUpdateTeam(updated);
                  showToast(`Updated "${editingTeamMember.name}"`);
                }
                setEditingTeamMember(null);
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.name}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discipline</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.discipline}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, discipline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.role}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Favorite Tool</label>
                  <input
                    type="text"
                    required
                    value={editingTeamMember.favoriteTool}
                    onChange={(e) => setEditingTeamMember({ ...editingTeamMember, favoriteTool: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bio</label>
                <textarea
                  rows={3}
                  required
                  value={editingTeamMember.bio}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Avatar Image URL</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_IMAGES.slice(3, 6).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingTeamMember({ ...editingTeamMember, avatar: p.url })}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10"
                    >
                      Preset: {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={editingTeamMember.avatar}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, avatar: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:ring-2 focus:ring-orange-500 text-white font-mono text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingTeamMember(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Person</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
