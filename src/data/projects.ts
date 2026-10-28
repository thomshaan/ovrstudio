import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'luminous-depths-game',
    title: 'Lumina & The Wandering Ray',
    client: 'Coral Reef Games',
    category: 'unity-game',
    categoryLabel: 'Unity Game',
    year: '2026',
    subtitle: 'Cozy underwater exploration game built in Unity 6 for PC & Nintendo Switch',
    summary: 'A peaceful deep-sea submarine game where players befriend glowing marine creatures, solve ancient reef puzzles, and bring warmth back to the ocean floor.',
    story: 'We designed the entire visual identity and Unity game experience from scratch. Our artists drew hand-crafted 2D concept art, built playful stylized 3D models with soft lighting shaders in Unity, and composed adaptive audio that reacts whenever a gentle manta ray swims alongside your submarine.',
    deliverables: ['Full Unity 6 Game Prototype', 'Stylized 3D Submarine & Reef Assets', 'Underwater Particle & Bubble VFX', 'Original Adaptive Soundtrack'],
    toolsUsed: ['Unity 6', 'C# Scripting', 'Blender', 'Procreate', 'FMOD Audio'],
    highlights: [
      { label: 'Steam Wishlists', value: '85,000+' },
      { label: 'Target Frame Rate', value: 'Smooth 60 FPS' },
      { label: 'Indie Game Fest', value: 'Best Visual Design' }
    ],
    quote: {
      text: 'OVRStudio made our dream ocean game feel cozy, playful, and alive. Every single creature moves with genuine joy and gentle charm.',
      author: 'Maya Lin',
      role: 'Game Producer, Coral Reef Games'
    },
    image: '/src/assets/images/ovr_game_unity_1793175840681.jpg',
    videoDuration: '0:34',
    featured: true,
  },
  {
    id: 'subsea-explorer-3d',
    title: 'Tales of the Tide Diver',
    client: 'Blue Horizon Publishing',
    category: '3d-art',
    categoryLabel: '3D Art',
    year: '2026',
    subtitle: 'Stylized 3D character models, oceanic environments, and interactive dioramas',
    summary: 'A series of stylized 3D character sculpts and underwater dioramas celebrating deep-sea explorers with custom hand-painted textures.',
    story: 'We sculpted and modeled over 20 stylized 3D ocean character models and interactive aquarium dioramas. Our team focused on expressive silhouettes, optimized polygon topologies, and soft subsurface scattering shaders for bioluminescent marine companions.',
    deliverables: ['Stylized 3D Character Rigs', 'Underwater Diorama Environments', 'PBR & Hand-Painted Textures', 'Turnaround Model Sheets'],
    toolsUsed: ['Blender 4.2', 'ZBrush', 'Substance 3D Painter', 'Unity Shader Graph'],
    highlights: [
      { label: '3D Characters Modeled', value: '24 Heroes' },
      { label: 'Art Direction Honors', value: '3D Artist of the Year' },
      { label: 'Topology Standard', value: 'Game-Ready Clean Quads' }
    ],
    quote: {
      text: 'The personality and detail in these 3D characters is breathtaking. OVRStudio turned our illustrations into real living 3D models.',
      author: 'Julian Thorne',
      role: 'Creative Director, Blue Horizon'
    },
    image: '/src/assets/images/ovr_art_2d_1793175838956.jpg',
    videoDuration: '0:26',
    featured: true,
  },
  {
    id: 'abyssal-ocean-vr',
    title: 'Ocean Echoes Spatial VR',
    client: 'National Maritime Science Center',
    category: 'ar-vr-mr',
    categoryLabel: 'AR / VR / MR',
    year: '2025',
    subtitle: 'Hands-on mixed reality headset experience where guests physically touch deep-sea life',
    summary: 'An immersive Quest 3 and Apple Vision Pro mixed reality experience for museum visitors, blending real room floors with swimming virtual marine life.',
    story: 'Museum visitors put on a lightweight headset and suddenly see their physical museum room fill with transparent water, glowing anemones, and swimming fish. Using natural hand tracking with zero physical controllers, players can gently hold out their hands to guide schools of fish.',
    deliverables: ['Unity XR / OpenXR Production', 'Intuitive Hand-Tracking Controls', 'Spatial Audio Field Mapping', 'Museum Kiosk Operator App'],
    toolsUsed: ['Unity XR', 'Meta Quest 3', 'Apple Vision Pro', 'Spatial Audio API', 'Blender'],
    highlights: [
      { label: 'Museum Visitors Tested', value: '120,000+' },
      { label: 'Zero Motion Sickness', value: '99.4% Comfort' },
      { label: 'Average Interaction Time', value: '14 Minutes' }
    ],
    quote: {
      text: 'Seeing kids and grandparents smile as schools of light-up fish swim around their physical hands was pure magic. Flawless VR craftsmanship.',
      author: 'Dr. Camille Fontaine',
      role: 'Director of Exhibitions'
    },
    image: '/src/assets/images/ovr_vr_experience_1793175841126.jpg',
    videoDuration: '0:42',
    featured: true,
  },
  {
    id: 'abyssal-currents-brand',
    title: 'Abyssal Currents Visual Identity',
    client: 'The Royal Maritime Museum',
    category: 'graphic-design',
    categoryLabel: 'Graphic Design',
    year: '2025',
    subtitle: 'Complete brand design system, fluid posters, typography, and exhibition signage',
    summary: 'An elegant graphic design and visual identity project combining fluid water wave graphics, custom typography, and tactile printed posters for a global exhibition.',
    story: 'To promote a major international deep-sea science showcase, we created a fluid visual identity inspired by oceanic wave currents. We crafted custom liquid gradients, dynamic social motion posters, and physical signage that feels both scientific and artistic.',
    deliverables: ['Custom Wave Typography System', 'Printed Exhibition Posters & Banners', 'Interactive Digital Screen Graphics', 'Complete Brand Style Guide'],
    toolsUsed: ['Adobe Illustrator', 'InDesign', 'After Effects', 'Figma'],
    highlights: [
      { label: 'Exhibition Attendees', value: '250,000+' },
      { label: 'Poster Design Awards', value: 'Graphis Gold' },
      { label: 'Design Deliverables', value: '60+ Brand Assets' }
    ],
    quote: {
      text: 'The posters and fluid typography set the perfect tone for our museum. Clean, captivating, and impossible to walk past without looking twice.',
      author: 'Sarah Jenkins',
      role: 'Head of Communications, Maritime Museum'
    },
    image: '/src/assets/images/ovr_design_branding_1793175840098.jpg',
    videoDuration: '0:18',
    featured: false,
  },
  {
    id: 'coastal-observatory-3d',
    title: 'Seaside Pavilion Visualizer',
    client: 'Lumina Architecture Lab',
    category: 'unity-game',
    categoryLabel: 'Unity Game',
    year: '2025',
    subtitle: 'Interactive real-time 3D architectural walkthrough with peaceful ocean waves',
    summary: 'A playable real-time coastal pavilion where visitors can walk along glass bridges, listen to ocean waves, and watch changing day and night skies.',
    story: 'We built a smooth, peaceful real-time 3D walkthrough in Unity. Visitors can explore the structure with easy keyboard or touch controls, watching light reflect off sea water and hearing realistic shore sounds.',
    deliverables: ['Unity WebGL Real-time Player', 'Dynamic Sun & Water Waves Shader', 'Ambient Ocean Soundscape', 'Mobile Touch Support'],
    toolsUsed: ['Unity', 'Custom Water Shaders', 'Blender', 'Photoshop'],
    highlights: [
      { label: 'Runs in Any Browser', value: 'Instant Load' },
      { label: 'Frame Stability', value: 'Solid 60 FPS' },
      { label: 'Client Feedback', value: '100% Approval' }
    ],
    image: '/src/assets/images/ovr_project_lumina_1793175040059.jpg',
    videoDuration: '0:30',
    featured: false,
  },
  {
    id: 'kinetic-ocean-sculpture',
    title: 'Aether Tide Kinetic Sculpture',
    client: 'Aether Chrono Gallery',
    category: 'ar-vr-mr',
    categoryLabel: 'AR / VR / MR',
    year: '2024',
    subtitle: 'Physical kinetic sculpture with interactive AR companion mobile app',
    summary: 'A precision kinetic art piece that spins with the ocean tide, accompanied by an augmented reality app that lets visitors see digital light trails in the air.',
    story: 'We paired fine mechanical art with modern phone AR. When visitors point their phone or tablet at the spinning physical rings, the app reveals flowing water currents and sea ripples floating in the room around it.',
    deliverables: ['Mobile AR iOS/Android App', 'Real-time Ring Tracking', 'Liquid Particle Trails', 'Gallery Exhibition Signage'],
    toolsUsed: ['Unity AR Foundation', 'ARKit / ARCore', 'Blender', 'Cinema 4D'],
    highlights: [
      { label: 'Gallery Visitors', value: '45,000+' },
      { label: 'App Store Rating', value: '4.9 / 5.0' },
      { label: 'Featured in', value: 'Creative Review' }
    ],
    image: '/src/assets/images/ovr_project_aether_1793175040559.jpg',
    videoDuration: '0:22',
    featured: false,
  }
];
