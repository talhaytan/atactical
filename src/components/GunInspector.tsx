"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { WebsiteData, ACCENT_THEMES } from "./Customizer";
import { Sparkles, Compass, HelpCircle, ArrowRight } from "lucide-react";

interface InspectorProps {
  data: WebsiteData;
}

// Interactive Hotspot definition for Handgun
interface HotspotInfo {
  id: string;
  title: string;
  titleTr: string;
  desc: string;
  descTr: string;
  position3D: THREE.Vector3;
  cameraPos: THREE.Vector3;
  targetPos: THREE.Vector3;
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: "stippling",
    title: "Kabza Kaplaması",
    titleTr: "Kabza Doku & Kaymaz Kaplama (Stippling)",
    desc: "Carbon-fiber reinforced non-slip grip stippling, engineered to provide maximum high-friction tactile grip in extreme conditions.",
    descTr: "Ergonomik, kaymaz kabza dokusu (stippling). Terleme, ıslaklık veya eldivenli kullanımlarda dahi maksimum kavrama mukavemeti sağlar.",
    position3D: new THREE.Vector3(0.08, -0.4, -0.1),
    cameraPos: new THREE.Vector3(1.2, -0.4, 2.6),
    targetPos: new THREE.Vector3(0.08, -0.4, -0.1),
  },
  {
    id: "magwell",
    title: "Şarjör Ağzı",
    titleTr: "Eğimli Taktiksel Şarjör Ağzı (Flared Magwell)",
    desc: "Flared tactical magwell designed for optimized rapid reload positioning, allowing swift magazine swaps under high stress.",
    descTr: "Hızlı taktiksel şarjör değişimleri için tasarlanmış genişletilmiş eğimli ağız (magwell). Yoğun stres altında dahi şarjörün yuvaya hatasız oturmasını destekler.",
    position3D: new THREE.Vector3(0.12, -0.85, -0.3),
    cameraPos: new THREE.Vector3(1.4, -0.9, 2.4),
    targetPos: new THREE.Vector3(0.12, -0.85, -0.3),
  },
];

