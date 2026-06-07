"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { Sparkles, HelpCircle } from "lucide-react";
import { gsap } from "gsap";

interface MagPlateViewerProps {
  accentColor: string;
  accentRgb: string;
}

export default function MagPlateViewer({ accentColor, accentRgb }: MagPlateViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const requestRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMissingModel, setIsMissingModel] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Create Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 3.5);
    cameraRef.current = camera;

    // 3. Create WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // 4. Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;

    // 5. Lighting Setup (Specially engineered tactical lighting for Magazine Plate)
    // Ambient Light (Soft slate blue ambient fill - boosted)
    const ambient = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambient);

    // Directional Key Light (Massive front-top-right white light - boosted to 9.0)
    const dirLight = new THREE.DirectionalLight(0xffffff, 9.0);
    dirLight.position.set(6, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    // Accent Spotlight 1 (Neon Cyber Cyan/Blue spotlight from front-left - boosted to 120)
    const spotlight1 = new THREE.SpotLight(new THREE.Color(accentColor), 120, 15, Math.PI / 4, 0.5, 1);
    spotlight1.position.set(-4, 5, 3);
    spotlight1.castShadow = true;
    scene.add(spotlight1);

    // Accent Spotlight 2 (Overhead white spotlight for specular slide highlights - boosted to 90)
    const spotlightTop = new THREE.SpotLight(0xffffff, 90, 12, Math.PI / 6, 0.4, 1);
    spotlightTop.position.set(0, 6, 0);
    scene.add(spotlightTop);

    // Accent Spotlight 3 (Rim/Backlight for bright profile glow - boosted to 130)
    const spotlightBack = new THREE.SpotLight(0xffffff, 130, 15, Math.PI / 3, 0.6, 1);
    spotlightBack.position.set(0, 4, -5);
    scene.add(spotlightBack);

    // Under-fill colored point light (boosted to 18)
    const pointUnder = new THREE.PointLight(new THREE.Color(accentColor), 18, 6);
    pointUnder.position.set(0, -2, 1);
    scene.add(pointUnder);

    // Left Side Spotlight (Sol Yan Işık - High-intensity white spotlight from far left)
    const spotlightLeft = new THREE.SpotLight(0xffffff, 100, 12, Math.PI / 4, 0.5, 1);
    spotlightLeft.position.set(-6, 1.5, 0);
    spotlightLeft.castShadow = true;
    scene.add(spotlightLeft);

    // Right Side Spotlight (Sağ Yan Işık - High-intensity white spotlight from far right)
    const spotlightRight = new THREE.SpotLight(0xffffff, 100, 12, Math.PI / 4, 0.5, 1);
    spotlightRight.position.set(6, 1.5, 0);
    spotlightRight.castShadow = true;
    scene.add(spotlightRight);

    // 6. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 7. Load GLB Model (Magazine Plate)
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      "/sarjor_kapak.glb",
      (gltf) => {
        setIsLoading(false);
        const model = gltf.scene;

        // Traverse mesh to activate premium metal reflection textures
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness, 0.22); // High glossy reflections
              mat.metalness = Math.max(mat.metalness, 0.95); // Brilliant metallic polished steel feel
              mat.side = THREE.DoubleSide;
            }
          }
        });

        // Center model geometry to the pivot point (0,0,0)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);
        
        // Scale model dynamically to fit nicely in 3D frame
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 1.8 / maxDim; // target size of approx 1.8 units
        modelGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

        modelGroup.add(model);

        // Gentle entrance rotation
        gsap.from(modelGroup.rotation, {
          y: Math.PI * 2,
          duration: 2,
          ease: "power2.out",
        });
      },
      (xhr) => {
        if (xhr.total > 0) {
          const progress = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(progress);
        } else {
          setLoadingProgress((prev) => Math.min(prev + 2, 98));
        }
      },
      (error) => {
        console.error("Error loading magazine plate GLB model", error);
        setIsLoading(false);
        setIsMissingModel(true);
      }
    );

    // 8. Animation Render Loop
    let isVisible = true;
    let animId: number | null = null;

    const animate = () => {
      if (!isVisible) return;

      // Gentle auto-rotation
      if (modelGroupRef.current && (controls as any).state === -1) {
        modelGroupRef.current.rotation.y += 0.0015;
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        
        if (isVisible && !wasVisible) {
          // Restart animation loop when it comes back into view!
          animId = requestAnimationFrame(animate);
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Initial trigger
    animId = requestAnimationFrame(animate);

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [accentColor]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[350px] flex items-center justify-center">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-auto z-10" />

      {/* Futuristic Grid Canvas Overlay Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-15" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0" 
        style={{
          backgroundImage: `radial-gradient(rgba(${accentRgb}, 0.15) 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Cyber blue spotlight background behind model */}
      <div
        className="absolute w-52 h-52 rounded-full filter blur-[80px] opacity-25 pointer-events-none z-0"
        style={{
          backgroundColor: accentColor,
        }}
      />

      {/* 3D LOADER HUD STATE */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
          <div className="text-center space-y-4 max-w-xs px-6">
            <h1
              className="font-cinzel text-xs tracking-[0.25em] uppercase font-extrabold animate-pulse"
              style={{ color: accentColor }}
            >
              Şarjör Kapak Model Yükleniyor
            </h1>
            
            <div className="relative h-[2px] w-40 bg-zinc-900 overflow-hidden rounded mx-auto">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-300 rounded"
                style={{
                  width: `${loadingProgress}%`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 10px rgba(${accentRgb}, 0.8)`,
                }}
              />
            </div>
            
            <div
              className="font-outfit text-[9px] tracking-widest font-light"
              style={{ color: accentColor, opacity: 0.7 }}
            >
              {loadingProgress}%
            </div>
          </div>
        </div>
      )}

      {/* Missing model assistant */}
      {isMissingModel && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center rounded-2xl border border-dashed border-zinc-800">
          <HelpCircle className="w-8 h-8 text-zinc-500 mb-3 animate-pulse" />
          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider mb-2">
            3D Şarjör Kapak Modeli Bekleniyor
          </h4>
          <p className="text-[10px] text-zinc-500 max-w-[240px] leading-relaxed">
            Lütfen **`şarjör kapak.glb`** dosyasının **`public/`** klasöründe doğru konumlandırıldığından emin olun.
          </p>
        </div>
      )}

      {/* Interactive Drag Icon Overlay */}
      {!isLoading && !isMissingModel && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 rounded-lg bg-black/60 backdrop-blur-sm border border-zinc-900 pointer-events-none text-[9px] font-outfit text-zinc-500 tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#0072ff]" style={{ color: accentColor }} />
          <span>Mekanizmayı incelemek için sürükleyin</span>
        </div>
      )}
    </div>
  );
}
