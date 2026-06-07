"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WebsiteData, ACCENT_THEMES } from "./Customizer";
import { Compass, Sparkles, Layers, ShieldCheck, Heart, Cpu, Volume2 } from "lucide-react";
import MagPlateViewer from "./MagPlateViewer";

gsap.registerPlugin(ScrollTrigger);

interface EditorialProps {
  data: WebsiteData;
}

export default function EditorialSections({ data }: EditorialProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentAccent = ACCENT_THEMES[data.accentTheme];

  // Highly optimized 60+ FPS direct DOM 3D Tilt & Sheen Follow handlers
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.setAttribute("data-left", rect.left.toString());
    card.setAttribute("data-top", rect.top.toString());
    card.setAttribute("data-width", rect.width.toString());
    card.setAttribute("data-height", rect.height.toString());
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    
    let left = parseFloat(card.getAttribute("data-left") || "0");
    let top = parseFloat(card.getAttribute("data-top") || "0");
    let width = parseFloat(card.getAttribute("data-width") || "0");
    let height = parseFloat(card.getAttribute("data-height") || "0");
    
    if (width === 0 || height === 0) {
      const rect = card.getBoundingClientRect();
      left = rect.left;
      top = rect.top;
      width = rect.width;
      height = rect.height;
      card.setAttribute("data-left", left.toString());
      card.setAttribute("data-top", top.toString());
      card.setAttribute("data-width", width.toString());
      card.setAttribute("data-height", height.toString());
    }

    const x = e.clientX - left;
    const y = e.clientY - top;
    
    const normalizedX = (x / width) - 0.5;
    const normalizedY = (y / height) - 0.5;
    
    const tiltMaxX = 7;
    const tiltMaxY = 7;
    
    const rotateX = -normalizedY * tiltMaxX;
    const rotateY = normalizedX * tiltMaxY;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.015)`;
    card.style.setProperty("--sheen-x", `${x}px`);
    card.style.setProperty("--sheen-y", `${y}px`);
    card.style.setProperty("--sheen-opacity", "1");
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.removeAttribute("data-left");
    card.removeAttribute("data-top");
    card.removeAttribute("data-width");
    card.removeAttribute("data-height");
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
    card.style.setProperty("--sheen-opacity", "0");
  };



  // GSAP Entrance reveals for Cards and Details
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Feature Cards Stagger Slide + Scale
    const cardsTrigger = gsap.fromTo(
      ".feature-card",
      { scale: 0.85, y: 60, opacity: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".feature-cards-trigger",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Detail Grid items Stagger
    const detailsTrigger = gsap.fromTo(
      ".detail-block",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".details-section-trigger",
          start: "top 80%",
        },
      }
    );

    // Hakkımızda Left Text Entrance
    const hakkimizdaTextTrigger = gsap.fromTo(
      ".hakkimizda-text",
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hakkimizda-trigger",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Hakkımızda Right Cards Stagger
    const hakkimizdaCardsTrigger = gsap.fromTo(
      ".hakkimizda-card",
      { scale: 0.9, y: 40, opacity: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hakkimizda-trigger",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Misyonumuz Header Entrance
    const misyonumuzHeaderTrigger = gsap.fromTo(
      ".misyonumuz-header",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".misyonumuz-trigger",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Misyonumuz Cards Stagger
    const misyonumuzCardsTrigger = gsap.fromTo(
      ".misyonumuz-card",
      { scale: 0.85, y: 60, opacity: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".misyonumuz-trigger",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      cardsTrigger.scrollTrigger?.kill();
      cardsTrigger.kill();
      detailsTrigger.scrollTrigger?.kill();
      detailsTrigger.kill();
      hakkimizdaTextTrigger.scrollTrigger?.kill();
      hakkimizdaTextTrigger.kill();
      hakkimizdaCardsTrigger.scrollTrigger?.kill();
      hakkimizdaCardsTrigger.kill();
      misyonumuzHeaderTrigger.scrollTrigger?.kill();
      misyonumuzHeaderTrigger.kill();
      misyonumuzCardsTrigger.scrollTrigger?.kill();
      misyonumuzCardsTrigger.kill();
    };
  }, [data]);

  // Reusable, high-end 3D tilt detail card renderer
  const renderDetailCard = (
    icon: React.ReactNode,
    subtitle: string,
    title: string,
    description: string,
    imageSrc?: string,
    extraDescription?: string
  ) => {
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="detail-block luxury-card rounded-2xl p-8 text-center luxury-corners overflow-hidden relative flex flex-col justify-between"
      >
        {/* Glossy Sheen Overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: "var(--sheen-opacity, 0)",
            background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
          }}
        />
        <span className="corner-bottom" />
        <div className="relative z-20 flex-1 flex flex-col justify-start">
          <p className="font-cinzel text-lg font-bold text-white mb-1">{title}</p>
          <h4 className="font-cinzel text-xs tracking-widest text-zinc-400 uppercase mb-3">
            {subtitle}
          </h4>

          {description && (
            <p className="text-zinc-500 text-xs leading-relaxed font-light mb-2">
              {description}
            </p>
          )}

          {imageSrc && (
            <div className="relative w-full h-60 my-4 rounded-xl bg-zinc-950/40 border border-zinc-900/60 p-2 flex items-center justify-center overflow-hidden group/img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,114,255,0.15)] transition-transform duration-500 group-hover/img:scale-110"
              />
            </div>
          )}

          {extraDescription && (
            <p className="text-zinc-400 text-xs leading-relaxed font-normal mt-2 text-center">
              {extraDescription}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Dynamic Product Specifications Layout
  const renderProductDetails = () => {
    switch (data.category) {
      case "perfume":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 w-full">
            {renderDetailCard(
              <Compass className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Top Notes",
              "Citrus & Saffron",
              "An immediate bright spark of Sicilian bergamot blended with hand-picked red saffron thread extracts."
            )}
            {renderDetailCard(
              <Sparkles className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Heart Notes",
              "Midnight Jasmine",
              "The rich emotional core. Egyptian blooming jasmine coupled with velvet Damascus rose essence."
            )}
            {renderDetailCard(
              <Layers className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Base Notes",
              "Agarwood & Amber",
              "A warm linger. Luxurious Cambodian oud wood, amber resins, and creamy Madagascar vanilla bean pod."
            )}
          </div>
        );

      case "phone":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 w-full">
            {renderDetailCard(
              <Layers className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "",
              "ATACEX",
              "",
              "/kapak1.png"
            )}
            {/* Combined Text Card: 144Hz X-Pro LED & A18 Neural Bionic */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="detail-block luxury-card rounded-2xl p-8 text-left luxury-corners overflow-hidden relative flex flex-col justify-between"
              style={{
                boxShadow: `0 15px 30px -10px rgba(0,0,0,0.5)`
              }}
            >
              {/* Glossy Sheen Overlay */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  opacity: "var(--sheen-opacity, 0)",
                  background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
                }}
              />
              <span className="corner-bottom" />
              <div className="relative z-20 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-outfit tracking-[0.25em] uppercase font-bold" style={{ color: currentAccent.hex }}>
                    ATAC Lab // Tactical Extension
                  </span>
                  <h4 className="font-outfit text-md font-bold text-white uppercase tracking-wider">
                    Yedek Şarjör Adaptörü
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-light pt-2">
                    Bu taktiksel adaptör, yedek şarjörü namlu altında konumlandırarak şarjör değişim süresini kısaltır ve ekstra ağırlığıyla namlu şahlanmasını azaltarak isabeti artırır. Acil durumlarda mühimmata hızlı erişim sağlarken kolayca monte edilebilir. Silahı modifiye etmeden takılabilen bu üstün eklenti, mühimmatınızı koruyarak ve ekstra tutuş desteği sağlayarak sahadaki taktiksel gücünüzü zirveye taşır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "chocolate":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 w-full">
            {renderDetailCard(
              <Compass className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Pure Origin",
              "Ecuadorian Criollo",
              "Single-estate cacao beans sourced directly. Hand-picked and slowly roasted to express natural floral notes."
            )}
            {renderDetailCard(
              <Heart className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Olfactory Taste",
              "Sea Salt Caramels",
              "Slow-crystallized organic salted honey caramel center that yields smoothly to absolute chocolate luxury."
            )}
            {renderDetailCard(
              <Layers className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Noble Elements",
              "24K Gold Leaf flake",
              "Delicate edible gold foil garnish. Crafted in precise details for sensory brilliance and majestic presentation."
            )}
          </div>
        );

      default: // audio / default headphones
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 w-full">
            {renderDetailCard(
              <Layers className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Acoustic Design",
              "Matte CAD Alloys",
              "Pressure-isolated headband suspension coupled with custom memory foam cushions for flawless noise isolation."
            )}
            {renderDetailCard(
              <Volume2 className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Studio Acoustics",
              "40mm Diamond LCP",
              "Ultra-light diamond-like carbon diaphragms. Renders fast, responsive bass textures and crystal high ranges."
            )}
            {renderDetailCard(
              <Cpu className="w-5 h-5" style={{ color: currentAccent.hex }} />,
              "Performance Telemetry",
              "Dual QN2 Engine",
              "Real-time active noise cancellation mapping. Samples exterior noise dynamically at 700 times per second."
            )}
          </div>
        );
    }
  };

  return (
    <div ref={sectionRef} className="relative bg-black w-full overflow-hidden select-none">
      
      {/* 1. FEATURE SECTION (KILIF) */}
      <section id="kilif" className="scroll-mt-[70px] feature-cards-trigger max-w-6xl mx-auto px-6 pt-[90px] pb-24 md:pb-28 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-16 -mt-10">
          <h2 className="font-cinzel text-xs tracking-[0.3em] text-zinc-500 uppercase mb-3">
            design by ATAC
          </h2>
          <h3
            className="font-cinzel text-2xl md:text-4xl tracking-widest uppercase font-bold text-white mb-4"
            style={{ textShadow: `0 0 15px rgba(${currentAccent.rgb}, 0.15)` }}
          >
            Kılıf
          </h3>
          <div
            className="w-12 h-[1px] mx-auto"
            style={{ backgroundColor: currentAccent.hex }}
          />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="feature-card luxury-card rounded-2xl p-8 luxury-corners flex flex-col justify-between overflow-hidden h-full"
          >
            {/* Glossy Sheen Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
              style={{
                opacity: "var(--sheen-opacity, 0)",
                background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
              }}
            />
            <span className="corner-bottom" />
            <div className="relative z-20 flex flex-col h-full">
              
              {/* Product Image - Enlarged slightly */}
              <div className="relative w-full h-80 mb-6 rounded-xl bg-zinc-950/40 border border-zinc-900/60 p-2 flex items-center justify-center overflow-hidden group/img flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/spider.png"
                  alt="Spider Model"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,114,255,0.15)] transition-transform duration-500 scale-190 group-hover/img:scale-200"
                />
              </div>

              <h4 className="font-cinzel text-sm tracking-widest text-white uppercase font-bold mb-3 flex items-center gap-2">
                <span>Örüm</span>
                <span className="font-outfit text-[11px] tracking-wider font-extrabold" style={{ color: currentAccent.hex }}>
                  // T1
                </span>
              </h4>
              <p className="text-zinc-500 text-sm leading-relaxed font-light flex-1">
                {data.feature1 || "Gotik zırh mimarisini güçlü şekilde yansıtan bu tasarım, örümcek motifi ve keskin metalik hatlarıyla ATAC serisine soğuk, endüstriyel estetik kazandırıyor."}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="feature-card luxury-card rounded-2xl p-8 luxury-corners flex flex-col justify-between overflow-hidden h-full"
          >
            {/* Glossy Sheen Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
              style={{
                opacity: "var(--sheen-opacity, 0)",
                background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
              }}
            />
            <span className="corner-bottom" />
            <div className="relative z-20 flex flex-col h-full">

              {/* Product Image - Enlarged and visually matched to match other models */}
              <div className="relative w-full h-80 mb-6 rounded-xl bg-zinc-950/40 border border-zinc-900/60 p-2 flex items-center justify-center overflow-hidden group/img flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/flower.png"
                  alt="Flower Model"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,114,255,0.15)] transition-transform duration-500 scale-[1.96] group-hover/img:scale-[2.06]"
                />
              </div>

              <h4 className="font-cinzel text-sm tracking-widest text-white uppercase font-bold mb-3 flex items-center gap-2">
                <span>Ağıt</span>
                <span className="font-outfit text-[11px] tracking-wider font-extrabold" style={{ color: currentAccent.hex }}>
                  // T2
                </span>
              </h4>
              <p className="text-zinc-500 text-sm leading-relaxed font-light flex-1">
                {data.feature2 || "Geleneksel gravür sanatını 3 Boyutla birleştiren bu klasik tasarım, gümüş zambak motifleriyle taktiksel, zarif bir derinlik katıyor."}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="feature-card luxury-card rounded-2xl p-8 luxury-corners flex flex-col justify-between overflow-hidden h-full"
          >
            {/* Glossy Sheen Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
              style={{
                opacity: "var(--sheen-opacity, 0)",
                background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
              }}
            />
            <span className="corner-bottom" />
            <div className="relative z-20 flex flex-col h-full">

              {/* Product Image - Enlarged slightly */}
              <div className="relative w-full h-80 mb-6 rounded-xl bg-zinc-950/40 border border-zinc-900/60 p-2 flex items-center justify-center overflow-hidden group/img flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/spider flower.png"
                  alt="Spider Flower Model"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,114,255,0.15)] transition-transform duration-500 scale-190 group-hover/img:scale-200"
                />
              </div>

              <h4 className="font-cinzel text-sm tracking-widest text-white uppercase font-bold mb-3 flex items-center gap-2">
                <span>Ulug</span>
                <span className="font-outfit text-[11px] tracking-wider font-extrabold" style={{ color: currentAccent.hex }}>
                  // T3
                </span>
              </h4>
              <p className="text-zinc-500 text-sm leading-relaxed font-light flex-1">
                {data.feature3 || "Mat siyah zemin üzerinde kırmızı ve beyaz çizgilerle şekillenen bu tasarım, örümcek zambağının tehlikeli aurasını agresif, taktiksel bir esere dönüştürüyor."}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Transition Divider 1 */}
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="luxury-divider" style={{ opacity: 0.25 }} />
      </div>

      {/* 2. PRODUCT DETAILS SECTION (KAPAK) */}
      <section id="kapak" className="scroll-mt-[70px] details-section-trigger max-w-6xl mx-auto px-6 pt-[90px] pb-24 md:pb-28 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-16 -mt-10">
          <h2 className="font-cinzel text-xs tracking-[0.3em] text-zinc-500 uppercase mb-3">
            design by ATAC
          </h2>
          <h3
            className="font-cinzel text-2xl md:text-4xl tracking-widest uppercase font-bold text-white mb-4"
            style={{ textShadow: `0 0 15px rgba(${currentAccent.rgb}, 0.15)` }}
          >
            TAKTİK ŞARJÖR KAPAK
          </h3>
          <div
            className="w-12 h-[1px] mx-auto"
            style={{ backgroundColor: currentAccent.hex }}
          />
        </div>

        {/* Responsive Grid: Left is 3D Model, Right is Spec Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mt-12">
          {/* Left: 3D MagPlateViewer Card */}
          <div 
            className="lg:col-span-7 luxury-card rounded-2xl overflow-hidden flex flex-col justify-between p-6 shadow-2xl relative"
            style={{
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.7), 0 0 25px rgba(${currentAccent.rgb}, 0.03)`
            }}
          >
            <div className="space-y-1.5 mb-4 relative z-20">
              <span className="text-[10px] font-outfit tracking-[0.2em] uppercase font-bold" style={{ color: currentAccent.hex }}>
                ATAC Lab // Tactical Extension
              </span>
              <h4 className="font-outfit text-lg font-bold text-white uppercase tracking-wider">
                Taktik Şarjör Kapak Uygulaması
              </h4>
            </div>

            {/* Interactive WebGL 3D Canvas */}
            <div className="flex-1 min-h-[350px] rounded-xl bg-black/40 border border-zinc-900/40 relative overflow-hidden">
              <MagPlateViewer accentColor={currentAccent.hex} accentRgb={currentAccent.rgb} />
            </div>
          </div>

          {/* Right: Technical Spec Cards */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {renderProductDetails()}
          </div>
        </div>
      </section>

      {/* Transition Divider 2 */}
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="luxury-divider" style={{ opacity: 0.25 }} />
      </div>

      {/* 3. HAKKIMIZDA SECTION */}
      <section id="hakkimizda" className="hakkimizda-trigger scroll-mt-[70px] max-w-6xl mx-auto px-6 py-24 md:py-28 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Description */}
          <div className="hakkimizda-text lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-outfit tracking-[0.25em] uppercase font-bold" style={{ color: currentAccent.hex }}>
                design by ATAC // Savunma ve Teknolojik Tasarım Grubu
              </span>
              <h2
                className="font-outfit text-3xl md:text-5xl tracking-widest uppercase font-extrabold text-white"
                style={{ textShadow: `0 0 15px rgba(${currentAccent.rgb}, 0.15)` }}
              >
                Hakkımızda
              </h2>
            </div>
            
            <div className="w-12 h-[1px]" style={{ backgroundColor: currentAccent.hex }} />
            
            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xl">
              Kurucusu ve tasarımcısı Emir Talha Aytan imzası taşıyan ATAC; savunma sanayii standartlarında, milimetrik hassasiyet ve fütüristik mühendislik bütünlüğüyle çalışan, üst düzey taktik aksesuar ve özelleştirilebilir tabanca aksesuarları üreten bir ileri teknoloji tasarım atölyesidir. Kullanıcısına özel şekillenen her bir şarjör kapağı, kılıf ve modüler bileşen; ağır mukavemet testlerinden geçirilerek, metalurjik estetiğin ve siber-taktiksel formun mutlak uyumuyla üretilir.
            </p>
          </div>

          {/* Right Column: Premium Metric Info Panels */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 w-full">
            {/* Panel 1 (Yerli Ar-Ge) */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="hakkimizda-card luxury-card rounded-2xl p-6 text-center overflow-hidden relative flex flex-col justify-center min-h-[140px]"
            >
              {/* Glossy Sheen Overlay */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  opacity: "var(--sheen-opacity, 0)",
                  background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
                }}
              />
              <span className="corner-bottom" />
              <span className="text-3xl font-black text-white font-outfit relative z-20" style={{ textShadow: `0 0 10px rgba(${currentAccent.rgb}, 0.3)` }}>100%</span>
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold mt-2 relative z-20">Yerli Ar-Ge</span>
            </div>
            {/* Panel 2 (Tasarım Dili) */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="hakkimizda-card luxury-card rounded-2xl p-6 text-center overflow-hidden relative flex flex-col justify-center min-h-[140px]"
            >
              {/* Glossy Sheen Overlay */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  opacity: "var(--sheen-opacity, 0)",
                  background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
                }}
              />
              <span className="corner-bottom" />
              <span className="text-3xl font-black text-white font-outfit relative z-20" style={{ textShadow: `0 0 10px rgba(${currentAccent.rgb}, 0.3)` }}>ATAC-FX</span>
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold mt-2 relative z-20">Tasarım Dili</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Divider */}
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="luxury-divider" style={{ opacity: 0.15 }} />
      </div>

      {/* 4. MISYONUMUZ SECTION */}
      <section id="misyonumuz" className="misyonumuz-trigger scroll-mt-[70px] max-w-6xl mx-auto px-6 py-24 md:py-28 relative z-20">
        <div className="misyonumuz-header text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-outfit tracking-[0.25em] uppercase font-bold" style={{ color: currentAccent.hex }}>
            design by ATAC // Vizyoner Mühendislik Zirvesi
          </span>
          <h2
            className="font-outfit text-3xl md:text-5xl tracking-widest uppercase font-extrabold text-white mt-2 mb-4"
            style={{ textShadow: `0 0 15px rgba(${currentAccent.rgb}, 0.15)` }}
          >
            Misyonumuz
          </h2>
          <div className="w-12 h-[1px] mx-auto mb-6" style={{ backgroundColor: currentAccent.hex }} />
          <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
            Sadece dayanıklı ekipman üretmekle kalmıyor; savunma sanayiinde taktiksel tasarımın, siberestetik arayüzlerin ve ergonomik üstünlüğün sınırlarını yeniden çiziyoruz. ATAC olarak misyonumuz, operatörlerin ve kullanıcıların ihtiyaç duyduğu taktik donanımları, en gelişmiş 3D modelleme standartlarında, sıfır hata toleransıyla hayata geçirmektir.
          </p>
        </div>

        {/* Pillars Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="misyonumuz-card luxury-card rounded-2xl p-8 overflow-hidden relative flex flex-col justify-start"
          >
            {/* Glossy Sheen Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
              style={{
                opacity: "var(--sheen-opacity, 0)",
                background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
              }}
            />
            <span className="corner-bottom" />
            <span className="text-[10px] tracking-[0.2em] font-bold uppercase mb-2 relative z-20" style={{ color: currentAccent.hex }}>// 01</span>
            <h4 className="font-outfit text-md font-bold text-white uppercase tracking-wider mb-3 relative z-20">Mükemmel Ergonomi</h4>
            <p className="text-zinc-500 text-xs leading-relaxed font-light relative z-20">El anatomisiyle %100 uyumlu, kaymaz taktiksel doku (stippling) entegrasyonuyla maksimum kavrama mukavemeti elde etmek.</p>
          </div>
          {/* Card 2 */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="misyonumuz-card luxury-card rounded-2xl p-8 overflow-hidden relative flex flex-col justify-start"
          >
            {/* Glossy Sheen Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
              style={{
                opacity: "var(--sheen-opacity, 0)",
                background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
              }}
            />
            <span className="corner-bottom" />
            <span className="text-[10px] tracking-[0.2em] font-bold uppercase mb-2 relative z-20" style={{ color: currentAccent.hex }}>// 02</span>
            <h4 className="font-outfit text-md font-bold text-white uppercase tracking-wider mb-3 relative z-20">İleri Materyal Bilimi</h4>
            <p className="text-zinc-500 text-xs leading-relaxed font-light relative z-20">Havacılık sınıfı titanyum alaşımları ve karbon-elyaf kompozitler kullanarak sıfır korozyon ve ömür boyu mukavemet garantisi sunmak.</p>
          </div>
          {/* Card 3 */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="misyonumuz-card luxury-card rounded-2xl p-8 overflow-hidden relative flex flex-col justify-start"
          >
            {/* Glossy Sheen Overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
              style={{
                opacity: "var(--sheen-opacity, 0)",
                background: `radial-gradient(circle 180px at var(--sheen-x, 0px) var(--sheen-y, 0px), rgba(${currentAccent.rgb}, 0.12) 0%, transparent 80%)`,
              }}
            />
            <span className="corner-bottom" />
            <span className="text-[10px] tracking-[0.2em] font-bold uppercase mb-2 relative z-20" style={{ color: currentAccent.hex }}>// 03</span>
            <h4 className="font-outfit text-md font-bold text-white uppercase tracking-wider mb-3 relative z-20">Sanal İş İstasyonu</h4>
            <p className="text-zinc-500 text-xs leading-relaxed font-light relative z-20">Kullanıcıların kendi ürünlerini 3D WebGL ortamında, milimetrik detaylarla ve hyper-bright stüdyo ışıkları altında özgürce inceleyebileceği interaktif ekosistemi yaşatmak.</p>
          </div>
        </div>
      </section>

      {/* Spacing Divider */}
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="luxury-divider" style={{ opacity: 0.15 }} />
      </div>

      {/* Ambient background glow elements */}
      <div className="absolute top-[30%] left-[-20%] w-[60%] h-[60%] gold-glow-backdrop rounded-full filter blur-[120px]" />
      <div className="absolute bottom-[30%] right-[-20%] w-[60%] h-[60%] gold-glow-backdrop rounded-full filter blur-[120px]" />


      {/* 5. PREMIUM FOOTER */}
      <footer className="w-full bg-[#070707] border-t border-zinc-900/60 py-8 relative z-30 select-none">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ATAC LOGO.svg" alt="ATAC LOGO" className="h-6 w-auto opacity-40 hover:opacity-80 transition-opacity" />
          </div>
          <p className="font-outfit text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            2025 © Copyright ATAC
          </p>
        </div>
      </footer>
    </div>
  );
}
