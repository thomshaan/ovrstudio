import { DisciplineItem } from '../types';

export const DEFAULT_DISCIPLINES: DisciplineItem[] = [
  {
    id: '3d-art',
    tag: 'Craft & Modeling',
    title: '3D Art & Character Modeling',
    iconName: 'Box',
    description:
      'We sculpt stylized 3D characters, environment dioramas, and digital assets with rich textures. From concept sculpts to game-ready quad meshes.',
    whatWeMake: [
      'Stylized 3D Character Sculpts & Rigs',
      'Underwater & Environment Dioramas',
      'Optimized Low-Poly & High-Poly Game Assets',
      'Substance PBR & Hand-Painted Textures',
    ],
  },
  {
    id: 'graphic-design',
    tag: 'Identity & Systems',
    title: 'Graphic Design & Branding',
    iconName: 'Layers',
    description:
      'Clean, liquid, and modern visual design. We build brand identities, exhibition posters, custom typefaces, and eye-catching packaging that people remember.',
    whatWeMake: [
      'Complete Brand Identity Systems',
      'Fluid Typography & Custom Glyphs',
      'Exhibition Posters & Print Collateral',
      'Social Media & Digital Motion Graphics',
    ],
  },
  {
    id: 'unity-game',
    tag: 'Game Engineering',
    title: 'Unity Indie Games',
    iconName: 'Gamepad2',
    description:
      'We build playable 2D and 3D indie games in Unity. We focus on cozy mechanics, responsive character controls, and soft, beautiful lighting.',
    whatWeMake: [
      'Playable Unity 6 Game Prototypes',
      'Stylized 3D Characters & Environments',
      'Smooth Physics & Responsive Controls',
      'Cross-Platform PC, Mac & Console Releases',
    ],
  },
  {
    id: 'ar-vr-mr',
    tag: 'Spatial Experiences',
    title: 'AR / VR / MR Production',
    iconName: 'Glasses',
    description:
      'Step inside the experience. We produce mixed reality experiences for Meta Quest, Apple Vision Pro, and mobile phones with natural hand controls.',
    whatWeMake: [
      'Meta Quest 3 & Vision Pro Experiences',
      'Natural Controller-Free Hand Tracking',
      'Museum & Gallery Mixed Reality Kiosks',
      'Mobile AR Apps for iOS & Android',
    ],
  },
];
