import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../types';
import { X, Plus, Edit2, Trash2, Video, Image as ImageIcon, Save, CheckCircle2, Lock, Unlock, Eye, EyeOff, Key, Copy } from 'lucide-react';
import { sound } from '../utils/audio';
import { resolveAssetUrl } from '../utils/assets';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onProjectCreated: (newProj: Project) => void;
  onProjectUpdated: (updatedProj: Project) => void;
  onProjectDeleted: (id: string) => void;
}

const DEFAULT_PASSWORD = 'ovr2026';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  projects,
  onProjectCreated,
  onProjectUpdated,
  onProjectDeleted,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ovr_admin_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (sessionStorage.getItem('ovr_admin_unlocked') === 'true') {
      setIsAuthenticated(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === DEFAULT_PASSWORD) {
      sound.playChime(760, 0.2);
      setIsAuthenticated(true);
      sessionStorage.setItem('ovr_admin_unlocked', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      sound.playTick();
      setAuthError('Incorrect studio password. Default password is: ovr2026');
    }
  };

  const handleLogout = () => {
    sound.playTick();
    setIsAuthenticated(false);
    sessionStorage.removeItem('ovr_admin_unlocked');
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    sound.playTick();
    setIsCreating(true);
    setEditingProject({
      title: '',
      client: '',
      category: 'unity-game',
      categoryLabel: 'Unity Game',
      year: new Date().getFullYear().toString(),
      subtitle: '',
      summary: '',
      story: '',
      image: '/src/assets/images/ovr_game_unity_1793175840681.jpg',
      videoDuration: '0:30',
      deliverables: ['Production Prototype', 'Interactive 3D Assets'],
      toolsUsed: ['Unity 6', 'Blender', 'Photoshop'],
      highlights: [
        { label: 'Release', value: '2026' },
        { label: 'Performance', value: '60 FPS' },
      ],
    });
  };

  const handleStartEdit = (proj: Project) => {
    sound.playTick();
    setIsCreating(false);
    setEditingProject({ ...proj });
  };

  const handleDuplicate = (proj: Project) => {
    sound.playTick();
    const cloned: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      title: `${proj.title} (Copy)`,
    };
    onProjectCreated(cloned);
    setSuccessMessage(`Duplicated "${proj.title}"`);
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the card for "${title}"?`)) return;
    sound.playTick();
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    } catch {
      // Offline fallback
    }
    onProjectDeleted(id);
    setSuccessMessage('Project card removed successfully.');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;
    setLoading(true);
    sound.playChime(700, 0.15);

    const categoryLabels: Record<string, string> = {
      '3d-art': '3D Art & Modeling',
      '2d-art': '3D Art & Modeling',
      'graphic-design': 'Graphic Design',
      'unity-game': 'Unity Game',
      'ar-vr-mr': 'AR / VR / MR',
    };

    const finalPayload: Project = {
      id: editingProject.id || `proj-${Date.now()}`,
      title: editingProject.title || 'Untitled Project',
      client: editingProject.client || 'OVRStudio Production',
      category: (editingProject.category as Project['category']) || 'unity-game',
      categoryLabel: categoryLabels[editingProject.category || 'unity-game'] || 'Interactive Media',
      year: editingProject.year || new Date().getFullYear().toString(),
      subtitle: editingProject.subtitle || editingProject.summary || '',
      summary: editingProject.summary || '',
      story: editingProject.story || editingProject.summary || '',
      deliverables: editingProject.deliverables && editingProject.deliverables.length > 0
        ? editingProject.deliverables
        : ['Production Prototype', 'Creative Direction'],
      toolsUsed: editingProject.toolsUsed && editingProject.toolsUsed.length > 0
        ? editingProject.toolsUsed
        : ['Unity 6', 'Blender'],
      highlights: editingProject.highlights || [{ label: 'Release', value: '2026' }],
      image: editingProject.image || '/src/assets/images/ovr_game_unity_1793175840681.jpg',
      videoDuration: editingProject.videoDuration || '0:30',
    };

    try {
      if (isCreating) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload),
        });
        onProjectCreated(finalPayload);
        setSuccessMessage('New project card added to studio!');
      } else {
        await fetch(`/api/projects/${finalPayload.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload),
        });
        onProjectUpdated(finalPayload);
        setSuccessMessage('Project card updated successfully!');
      }
    } catch {
      // Local storage fallback
      if (isCreating) {
        onProjectCreated(finalPayload);
      } else {
        onProjectUpdated(finalPayload);
      }
      setSuccessMessage('Card saved locally!');
    } finally {
      setLoading(false);
      setEditingProject(null);
      setIsCreating(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* ================= 1. PASSWORD AUTHENTICATION SCREEN ================= */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-orange-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/25">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0b1d3a] mb-2 tracking-tight">
              OVRStudio Admin Portal
            </h3>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Enter your studio password to add, modify, or delete project cards and video previews.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Studio Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter password..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-2xl text-sm text-slate-900 focus:outline-none pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Helper Hint */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Default studio password: <code className="font-bold bg-amber-100/80 px-1.5 py-0.5 rounded text-amber-950 font-sans">ovr2026</code>
                </span>
              </div>

              {authError && (
                <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                  {authError}
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4 text-white" />
                  <span>Unlock Admin</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= 2. AUTHENTICATED ADMIN MANAGER ================= */
          <>
            {/* Top Bar */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Unlock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Studio Admin Portal
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#0b1d3a]">
                    Manage Project Cards &amp; Short Videos
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!editingProject && (
                  <button
                    onClick={handleStartCreate}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Add Card / Video</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Lock Admin session"
                >
                  Lock
                </button>

                <button
                  onClick={() => {
                    sound.playTick();
                    onClose();
                  }}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-full bg-white hover:bg-slate-200 transition-colors shadow-xs"
                  aria-label="Close Manager"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Feedback message */}
            {successMessage && (
              <div className="bg-emerald-50 text-emerald-800 px-6 py-2.5 text-xs font-semibold flex items-center gap-2 border-b border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Content Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {editingProject ? (
                /* Edit / Create Form */
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-base font-bold text-[#0b1d3a]">
                      {isCreating ? 'Add New Project Card' : `Edit: ${editingProject.title}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="text-xs text-slate-500 hover:text-[#0b1d3a] font-semibold"
                    >
                      Cancel Editing
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. Lumina & The Wandering Ray"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Client or Publisher
                      </label>
                      <input
                        type="text"
                        value={editingProject.client || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        placeholder="e.g. Coral Reef Games"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category Craft
                      </label>
                      <select
                        value={editingProject.category || 'unity-game'}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Project['category'] })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 text-sm focus:outline-none bg-white font-sans"
                      >
                        <option value="unity-game">Unity Indie Games</option>
                        <option value="3d-art">3D Art &amp; Modeling</option>
                        <option value="graphic-design">Graphic Design &amp; Branding</option>
                        <option value="ar-vr-mr">AR / VR / MR Production</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Video Clip Duration
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editingProject.videoDuration || '0:30'}
                          onChange={(e) => setEditingProject({ ...editingProject, videoDuration: e.target.value })}
                          placeholder="0:30"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 text-sm focus:outline-none"
                        />
                        <Video className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Production Year
                      </label>
                      <input
                        type="text"
                        value={editingProject.year || '2026'}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Artwork / Poster Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Image / Video Poster
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {[
                        { label: 'Unity Game', url: '/src/assets/images/ovr_game_unity_1793175840681.jpg' },
                        { label: '3D Art Diorama', url: '/src/assets/images/ovr_art_2d_1793175838956.jpg' },
                        { label: 'AR/VR World', url: '/src/assets/images/ovr_vr_experience_1793175841126.jpg' },
                        { label: 'Graphic Design', url: '/src/assets/images/ovr_design_branding_1793175840098.jpg' },
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, image: preset.url })}
                          className={`text-xs p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                            editingProject.image === preset.url
                              ? 'border-orange-500 bg-orange-50 text-orange-800 font-semibold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={editingProject.image || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      placeholder="/src/assets/images/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Card Summary *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={editingProject.summary || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                      placeholder="One or two sentences summarizing the game, 3D world, or art..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Case Study Story
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.story || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, story: e.target.value })}
                      placeholder="The story of how you sculpted, coded, or designed it..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-colors"
                    >
                      <Save className="w-4 h-4 text-white" />
                      <span>{loading ? 'Saving...' : 'Save Card'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Projects Management Table */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Active studio cards ({projects.length}):</span>
                    <span>Click Edit or Add Card above to update the portfolio live</span>
                  </div>

                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-orange-300 transition-colors flex items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={resolveAssetUrl(proj.image)}
                          alt={proj.title}
                          className="w-16 h-12 object-cover rounded-xl bg-slate-100"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#0b1d3a]">
                            {proj.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {proj.categoryLabel} · Video: {proj.videoDuration || '0:30'} · {proj.client}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDuplicate(proj)}
                          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors text-xs"
                          title="Duplicate card"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                        </button>

                        <button
                          onClick={() => handleStartEdit(proj)}
                          className="p-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors text-xs font-semibold flex items-center gap-1"
                          title="Edit project card"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-orange-600" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(proj.id, proj.title)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Protected Studio CMS (Password: ovr2026)</span>
              </span>
              <button
                onClick={() => {
                  sound.playTick();
                  onClose();
                }}
                className="font-bold text-[#0b1d3a] hover:underline"
              >
                Done Managing
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