export default function GunInspector({ data }: InspectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const gunGroupRef = useRef<THREE.Group | null>(null);
  const requestRef = useRef<number | null>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMissingModel, setIsMissingModel] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotInfo | null>(null);
  const currentAccent = ACCENT_THEMES[data.accentTheme];

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const selectedHotspotRef = useRef(selectedHotspot);
  useEffect(() => {
    selectedHotspotRef.current = selectedHotspot;
  }, [selectedHotspot]);

  // Handle visual canvas filter styling depending on visual modes
  const getCanvasFilter = () => {
    return "none";
  };

  // Main 3D Scene Initialization
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // WebGL fog removed to guarantee perfectly flat solid background behind the model

    // 2. Create Camera - Zoomed in closer to the model (Z from 4.5 to 3.2)
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
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
    renderer.toneMappingExposure = 1.2; // Slightly boosted exposure for brilliant specular highlights

    // 4. Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.8;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;

    // 5. Lighting Setup (Super high-intensity tactical spotlights & highlights)
    // Ambient Light (Dim blue/dark ambient)
    const ambient = new THREE.AmbientLight(0x0f172a, 0.35); // Deep slate blue ambient
    scene.add(ambient);

    // Directional Shadow-casting Light (Key White Light) - Boosted Intensity
    const dirLight = new THREE.DirectionalLight(0xffffff, 4.0);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    // Accent Spotlight 1 - Key Light (Front-Left-Top) - Massive High-Intensity White
    const spotlight1 = new THREE.SpotLight(new THREE.Color(0xffffff), 80, 25, Math.PI / 4, 0.45, 1);
    spotlight1.position.set(-5, 6, 4);
    spotlight1.castShadow = true;
    spotlight1.shadow.mapSize.width = 1024;
    spotlight1.shadow.mapSize.height = 1024;
    spotlight1.name = "keySpotlight";
    scene.add(spotlight1);

    // Accent Spotlight 2 - Fill Light (Front-Right-Top) - Boosted Intensity White
    const spotlight2 = new THREE.SpotLight(new THREE.Color(0xffffff), 45, 22, Math.PI / 3.5, 0.5, 1);
    spotlight2.position.set(5, 5, 3.5);
    spotlight2.castShadow = false; // Disable shadow on fill light to optimize rendering performance
    spotlight2.name = "fillSpotlight";
    scene.add(spotlight2);

    // Accent Spotlight 3 - Rim/Back Light (Behind-Top-Center) - Massive Intensity Rim Glow
    const spotlight3 = new THREE.SpotLight(new THREE.Color(0xffffff), 95, 22, Math.PI / 3, 0.6, 1);
    spotlight3.position.set(0, 5, -5.5);
    spotlight3.castShadow = true;
    spotlight3.name = "rimSpotlight";
    scene.add(spotlight3);

    // Accent Spotlight 4 - Direct Overhead Spotlight - Adds brilliant reflections on gun slide
    const spotlightTop = new THREE.SpotLight(new THREE.Color(0xffffff), 60, 15, Math.PI / 6, 0.5, 1);
    spotlightTop.position.set(0, 7, 0);
    spotlightTop.castShadow = true;
    spotlightTop.name = "topSpotlight";
    scene.add(spotlightTop);

    // Soft Cyan/Blue Point Fill Light from underneath - Double Intensity Glow
    const pointLight = new THREE.PointLight(0x0072ff, 8, 7);
    pointLight.position.set(0, -2.5, 1.5);
    pointLight.name = "underfillPointLight";
    scene.add(pointLight);

    // 6. Gun Group (holds the loaded GLB model for easy rotation)
    const gunGroup = new THREE.Group();
    scene.add(gunGroup);
    gunGroupRef.current = gunGroup;


    // 7. Load GLB Model
    const loader = new GLTFLoader();
    
    loader.load(
      "/gun.glb",
      (gltf) => {
        setIsLoading(false);
        const model = gltf.scene;

        // Traverse mesh to activate metallic tactical textures & shadow casting
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness, 0.35); // Metal reflections
              mat.metalness = Math.max(mat.metalness, 0.85); // High metallic steel polymer feel
              mat.side = THREE.DoubleSide;
            }
          }
        });

        // Center model geometry to the pivot point (0,0,0)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Offset model position so it rests perfectly centered
        model.position.sub(center);
        
        // Scale model dynamically
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.5 / maxDim; // target size of approx 2.5 units
        gunGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        gunGroup.add(model);

        // Gentle entrance spin
        gsap.from(gunGroup.rotation, {
          y: Math.PI * 2,
          duration: 2.2,
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
        console.error("Error loading model", error);
        setIsLoading(false);
        setIsMissingModel(true);
      }
    );

    // 8. Animation & Projection Render Loop
    const clock = new THREE.Clock();
    let isVisible = true;
    let animId: number | null = null;

    const animate = () => {
      if (!isVisible) return;
      
      const delta = clock.getDelta();
      
      // Update Orbit Controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Auto rotation of gun group if active
      if (gunGroupRef.current && autoRotateRef.current && !selectedHotspotRef.current) {
        gunGroupRef.current.rotation.y += delta * 0.08;
      }

      // Update Holographic 3D-to-2D Floating Card projection in real-time (buttery smooth 60+ FPS)
      if (
        floatingCardRef.current &&
        selectedHotspotRef.current &&
        cameraRef.current &&
        gunGroupRef.current &&
        containerRef.current
      ) {
        const vector = selectedHotspotRef.current.position3D.clone();
        // Get the world position of the hotspot
        vector.applyMatrix4(gunGroupRef.current.matrixWorld);
        
        // Project to normalized device coordinates (-1 to +1)
        vector.project(cameraRef.current);
        
        // Convert to screen space pixels
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        const x = (vector.x * 0.5 + 0.5) * w;
        const y = (-(vector.y) * 0.5 + 0.5) * h;
        
        // Apply position to wrapper directly for hardware-accelerated translation
        floatingCardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        floatingCardRef.current.style.opacity = "1";
        floatingCardRef.current.style.pointerEvents = "auto";
      } else if (floatingCardRef.current) {
        floatingCardRef.current.style.opacity = "0";
        floatingCardRef.current.style.pointerEvents = "none";
      }

      // Render Scene
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

    // 9. Resize Listener
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !controlsRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();

      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (animId) {
        cancelAnimationFrame(animId);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update underfill pointlight color dynamically when user switches accents in Design Suite
  useEffect(() => {
    if (sceneRef.current) {
      const underfill = sceneRef.current.getObjectByName("underfillPointLight") as THREE.PointLight;
      if (underfill) underfill.color.set(currentAccent.hex);
    }
  }, [data.accentTheme, currentAccent]);

  // Smooth Focus Animation on Hotspot Click
  const handleHotspotClick = (h: HotspotInfo) => {
    if (!cameraRef.current || !controlsRef.current || !gunGroupRef.current) return;
    
    setAutoRotate(false);
    setSelectedHotspot(h);

    const targetPosWorld = h.targetPos.clone().applyMatrix4(gunGroupRef.current.matrixWorld);

    gsap.to(controlsRef.current.target, {
      x: targetPosWorld.x,
      y: targetPosWorld.y,
      z: targetPosWorld.z,
      duration: 1.2,
      ease: "power2.out",
    });

    gsap.to(cameraRef.current.position, {
      x: h.cameraPos.x,
      y: h.cameraPos.y,
      z: h.cameraPos.z,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (controlsRef.current) controlsRef.current.update();
      }
    });
  };

  // Reset focus back to center
  const handleResetFocus = () => {
    if (!cameraRef.current || !controlsRef.current || !gunGroupRef.current) return;
    
    setSelectedHotspot(null);
    setAutoRotate(true);

    gsap.to(controlsRef.current.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.2,
      ease: "power2.out",
    });

    gsap.to(cameraRef.current.position, {
      x: 0,
      y: 1.2,
      z: 3.2,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (controlsRef.current) controlsRef.current.update();
      }
    });
  };

  return (
    <div className="relative w-full h-[90vh] bg-black select-none overflow-hidden border-b border-zinc-900">
      
      {/* Dynamic Cinematic Gradient Background behind the 3D canvas */}
      <div className="absolute inset-0 z-0 bg-black pointer-events-none">
        {/* Soft, beautiful Tactical Blue ambient glow circle positioned directly in the center behind the model */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at center, rgba(${currentAccent.rgb}, 0.22) 0%, rgba(${currentAccent.rgb}, 0.05) 45%, rgba(0, 0, 0, 0) 70%)`
          }}
        />
        
        {/* Cinematic radial vignette overlay for dramatic depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.95)_100%)]" />
      </div>

      {/* THREE.JS CANVAS CONTAINER */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          style={{ filter: getCanvasFilter() }}
          className="w-full h-full block transition-all duration-700"
        />

        {/* Ambient Dark Atmospheric Covers */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />


      </div>

      {/* HOLOGRAPHIC 3D-TO-2D FLOATING GLASS CARD LAYER (EMERGES OUTWARDS DIRECTLY FROM THE MODEL) */}
      <div
        ref={floatingCardRef}
        className="absolute top-0 left-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* Holographic Target Pulsing Dot at (0, 0) */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-[#0072ff] shadow-[0_0_14px_#0072ff] animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-[#0072ff] shadow-[0_0_8px_#0072ff]" />
        </div>

        {/* Holographic Dashed Diagonal Connector Line */}
        <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0 }}>
          {/* Vertical dashed line on mobile, diagonal leading to the empty right side on desktop */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-80"
            stroke="#0072ff"
            strokeWidth="1.5"
            strokeDasharray="4, 4"
            className="md:hidden drop-shadow-[0_0_4px_rgba(0,114,255,0.7)]"
          />
          <line
            x1="0"
            y1="0"
            x2="260"
            y2="-50"
            stroke="#0072ff"
            strokeWidth="1.5"
            strokeDasharray="4, 4"
            className="hidden md:block drop-shadow-[0_0_4px_rgba(0,114,255,0.7)]"
          />
        </svg>

        {/* Holographic Glassmorphic Card Body - Radiused & Glass effect (Zero Overlap Position next to the model) */}
        {selectedHotspot && (
          <div
            className="absolute left-[-160px] top-[-280px] md:left-[260px] md:top-[-120px] w-80 md:w-96 p-6 rounded-2xl bg-black/75 backdrop-blur-xl border border-zinc-900/40 shadow-2xl pointer-events-auto select-auto animate-fade-in flex flex-col justify-between"
            style={{
              borderColor: "rgba(0, 114, 255, 0.25)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 114, 255, 0.08)",
            }}
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0072ff]" />
                <h3 className="font-outfit text-sm font-bold text-white tracking-wide uppercase">
                  {selectedHotspot.titleTr}
                </h3>
              </div>
              <p className="text-zinc-300 text-xs font-light leading-relaxed">
                {selectedHotspot.descTr}
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-end text-[10px] font-outfit tracking-widest uppercase">
              <button
                onClick={handleResetFocus}
                className="text-[#0072ff] font-bold hover:text-white transition-colors cursor-pointer"
              >
                Geri Dön
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ULTRA-PREMIUM TACTICAL HUD INTERFACE LAYER */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6">
        
        {/* Top Header Row - Pushed down below the fixed h-16 headbar */}
        <div className="flex items-start justify-between w-full pointer-events-auto pt-20 md:pt-22">
          {/* Brand & Dynamic Model Identity */}
          <div className="space-y-1">
            <h1
              className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-zinc-500 transition-colors"
              style={{ color: currentAccent.hex }}
            >
              {data.brandName} {"// Weapon Accessory Design Lab"}
            </h1>
            <h2 className="font-cinzel text-2xl md:text-3xl tracking-widest text-white uppercase font-extrabold">
              {data.productName}
            </h2>
          </div>
        </div>

        {/* Bottom Interactive Area */}
        <div className="flex flex-col md:flex-row items-end justify-between w-full pointer-events-auto gap-4">
          
          {/* Left: Active Hotspot Information Panel */}
          <div className="w-full max-w-md transition-all duration-500 transform">
            <div className="p-4 rounded-xl bg-black/55 backdrop-blur-sm border border-zinc-900 text-zinc-500 text-xs font-light tracking-wide max-w-sm flex items-center gap-2">
              <Compass className="w-4 h-4 animate-pulse" style={{ color: currentAccent.hex }} />
              <span>Mekanizmayı incelemek için sürükleyin, detaylar için sağdaki menüden seçim yapın.</span>
            </div>
          </div>

          {/* Right: Quick Selection Sidebar Panel */}
          <div
            className="w-full md:w-64 p-5 rounded-2xl border bg-black/85 backdrop-blur-md space-y-3 shadow-xl"
            style={{ borderColor: `rgba(${currentAccent.rgb}, 0.15)` }}
          >
            <h4 className="font-cinzel text-[10px] tracking-[0.25em] text-zinc-400 font-bold uppercase pb-1.5 border-b border-zinc-900/60">
              Mekanik Anatomi
            </h4>
            <div className="flex flex-col gap-1.5">
              {HOTSPOTS.map((h) => {
                const isActive = selectedHotspot?.id === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => handleHotspotClick(h)}
                    className="w-full text-left px-3 py-2 rounded text-xs transition-all duration-300 flex items-center justify-between group"
                    style={{
                      backgroundColor: isActive ? `rgba(${currentAccent.rgb}, 0.08)` : "rgba(255,255,255,0.02)",
                      border: isActive ? `1px solid rgba(${currentAccent.rgb}, 0.3)` : "1px solid transparent",
                    }}
                  >
                    <span
                      className="font-medium tracking-wide transition-colors text-zinc-400 group-hover:text-white"
                      style={{ color: isActive ? currentAccent.hex : "" }}
                    >
                      {h.title}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${
                        isActive ? "opacity-100 text-white translate-x-0" : "-translate-x-1"
                      }`}
                      style={{ color: isActive ? currentAccent.hex : "" }}
                    />
                  </button>
                );
              })}
              {selectedHotspot && (
                <button
                  onClick={handleResetFocus}
                  className="w-full text-center mt-1 py-1.5 text-[9px] font-cinzel font-bold text-zinc-500 hover:text-white uppercase transition-colors"
                >
                  Genel Görünüme Dön
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3D LOADER HUD STATE */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="text-center space-y-6 max-w-sm px-6">
            <h1
              className="font-cinzel text-sm tracking-[0.3em] uppercase font-extrabold animate-pulse"
              style={{ color: currentAccent.hex }}
            >
              ATAC
            </h1>
            
            {/* Luxury Minimal Gold/Accent Progress Bar */}
            <div className="relative h-[2px] w-52 bg-zinc-900 overflow-hidden rounded">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-300 rounded"
                style={{
                  width: `${loadingProgress}%`,
                  backgroundColor: currentAccent.hex,
                  boxShadow: `0 0 10px rgba(${currentAccent.rgb}, 0.8)`,
                }}
              />
            </div>
            
            <div
              className="font-outfit text-[10px] tracking-widest font-light"
              style={{ color: currentAccent.hex, opacity: 0.7 }}
            >
              {loadingProgress}%
            </div>
          </div>
        </div>
      )}

      {/* MODEL MISSING WARNING / SETUP ASSISTANT */}
      {isMissingModel && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 p-6 pointer-events-auto">
          <div
            className="w-full max-w-xl p-8 rounded-2xl border bg-zinc-950 text-left space-y-6 shadow-2xl relative"
            style={{ borderColor: `rgba(${currentAccent.rgb}, 0.25)` }}
          >
            <span className="corner-bottom" />
            
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `rgba(${currentAccent.rgb}, 0.1)`, color: currentAccent.hex }}
              >
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-sm tracking-widest text-zinc-400 font-bold uppercase">
                  3D Taktik Sahne Kurulumu
                </h3>
                <h2 className="font-cinzel text-lg font-bold text-white uppercase tracking-wider">
                  gun.glb Dosyası Bekleniyor
                </h2>
              </div>
            </div>

            <p className="text-zinc-400 text-xs font-light leading-relaxed">
              3D Tabanca İnceleme sahnesinin aktif olabilmesi için, taktiksel modelinizi veya `.blend` dosyanızı **`gun.glb`** formatına dönüştürüp projenin **`public/`** klasörüne kaydetmeniz gerekmektedir.
            </p>

            <div className="space-y-3 bg-black/60 p-4 rounded-xl border border-zinc-900 text-xs font-light">
              <p className="font-cinzel text-[10px] tracking-wider text-zinc-500 font-bold uppercase mb-2">
                Adım Adım İhracat ve Kurulum:
              </p>
              <ol className="list-decimal pl-4 space-y-2 text-zinc-400">
                <li>Bilgisayarınızda **Blender**&apos;ı açın ve tabanca tasarımınızın olduğu `.blend` dosyanızı yükleyin.</li>
                <li>Sol üst menüden **File (Dosya) &gt; Export &gt; glTF 2.0 (.glb/.gltf)** seçeneğini tıklayın.</li>
                <li>Dosya formatını **glTF Binary (.glb)** olarak ayarlayın.</li>
                <li>Dosya ismini **`gun.glb`** olarak belirleyin ve şu hedef klasöre kaydedin:
                  <div className="mt-1 p-2 bg-zinc-950 text-[10px] font-mono border border-zinc-900 text-zinc-300 select-all overflow-x-auto whitespace-nowrap rounded">
                    c:\Users\emirt\Downloads\frames\public\gun.glb
                  </div>
                </li>
                <li>İhracattan sonra bu tarayıcı sayfasını yenileyin. Sahne otomatik olarak 3D Tabancanızı yükleyecektir!</li>
              </ol>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[9px] tracking-widest font-cinzel text-zinc-600 uppercase">
                Status: Awaiting Tactical Asset
              </span>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-[10px] font-cinzel font-bold text-black tracking-widest uppercase rounded transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: currentAccent.hex,
                  boxShadow: `0 0 15px rgba(${currentAccent.rgb}, 0.2)`,
                }}
              >
                Sahneyi Yeniden Yükle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
