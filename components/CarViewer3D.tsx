'use client';

import { useEffect, useRef } from 'react';

interface Props {
  modelPath?: string;
  bodyColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CarViewer3D({ modelPath = '/car.glb', bodyColor = '#C13EFF', className = '', style }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    let renderer: import('three').WebGLRenderer;

    (async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');

      const w = container.clientWidth || 600;
      const h = container.clientHeight || 480;

      // Scene — transparent so container CSS background shows through
      const scene = new THREE.Scene();

      // Camera — low angle, cinematic
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      camera.position.set(0, 1.0, 5.5);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);

      // Environment map — RoomEnvironment immediately, upgrade to HDRI if available
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      const roomEnvTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
      scene.environment = roomEnvTexture;

      // Try loading a real studio HDRI for Sketchfab-level quality
      let hdrEnvTexture: import('three').Texture | null = null;
      (async () => {
        try {
          const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader.js');
          const hdr = await new Promise<import('three').DataTexture>((res, rej) => {
            new RGBELoader().load(
              'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr',
              res, undefined, rej
            );
          });
          hdrEnvTexture = pmremGenerator.fromEquirectangular(hdr).texture;
          scene.environment = hdrEnvTexture;
          hdr.dispose();
          roomEnvTexture.dispose();
          pmremGenerator.dispose();
        } catch {
          pmremGenerator.dispose();
        }
      })();

      // Studio lights — soft and even, let env map do most work
      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambient);

      // Soft key from top-front
      const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.5);
      keyLight.position.set(3, 7, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(4096, 4096);
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
      keyLight.shadow.bias = -0.001;
      scene.add(keyLight);

      // Soft fill from side
      const fillLight = new THREE.DirectionalLight(0xe8f0ff, 1.2);
      fillLight.position.set(-5, 3, 2);
      scene.add(fillLight);

      // Rim light — separates car from background
      const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
      rimLight.position.set(0, 5, -6);
      scene.add(rimLight);

      // Invisible shadow-catcher plane (no visible surface)
      const shadowGeo = new THREE.PlaneGeometry(14, 14);
      const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35, transparent: true });
      const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enablePan = false;
      controls.minDistance = 3;
      controls.maxDistance = 9;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.52;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.9;
      controls.target.set(0, 0.7, 0);

      renderer.domElement.addEventListener('pointerdown', () => {
        controls.autoRotate = false;
      });

      // Load model
      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3.2 / maxDim;

          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          model.position.y = 0;

          const paintColor = new THREE.Color(bodyColor);

          // Non-body part keywords — skip painting these meshes entirely
          const SKIP_KEYWORDS = [
            'engine', 'motor', 'exhaust', 'muffler', 'header', 'intake',
            'wheel', 'rim', 'tire', 'tyre', 'rubber', 'brake', 'caliper', 'disc', 'rotor',
            'glass', 'window', 'windsh', 'windscreen',
            'light', 'lamp', 'led',
            'badge', 'logo', 'emblem', 'lottering', 'lettering',
            'seat', 'interior', 'dash', 'gauge', 'display', 'screen', 'cluster',
            'grill', 'vent',
            'v8_', 'gasca', 'vivacc',
          ];

          model.traverse((child) => {
            const mesh = child as import('three').Mesh;
            if (!mesh.isMesh) return;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Skip non-body parts by name — preserves tires, rims, glass, lights, logos
            const n = mesh.name.toLowerCase();
            if (SKIP_KEYWORDS.some(k => n.includes(k))) return;

            // Clone materials before modifying
            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map(m => m.clone());
            } else {
              mesh.material = mesh.material.clone();
            }

            const applyPaint = (mat: import('three').Material) => {
              const m = mat as import('three').MeshStandardMaterial;
              if (!m.color) return;
              // Skip transparent glass panels
              if (m.transparent && m.opacity < 0.9) return;
              if ('transmission' in m && (m as unknown as { transmission: number }).transmission > 0.05) return;
              // Skip materials that actually glow (non-black emissive)
              const emissiveColor = (m as unknown as { emissive?: { r: number; g: number; b: number } }).emissive;
              const origE = (m as unknown as { emissiveIntensity?: number }).emissiveIntensity ?? 0;
              const emissiveLum = emissiveColor
                ? (0.299 * emissiveColor.r + 0.587 * emissiveColor.g + 0.114 * emissiveColor.b) * origE
                : 0;
              if (emissiveLum > 0.02) return;
              // Paint: only change base color — preserve all texture maps + PBR values
              m.color.set(paintColor);
              m.needsUpdate = true;
            };

            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(applyPaint);
            } else {
              applyPaint(mesh.material);
            }
          });

          scene.add(model);
          controls.target.set(0, size.y * scale * 0.38, 0);
          controls.update();
        },
        undefined,
        (err) => console.warn('CarViewer3D: model not found', err)
      );

      // Resize
      const ro = new ResizeObserver(() => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      });
      ro.observe(container);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      (container as unknown as { _cleanup: () => void })._cleanup = () => {
        ro.disconnect();
        cancelAnimationFrame(animId);
        renderer.dispose();
        roomEnvTexture.dispose();
        hdrEnvTexture?.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      const c = container as unknown as { _cleanup?: () => void };
      c._cleanup?.();
    };
  }, [modelPath, bodyColor]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ cursor: 'grab', ...style }}
    />
  );
}
