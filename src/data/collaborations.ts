import { CollaborationItem } from '../types';

export const DEFAULT_COLLABORATIONS: CollaborationItem[] = [
  {
    id: 'collab-1',
    clientName: 'Maya Lin',
    clientRole: 'Executive Producer',
    projectOrCompany: 'Coral Reef Games',
    quote: 'OVRStudio made our dream ocean game feel cozy, playful, and alive. They listen carefully, work fast, and bring pure artistic passion to every single frame.',
    badge: 'Game Co-Production',
    avatarUrl: '/src/assets/images/ovr_story_studio_life_1793175840681.jpg',
    year: '2026',
  },
  {
    id: 'collab-2',
    clientName: 'Dr. Aris Thorne',
    clientRole: 'Head of Marine Education',
    projectOrCompany: 'Ocean Horizon Institute',
    quote: 'The interactive 3D marine simulations they developed for our student exhibits captivated tens of thousands of visitors. Their understanding of spatial depth and tactile feedback is unmatched.',
    badge: 'Spatial AR & VR',
    avatarUrl: '/src/assets/images/ovr_vr_spatial_1793175840681.jpg',
    year: '2025',
  },
  {
    id: 'collab-3',
    clientName: 'Kenji Sato',
    clientRole: 'Art Director',
    projectOrCompany: 'Starlight Indie Collective',
    quote: 'Working alongside OVRStudio on character visual identities was seamless. Their stylized 3D sculpts and fluid color palettes transformed our indie universe into something magical.',
    badge: '3D Art & Characters',
    avatarUrl: '/src/assets/images/ovr_art_2d_1793175838956.jpg',
    year: '2025',
  },
];
