import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, ZoomIn, ZoomOut, Eye, Upload, Box, Check, Sparkles, Layers } from 'lucide-react';
import { parse3DModel, createPreset3DModel } from '../utils/model3DLoader';
import { sound } from '../utils/audio';

interface Model3DViewerProps {
  initialPreset?: 'marine-drone' | 'crystal-relic' | 'mecha-helmet';
  customObjContent?: string;
  customModelName?: string;
  onModelUploaded?: (filename: string, content: string) => void;
  showUploadButton?: boolean;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  initialPreset = 'marine-drone',
  customObjContent,
  customModelName,
  onModelUploaded,
  showUploadButton = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePreset, setActivePreset] = useState<string>(initialPreset);
  const [modelName, setModelName] = useState<string>(customModelName || 'OVR Submersible Drone');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [stats, setStats] = useState({ vertices: 3420, triangles: 4860 });
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const modelHolderRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Set up Three.js interactive canvas
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0b1d3a');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Lighting
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.0);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#38bdf8', 1.8);
    fillLight.position.set(-4, -2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#f97316', 2.0);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(ambient);

    // Model group container
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelHolderRef.current = modelGroup;

    // Load initial model (preset or custom)
    if (customObjContent) {
      parse3DModel(customObjContent, customModelName || 'model.obj')
        .then((res) => {
          modelGroup.clear();
          modelGroup.add(res.object);
          setStats({ vertices: res.vertexCount, triangles: res.triangleCount });
        })
        .catch(() => {
          const fallback = createPreset3DModel('marine-drone');
          modelGroup.clear();
          modelGroup.add(fallback);
        });
    } else {
      const preset = createPreset3DModel(initialPreset);
      modelGroup.add(preset);
    }

    // Interactive pointer drag rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      if (modelHolderRef.current) {
        modelHolderRef.current.rotation.y += deltaX * 0.01;
        modelHolderRef.current.rotation.x += deltaY * 0.01;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.003, 1.8, 6.5);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Window resize
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

    const animate = () => {
      const delta = clock.getDelta();
      if (modelHolderRef.current && autoRotate && !isDragging) {
        modelHolderRef.current.rotation.y += delta * 0.6;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [customObjContent, customModelName, initialPreset]);

  // Wireframe toggle
  useEffect(() => {
    if (!modelHolderRef.current) return;
    modelHolderRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = isWireframe));
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  const loadPreset = (presetId: 'marine-drone' | 'crystal-relic' | 'mecha-helmet', name: string) => {
    sound.playTick();
    setActivePreset(presetId);
    setModelName(name);
    setLoadingError(null);
    if (modelHolderRef.current) {
      modelHolderRef.current.clear();
      const group = createPreset3DModel(presetId);
      modelHolderRef.current.add(group);
      modelHolderRef.current.rotation.set(0, 0, 0);
      setStats({
        vertices: presetId === 'marine-drone' ? 3420 : presetId === 'crystal-relic' ? 1860 : 2540,
        triangles: presetId === 'marine-drone' ? 4860 : presetId === 'crystal-relic' ? 2400 : 3600,
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playTick();
    setLoadingError(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'obj' && ext !== 'fbx') {
      setLoadingError('Please upload a .OBJ 3D file for direct WebGL rendering (FBX binary is converted via standard OBJ exports from Blender/Maya).');
      return;
    }

    try {
      const text = await file.text();
      const res = await parse3DModel(text, file.name);

      if (modelHolderRef.current) {
        modelHolderRef.current.clear();
        modelHolderRef.current.add(res.object);
        modelHolderRef.current.rotation.set(0, 0, 0);
      }

      setModelName(file.name);
      setActivePreset('custom');
      setStats({ vertices: res.vertexCount, triangles: res.triangleCount });
      sound.playChime(750, 0.2);

      if (onModelUploaded) {
        onModelUploaded(file.name, text);
      }
    } catch (err: unknown) {
      setLoadingError(err instanceof Error ? err.message : 'Error parsing 3D model.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#0b1d3a] border border-white/10 shadow-2xl flex flex-col">
      {/* Top Bar with Title & Stats */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#08152b] z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Box className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{modelName}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                Interactive 3D
              </span>
            </h3>
            <div className="text-[11px] text-slate-400">
              {stats.vertices.toLocaleString()} Vertices · {stats.triangles.toLocaleString()} Polygons · Drag to rotate · Scroll to zoom
            </div>
          </div>
        </div>

        {/* 3D Upload Button */}
        {showUploadButton && (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".obj,.fbx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative overflow-hidden px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Upload className="w-3.5 h-3.5 text-white" />
              <span>Upload 3D File (.OBJ)</span>
            </button>
          </div>
        )}
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[360px] sm:h-[440px] cursor-grab active:cursor-grabbing overflow-hidden">
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />

        {/* Loading error badge */}
        {loadingError && (
          <div className="absolute top-4 left-4 right-4 p-3 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs z-20">
            {loadingError}
          </div>
        )}

        {/* Viewport Floating Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Preset Selector */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <button
              onClick={() => loadPreset('marine-drone', 'OVR Submersible Drone')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activePreset === 'marine-drone' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Submersible Drone
            </button>
            <button
              onClick={() => loadPreset('crystal-relic', 'Floating Crystal Relic')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activePreset === 'crystal-relic' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Crystal Relic
            </button>
            <button
              onClick={() => loadPreset('mecha-helmet', 'Stylized Mecha Helmet')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activePreset === 'mecha-helmet' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mecha Helmet
            </button>
          </div>

          {/* Controls: Auto-rotate & Wireframe */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTick();
                setAutoRotate(!autoRotate);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                autoRotate
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                  : 'bg-black/60 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Toggle Auto-Spin"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playTick();
                setIsWireframe(!isWireframe);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isWireframe
                  ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                  : 'bg-black/60 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Toggle Topology Wireframe"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
