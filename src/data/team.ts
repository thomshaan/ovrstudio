import { TeamMember } from '../types';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'thomas-director',
    name: 'Thomas S.',
    role: 'Studio Founder & Creative Director',
    discipline: 'Unity Games & Game Design',
    bio: 'Leads game direction and spatial storytelling at OVRStudio. Lifelong indie game player who loves building cozy game mechanics, responsive physics, and joyful virtual worlds.',
    avatar: 'assets/images/ovr_team_founder_1793177349401.jpg',
    favoriteTool: 'Unity 6 & C#',
  },
  {
    id: 'elena-2d-artist',
    name: 'Elena Rostova',
    role: 'Lead 2D Artist & Illustrator',
    discipline: 'Character Design & Storybook Art',
    bio: 'Brings characters to life with warm painted textures and expressive silhouettes. Specializes in children storybook art, concept model sheets, and frame-by-frame 2D animation.',
    avatar: 'assets/images/ovr_team_lead_artist_1793177349612.jpg',
    favoriteTool: 'Procreate & Clip Studio',
  },
  {
    id: 'marcus-tech-art',
    name: 'Marcus Vance',
    role: 'Unity Technical Artist & Brand Designer',
    discipline: 'Graphic Design, Shaders & AR/VR',
    bio: 'Combines bold graphic typography with real-time liquid shaders. Builds interactive hand-tracking setups for Meta Quest 3 and Apple Vision Pro with zero motion sickness.',
    avatar: 'assets/images/ovr_team_tech_artist_1793177350136.jpg',
    favoriteTool: 'Unity XR & Illustrator',
  },
];
