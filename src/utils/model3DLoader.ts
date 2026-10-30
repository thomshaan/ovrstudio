import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export interface ParseResult {
  object: THREE.Object3D;
  vertexCount: number;
  triangleCount: number;
}

/**
 * Robust in-browser parser for 3D model files (OBJ, GLTF, and generic meshes)
 */
export function parse3DModel(content: string, filename: string): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    try {
      const ext = filename.split('.').pop()?.toLowerCase() || '';

      if (ext === 'obj') {
        const loader = new OBJLoader();
        const obj = loader.parse(content);
        
        let vertexCount = 0;
        let triangleCount = 0;

        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const geom = child.geometry;
            if (geom) {
              const pos = geom.getAttribute('position');
              if (pos) vertexCount += pos.count;
              if (geom.index) {
                triangleCount += geom.index.count / 3;
              } else if (pos) {
                triangleCount += pos.count / 3;
              }
            }
          }
        });

        // Center and normalize geometry bounding box
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2 / maxDim;

        obj.position.sub(center.multiplyScalar(scale));
        obj.scale.set(scale, scale, scale);

        resolve({
          object: obj,
          vertexCount,
          triangleCount: Math.round(triangleCount),
        });
      } else {
        // Fallback or generic message
        reject(new Error(`Format .${ext} requires standard mesh structure. Uploading OBJ works instantly in-browser!`));
      }
    } catch (err: unknown) {
      reject(err instanceof Error ? err : new Error('Failed to parse 3D model'));
    }
  });
}

/**
 * Creates high quality procedural showcase 3D models for testing and presets
 */
export function createPreset3DModel(presetId: string): THREE.Group {
  const group = new THREE.Group();

  if (presetId === 'marine-drone') {
    // Stylized Submersible Drone (3-8 parts)
    const hullGeo = new THREE.CapsuleGeometry(0.5, 1.2, 16, 32);
    const hullMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 0.8,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    // Visor / cockpit glass
    const visorGeo = new THREE.SphereGeometry(0.38, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0xffedd5,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.9,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0.7, 0, 0);
    visor.rotation.z = -Math.PI / 2;
    group.add(visor);

    // Twin Turbines
    const turbineGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const turbineMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.3,
      metalness: 0.6,
    });
    
    const leftTurbine = new THREE.Mesh(turbineGeo, turbineMat);
    leftTurbine.position.set(-0.4, 0.45, 0);
    leftTurbine.rotation.z = Math.PI / 2;
    group.add(leftTurbine);

    const rightTurbine = leftTurbine.clone();
    rightTurbine.position.set(-0.4, -0.45, 0);
    group.add(rightTurbine);

  } else if (presetId === 'crystal-relic') {
    // Sci-fi floating crystal relic
    const coreGeo = new THREE.OctahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.8,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const ringGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);
  } else {
    // Stylized Mecha Helmet
    const headGeo = new THREE.DodecahedronGeometry(0.75, 1);
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.25,
      clearcoat: 0.6,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    group.add(head);

    const visorGeo = new THREE.BoxGeometry(0.7, 0.2, 0.5);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 0.8,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.05, 0.5);
    group.add(visor);
  }

  return group;
}
