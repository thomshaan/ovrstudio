export type ProjectCategory = 
  | 'all'
  | '3d-art'
  | '2d-art'
  | 'graphic-design'
  | 'unity-game'
  | 'ar-vr-mr';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  year: string;
  subtitle: string;
  summary: string;
  story: string;
  deliverables: string[];
  toolsUsed: string[];
  highlights: {
    label: string;
    value: string;
  }[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  image: string;
  videoPreviewUrl?: string;
  videoDuration?: string;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  discipline: string;
  bio: string;
  avatar: string;
  favoriteTool: string;
}

export interface DisciplineItem {
  id: string;
  tag: string;
  title: string;
  iconName: 'Box' | 'Layers' | 'Gamepad2' | 'Glasses' | 'Sparkles' | 'Palette';
  description: string;
  whatWeMake: string[];
}

export type LiquidSceneMode = 'water-pearl' | 'deep-coral' | 'bioluminescent-jelly' | 'wave-torus';
export type OceanLightingTheme = 'deep-trench' | 'sunlit-shallows' | 'bioluminescent-night';
