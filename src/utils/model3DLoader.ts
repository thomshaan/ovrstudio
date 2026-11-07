import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ParseResult {
  object: THREE.Object3D;
  vertexCount: number;
  triangleCount: number;
}

/** Parse supported 3D assets from local files or downloaded R2 objects. */
export async function parse3DModel(
  content: string | ArrayBuffer,
  filename: string,
  resourcePath = '',
): Promise<ParseResult> {
  const ext = filename.split('?')[0].split('.').pop()?.toLowerCase() || '';
  let object: THREE.Object3D;

  if (ext === 'obj') {
    const loader = new OBJLoader();
    object = loader.parse(typeof content === 'string' ? content : new TextDecoder().decode(content));
  } else if (ext === 'fbx') {
    const loader = new FBXLoader();
    const buffer = typeof content === 'string' ? new TextEncoder().encode(content).buffer : content;
    object = loader.parse(buffer, resourcePath);
  } else if (ext === 'gltf' || ext === 'glb') {
    const loader = new GLTFLoader();
    const gltf = await loader.parseAsync(content, resourcePath);
    object = gltf.scene || gltf.scenes[0];
    if (!object) throw new Error('The GLTF file does not contain a scene.');
  } else {
    throw new Error('Unsupported 3D format. Use OBJ, FBX, GLTF, or GLB.');
  }

  let vertexCount = 0;
  let triangleCount = 0;
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      const position = geometry?.getAttribute('position');
      if (position) vertexCount += position.count;
      if (geometry?.index) triangleCount += geometry.index.count / 3;
      else if (position) triangleCount += position.count / 3;
    }
  });

  const bounds = new THREE.Box3().setFromObject(object);
  if (!bounds.isEmpty()) {
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    object.position.sub(center);
    object.scale.multiplyScalar(2 / maxDimension);
  }

  return {
    object,
    vertexCount,
    triangleCount: Math.round(triangleCount),
  };
}

/** Creates high quality procedural showcase 3D models for testing and presets. */
export function createPreset3DModel(presetId: string): THREE.Group {
  const group = new THREE.Group();

  if (presetId === 'marine-drone') {
    const hullGeo = new THREE.CapsuleGeometry(0.5, 1.2, 16, 32);
    const hullMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, roughness: 0.2, metalness: 0.8, clearcoat: 0.8,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    const visorGeo = new THREE.SphereGeometry(0.38, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0xffedd5, roughness: 0.1, metalness: 0.1, transmission: 0.85,
      transparent: true, opacity: 0.9,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0.7, 0, 0);
    visor.rotation.z = -Math.PI / 2;
    group.add(visor);

    const turbineGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const turbineMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.6 });
    const leftTurbine = new THREE.Mesh(turbineGeo, turbineMat);
    leftTurbine.position.set(-0.4, 0.45, 0);
    leftTurbine.rotation.z = Math.PI / 2;
    group.add(leftTurbine);
    const rightTurbine = leftTurbine.clone();
    rightTurbine.position.set(-0.4, -0.45, 0);
    group.add(rightTurbine);
  } else if (presetId === 'crystal-relic') {
    const coreGeo = new THREE.OctahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8, roughness: 0.1, metalness: 0.2, transmission: 0.8,
      transparent: true, opacity: 0.95, clearcoat: 1.0,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);
    const ringGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);
  } else {
    const headGeo = new THREE.DodecahedronGeometry(0.75, 1);
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b, metalness: 0.9, roughness: 0.25, clearcoat: 0.6,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    group.add(head);
    const visorGeo = new THREE.BoxGeometry(0.7, 0.2, 0.5);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.8,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.05, 0.5);
    group.add(visor);
  }

  return group;
}
