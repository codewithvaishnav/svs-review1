import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LandGridSceneProps {
  className?: string;
}

const GRID_X = 9;
const GRID_Z = 9;
const TILE = 1.15;
const GAP = 0.22;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

/**
 * Animated WebGL backdrop: a floating grid of land parcels with gold edges,
 * a drifting star field, and pointer-driven camera parallax.
 */
export const LandGridScene: React.FC<LandGridSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !supportsWebGL()) return;

    const reduced = prefersReducedMotion();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.055);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);
    camera.position.set(0, 7.6, 12.5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    scene.add(new THREE.AmbientLight(0x8fa0cc, 0.9));

    const keyLight = new THREE.DirectionalLight(0xffdf9b, 3.4);
    keyLight.position.set(6, 12, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x5b9cff, 45, 45);
    rimLight.position.set(-9, 4, -6);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xe0a92e, 55, 40);
    goldLight.position.set(7, 3.5, 4);
    scene.add(goldLight);

    const group = new THREE.Group();
    scene.add(group);

    const tileGeometry = new THREE.BoxGeometry(TILE, 1, TILE);
    const edgeGeometry = new THREE.EdgesGeometry(tileGeometry);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b3a63,
      metalness: 0.6,
      roughness: 0.28,
      emissive: 0x16203a,
      emissiveIntensity: 1,
    });
    const premiumMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a6418,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0x6b4a10,
      emissiveIntensity: 0.9,
    });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xf5c451, transparent: true, opacity: 0.9 });

    type Tile = { mesh: THREE.Mesh; baseY: number; phase: number };
    const tiles: Tile[] = [];

    const step = TILE + GAP;
    const offsetX = ((GRID_X - 1) * step) / 2;
    const offsetZ = ((GRID_Z - 1) * step) / 2;

    for (let x = 0; x < GRID_X; x++) {
      for (let z = 0; z < GRID_Z; z++) {
        const distance = Math.hypot(x - (GRID_X - 1) / 2, z - (GRID_Z - 1) / 2);
        const height = 0.35 + Math.max(0, 2.4 - distance * 0.55) + Math.random() * 0.5;
        const premium = distance < 2.1 && Math.random() > 0.55;

        const mesh = new THREE.Mesh(tileGeometry, premium ? premiumMaterial : baseMaterial);
        mesh.scale.y = height;
        mesh.position.set(x * step - offsetX, height / 2, z * step - offsetZ);

        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        mesh.add(edges);

        group.add(mesh);
        tiles.push({ mesh, baseY: mesh.position.y, phase: distance * 0.7 + Math.random() });
      }
    }

    const starCount = 420;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 46;
      starPositions[i * 3 + 1] = Math.random() * 18 + 1;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 46;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xf5c451, size: 0.06, transparent: true, opacity: 0.55 }),
    );
    scene.add(stars);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let visible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 },
    );
    visibilityObserver.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible) return;

      const elapsed = clock.getElapsedTime();

      if (!reduced) {
        group.rotation.y = elapsed * 0.075;
        stars.rotation.y = -elapsed * 0.02;
        for (const tile of tiles) {
          tile.mesh.position.y = tile.baseY + Math.sin(elapsed * 0.9 + tile.phase) * 0.14;
        }
        pointer.x += (target.x - pointer.x) * 0.045;
        pointer.y += (target.y - pointer.y) * 0.045;
        camera.position.x = pointer.x * 2.6;
        camera.position.y = 7.6 - pointer.y * 1.4;
        camera.lookAt(0, 0.6, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      tileGeometry.dispose();
      edgeGeometry.dispose();
      starGeometry.dispose();
      baseMaterial.dispose();
      premiumMaterial.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} aria-hidden className={`pointer-events-none ${className}`} />;
};
