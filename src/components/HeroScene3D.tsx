import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { sound } from '../utils/audio';
import { Play, ChevronDown, Sparkles, Waves, Gamepad2, ArrowRight, Heart } from 'lucide-react';

interface HeroScene3DProps {
  onExploreProjects: () => void;
  onOpenBuilder: () => void;
  onDiveDeeper: () => void;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  onExploreProjects,
  onOpenBuilder,
  onDiveDeeper,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const stateRef = useRef({
    autoRotate: true,
    pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
    rotation: { x: 0.1, y: 0.2 },
  });

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#032042');
    scene.fog = new THREE.FogExp2('#032042', 0.05);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 4.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Ocean lighting
    const ambientLight = new THREE.AmbientLight('#1e40af', 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#93c5fd', 3.4);
    sunLight.position.set(3, 6, 4);
    scene.add(sunLight);

    const aquaLight = new THREE.DirectionalLight('#38bdf8', 1.8);
    aquaLight.position.set(-4, -2, -2);
    scene.add(aquaLight);

    // 3D Aquatic Group: Manta Ray & Water Pearl
    const oceanGroup = new THREE.Group();
    scene.add(oceanGroup);

    // Manta Ray
    const rayShape = new THREE.Shape();
    rayShape.moveTo(0, 0.8);
    rayShape.bezierCurveTo(0.4, 0.6, 1.6, 0.2, 1.8, -0.2);
    rayShape.bezierCurveTo(1.6, -0.5, 0.6, -0.4, 0.2, -0.8);
    rayShape.bezierCurveTo(0.1, -1.2, 0.05, -1.6, 0, -1.8);
    rayShape.bezierCurveTo(-0.05, -1.6, -0.1, -1.2, -0.2, -0.8);
    rayShape.bezierCurveTo(-0.6, -0.4, -1.6, -0.5, -1.8, -0.2);
    rayShape.bezierCurveTo(-1.6, 0.2, -0.4, 0.6, 0, 0.8);

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const rayGeo = new THREE.ExtrudeGeometry(rayShape, extrudeSettings);
    rayGeo.center();

    const rayMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const rayMesh = new THREE.Mesh(rayGeo, rayMat);
    rayMesh.rotation.x = -Math.PI / 2.3;
    rayMesh.scale.set(0.9, 0.9, 0.9);
    oceanGroup.add(rayMesh);

    // Water Pearl
    const pearlGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transmission: isSoftwareGl ? 0 : 0.8,
      transparent: true,
      opacity: 0.9,
      roughness: 0.05,
      ior: 1.33,
      clearcoat: 1.0,
    });
    const pearlMesh = new THREE.Mesh(pearlGeo, pearlMat);
    pearlMesh.position.y = 0.2;
    oceanGroup.add(pearlMesh);

    // Core
    const coreGeo = new THREE.IcosahedronGeometry(0.24, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    pearlMesh.add(coreMesh);

    // Orbiting rings
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.025, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x2563eb,
      emissiveIntensity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    oceanGroup.add(ring1);

    // Floating bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const bubbleGroup = new THREE.Group();
    oceanGroup.add(bubbleGroup);

    const bubbles: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      const angle = (i / 6) * Math.PI * 2;
      bubble.position.set(Math.cos(angle) * 1.7, (i % 2 === 0 ? 0.3 : -0.3), Math.sin(angle) * 1.7);
      bubbleGroup.add(bubble);
      bubbles.push(bubble);
    }

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.pointer.targetX = x;
      stateRef.current.pointer.targetY = y;
    };

    container.addEventListener('mousemove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      stateRef.current.pointer.x = THREE.MathUtils.damp(
        stateRef.current.pointer.x,
        stateRef.current.pointer.targetX,
        4,
        delta
      );
      stateRef.current.pointer.y = THREE.MathUtils.damp(
        stateRef.current.pointer.y,
        stateRef.current.pointer.targetY,
        4,
        delta
      );

      camera.position.x = stateRef.current.pointer.x * 0.35;
      camera.position.y = 0.3 + stateRef.current.pointer.y * 0.25;
      camera.lookAt(0, 0, 0);

      rayMesh.rotation.z = Math.sin(time * 1.8) * 0.12;
      rayMesh.position.y = Math.sin(time * 1.4) * 0.1;
      rayMesh.rotation.y = Math.cos(time * 1.1) * 0.15;

      if (stateRef.current.autoRotate) {
        oceanGroup.rotation.y += delta * 0.25;
      }

      ring1.rotation.z += delta * 0.3;
      bubbleGroup.rotation.y += delta * 0.4;
      bubbles.forEach((b, idx) => {
        b.position.y = (idx % 2 === 0 ? 0.3 : -0.3) + Math.sin(time * 2 + idx) * 0.1;
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      rayGeo.dispose();
      rayMat.dispose();
      pearlGeo.dispose();
      pearlMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="hero" className="relative w-full bg-white pt-20 pb-4 overflow-hidden">
      {/* Top Arched Viewport Window */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[540px] rounded-[36px] sm:rounded-[48px] overflow-hidden shadow-2xl bg-[#032042] border-2 border-white/20">
          
          {/* 3D WebGL Canvas */}
          <div
            ref={mountRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
            aria-label="Interactive 3D Ocean Experience"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#021833]/90 via-[#021833]/30 to-transparent pointer-events-none" />

          {/* Typography inside the viewport */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-12 pointer-events-none">
            {/* Top Tag */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/30">
                <Waves className="w-4 h-4 text-white" />
                <span>OVRStudio · Interactive Creative Studio</span>
              </div>

              <div className="pointer-events-auto hidden sm:flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playTick();
                    setAutoRotate(!autoRotate);
                  }}
                  className="group relative overflow-hidden px-4 py-2 rounded-full bg-[#0b1d3a]/80 hover:bg-[#0b1d3a] text-white text-xs sm:text-sm font-medium border border-white/20 backdrop-blur-md transition-all duration-200 active:scale-95 hover:scale-[1.03] cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700"
                >
                  {autoRotate ? 'Pause 3D' : 'Spin 3D'}
                </button>
              </div>
            </div>

            {/* Bottom Headline & Orange CTA Button */}
            <div className="max-w-xl pointer-events-auto">
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight leading-tight mb-5 drop-shadow-md">
                We make playful games, 3D art, and worlds you can step inside.
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Important Orange CTA Button with cool interactive sweep & glow */}
                <button
                  onClick={() => {
                    sound.playChime(640, 0.12);
                    onExploreProjects();
                  }}
                  className="group relative overflow-hidden px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.03] shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 flex items-center gap-2.5 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700"
                >
                  <Play className="w-4 h-4 text-white fill-current group-hover:scale-110 transition-transform" />
                  <span>Explore Our Works</span>
                </button>

                {/* Our Story Button (changed from Admin CMS) */}
                <button
                  onClick={() => {
                    sound.playTick();
                    onDiveDeeper();
                  }}
                  className="group relative overflow-hidden px-6 py-3.5 bg-white text-[#0b1d3a] hover:text-orange-600 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.03] shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-black/5 before:to-transparent before:transition-transform before:duration-700"
                >
                  <Heart className="w-4 h-4 text-[#0b1d3a] group-hover:text-orange-600 transition-colors" />
                  <span>Our Story</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curved Wave Overlap with "DIVE DEEPER" Pill (Exact match to ocean school reference) */}
      <div className="relative w-full flex justify-center -mt-6 z-20">
        <button
          onClick={() => {
            sound.playTick();
            onDiveDeeper();
          }}
          className="group relative overflow-hidden px-8 py-3 bg-white text-[#0b1d3a] hover:text-orange-600 border border-slate-200 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 hover:scale-[1.03] shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-orange-500/10 before:to-transparent before:transition-transform before:duration-700"
        >
          <span>DIVE DEEPER</span>
          <ChevronDown className="w-4 h-4 text-[#0b1d3a] group-hover:text-orange-600 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* "What is OVRStudio?" Clean Section (Matching ocean school editorial split) */}
      <div id="about" className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#0b1d3a] tracking-tight">
              What is OVRStudio?
            </h2>

            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
              <strong className="text-[#0b1d3a] font-semibold">OVRStudio</strong> is a free independent creative studio. We produce <strong className="text-[#0b1d3a]">3D Art &amp; Character Modeling</strong>, <strong className="text-[#0b1d3a]">Graphic Design &amp; Fluid Branding</strong>, playable <strong className="text-[#0b1d3a]">Unity Indie Games</strong>, and hands-on <strong className="text-[#0b1d3a]">AR / VR / MR</strong> experiences.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              Just like exploring an ocean reef, our inspiring and immersive multimedia resources feature linear videos, spatial VR/AR, interactive media, and hands-on projects designed to bring wonder and joy to players of all ages.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playChime(640, 0.12);
                  onExploreProjects();
                }}
                className="group relative overflow-hidden px-7 py-3.5 bg-[#0b1d3a] hover:bg-[#142a52] text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 hover:scale-[1.03] shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700"
              >
                <span>Explore our works</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Reverted Clean Tablet Device Mockup */}
          <div className="lg:col-span-5">
            <div className="relative flex flex-col items-center">
              <div className="text-xs sm:text-sm text-slate-600 text-left mb-6 max-w-sm leading-relaxed font-normal">
                Explore the studio through cozy indie games, stylized 3D art, and hands-on mixed reality headsets created by game makers and artists.
              </div>

              {/* Clean Beveled Tablet Device Frame */}
              <div className="relative w-full max-w-sm">
                <div className="relative aspect-16/10 rounded-2xl bg-white p-2.5 shadow-2xl border-2 border-slate-100 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  {/* Tablet Bezel & Camera Dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mx-auto mb-1.5" />

                  {/* Tablet Screen Surface */}
                  <div className="relative w-full h-[calc(100%-14px)] rounded-xl bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0b1d3a] p-4 flex flex-col justify-between overflow-hidden shadow-inner group">
                    <img
                      src="/src/assets/images/ovr_game_unity_1793175840681.jpg"
                      alt="Unity Game Gameplay"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d3a]/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Tablet Top Info */}
                    <div className="relative z-10 flex items-center justify-between text-white/95 text-[10px] font-bold tracking-wider uppercase">
                      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <Waves className="w-3 h-3 text-white" />
                        <span>OVRStudio Live Game</span>
                      </div>
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                        Unity 6
                      </span>
                    </div>

                    {/* Tablet Bottom Caption */}
                    <div className="relative z-10 text-white">
                      <div className="text-xs sm:text-sm font-bold leading-snug drop-shadow-md">
                        Interactive indie gameplay &amp; spatial worlds.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ground Soft Shadow */}
                <div className="w-3/4 h-5 bg-[#0b1d3a]/15 rounded-full blur-md mx-auto -mt-1" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

