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

      // Environment map for realistic reflections on metallic surfaces
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
      scene.environment = envTexture;
      pmremGenerator.dispose();

      // Lights — dramatic studio setup for deep shadows + chrome highlights
      const ambient = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambient);

      // Main key light — strong warm from top-front
      const keyLight = new THREE.DirectionalLight(0xfff8f0, 4.0);
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

      // Fill light — cool blue side
      const fillLight = new THREE.DirectionalLight(0xd0e8ff, 1.8);
      fillLight.position.set(-5, 3, 2);
      scene.add(fillLight);

      // Rim light — strong back-edge to outline car in white
      const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
      rimLight.position.set(0, 5, -6);
      scene.add(rimLight);

      // Subtle under-car fill
      const underFill = new THREE.PointLight(0xffffff, 0.4, 5);
      underFill.position.set(0, -0.3, 0);
      scene.add(underFill);

      // Soft front fill
      const frontLight = new THREE.PointLight(0xffffff, 0.8, 8);
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

          model.traverse((child) => {
            const mesh = child as import('three').Mesh;
            if (!mesh.isMesh) return;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Clone so we don't mutate shared material instances
            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map(m => m.clone());
            } else {
              mesh.material = mesh.material.clone();
            }

            const applyPaint = (mat: import('three').Material) => {
              const m = mat as import('three').MeshStandardMaterial;
              if (!m.color) return;

              const origM = m.metalness;
              const origR = m.roughness;
              const origE = (m as unknown as { emissiveIntensity?: number }).emissiveIntensity ?? 0;
              const { r, g, b } = m.color;
              const origLum = 0.299 * r + 0.587 * g + 0.114 * b;

              // KEEP: glass / transparent
              if (m.transparent && m.opacity < 0.9) return;
              if ('transmission' in m && (m as unknown as { transmission: number }).transmission > 0.05) return;

              // KEEP: lights with emissive (faróis LED, lanternas vermelhas)
              if (origE > 0.05) return;

              // KEEP: tires — matte + dark + rubber-like
              if (origR > 0.55 && origM < 0.15 && origLum < 0.15) return;

              // KEEP: polished metallic rims/chrome — very shiny AND light-colored (silver)
              // Body panels are dark metallic (low origLum), chrome is light (high origLum)
              if (origM > 0.8 && origR < 0.25 && origLum > 0.25) return;

              // PAINT: body panels (and anything else that isn't glass/lights/tires/rims)
              m.color.set(paintColor);
              m.metalness = 0.5;
              m.roughness = 0.1;
              m.envMapIntensity = 0.5;
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
