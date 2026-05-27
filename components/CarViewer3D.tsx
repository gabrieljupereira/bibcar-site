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

      // Scene
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

      // Environment map for realistic reflections on metallic surfaces
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
      scene.environment = envTexture;
      pmremGenerator.dispose();

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambient);

      // Main key light — warm top front
      const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.5);
      keyLight.position.set(4, 8, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.near = 0.1;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
      keyLight.shadow.bias = -0.001;
      scene.add(keyLight);

      // Fill light — cool side
      const fillLight = new THREE.DirectionalLight(0xc8d8ff, 1.5);
      fillLight.position.set(-5, 3, 2);
      scene.add(fillLight);

      // Rim light — back edge highlight
      const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
      rimLight.position.set(0, 4, -6);
      scene.add(rimLight);

      // Subtle under-car fill — very soft, no color cast
      const underFill = new THREE.PointLight(0xffffff, 0.6, 5);
      underFill.position.set(0, -0.3, 0);
      scene.add(underFill);

      // Soft front fill — neutral white, avoid color cast
      const frontLight = new THREE.PointLight(0xffffff, 1.2, 8);
      frontLight.position.set(0, 1.5, 4);
      scene.add(frontLight);

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

          // Collect unique material info for debugging
          const seen = new Set<string>();
          const debugLines: string[] = [];
          model.traverse((child) => {
            const mesh = child as import('three').Mesh;
            if (!mesh.isMesh) return;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((mat) => {
              const m = mat as import('three').MeshStandardMaterial;
              const key = `${mesh.name}||${m.name}`;
              if (seen.has(key)) return;
              seen.add(key);
              debugLines.push(`mesh:"${mesh.name}" mat:"${m.name}" M=${m.metalness?.toFixed(2)} R=${m.roughness?.toFixed(2)} L=${((0.299*(m.color?.r||0)+0.587*(m.color?.g||0)+0.114*(m.color?.b||0))).toFixed(2)}`);
            });
          });
          // Show debug overlay on screen
          const dbg = document.createElement('div');
          dbg.id = 'car-debug';
          dbg.style.cssText = 'position:absolute;top:0;left:0;right:0;background:rgba(0,0,0,0.85);color:#0f0;font:10px monospace;padding:4px;z-index:999;max-height:200px;overflow-y:auto;pointer-events:none;white-space:pre';
          dbg.textContent = debugLines.join('\n');
          container.style.position = 'relative';
          container.appendChild(dbg);

          model.traverse((child) => {
            const mesh = child as import('three').Mesh;
            if (!mesh.isMesh) return;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Collect full hierarchy + material name for keyword matching
            const buildPath = (obj: import('three').Object3D): string => {
              const parts: string[] = [];
              let cur: import('three').Object3D | null = obj;
              while (cur) { if (cur.name) parts.push(cur.name.toLowerCase()); cur = cur.parent; }
              return parts.join(' ');
            };
            const hierPath = buildPath(mesh);

            const applyPaint = (mat: import('three').Material) => {
              const m = mat as import('three').MeshStandardMaterial;
              if (!m.color) return;

              const fullName = hierPath + ' ' + (m.name || '').toLowerCase();

              // --- SKIP: glass / windows ---
              if (m.transparent && m.opacity < 0.88) return;
              if ('transmission' in m && (m as unknown as { transmission: number }).transmission > 0.1) return;
              if (fullName.includes('glass') || fullName.includes('window') ||
                  fullName.includes('windshield') || fullName.includes('visor') ||
                  fullName.includes('lens')) return;

              // --- SKIP: tires / rubber (very matte, roughness ≥ 0.7) ---
              if (m.roughness >= 0.70) return;
              if (fullName.includes('tire') || fullName.includes('tyre') ||
                  fullName.includes('rubber') || fullName.includes('pneu')) return;

              // --- SKIP: silver/chrome/metallic parts ---
              // Rule 1: original material is highly metallic (rims, exhaust, chrome trim)
              if (m.metalness >= 0.60) return;
              // Rule 2: original color is light/silver AND has notable metalness
              //         (catches badges, star logo, polished trim with metalness 0.4–0.6)
              const { r, g, b } = m.color;
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              if (lum > 0.28 && m.metalness >= 0.35) return;
              // Rule 3: name-based chrome/badge detection
              if (fullName.includes('chrome') || fullName.includes('badge') ||
                  fullName.includes('emblem') || fullName.includes('logo') ||
                  fullName.includes('star') || fullName.includes('symbol') ||
                  fullName.includes('rotor') || fullName.includes('caliper') ||
                  fullName.includes('rim') || fullName.includes('spoke') ||
                  fullName.includes('wheel') || fullName.includes('hub')) return;

              // --- PAINT: body panels, bumpers, mirrors, pillars ---
              m.color.set(paintColor);
              m.metalness = 0.5;
              m.roughness = 0.12;
              m.envMapIntensity = 1.6;
              m.transparent = false;
              m.opacity = 1;
              if ('transmission' in m) (m as unknown as { transmission: number }).transmission = 0;
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
        envTexture.dispose();
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
