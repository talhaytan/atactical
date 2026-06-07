"use client";

import React, { useState, useEffect } from "react";
import GunInspector from "../components/GunInspector";
import EditorialSections from "../components/EditorialSections";
import Headbar from "../components/Headbar";
import { WebsiteData } from "../components/Customizer";
import { ArrowUp } from "lucide-react";

const DEFAULT_DATA: WebsiteData = {
  brandName: "ATAC",
  productName: "Ağıt",
  category: "phone", // Represents tactical high-tech specifications
  heroHeadline: "Taktiksel Zirve",
  heroTagline: "ATAC - Ağıt Taktik Tabanca, 3D olarak derinlemesine incelenebilir.",
  storyMessage: "Maksimum hassasiyet, dayanıklılık ve ergonomik üstünlük için tasarlandı. Ağıt, modern savunma teknolojilerinin ve metalurjik mühendisliğin mutlak zirvesini temsil eder.",
  feature1: "Gotik zırh mimarisini güçlü şekilde yansıtan bu tasarım, örümcek motifi ve keskin metalik hatlarıyla ATAC serisine soğuk, endüstriyel estetik kazandırıyor.",
  feature2: "Geleneksel gravür sanatını 3 Boyutla birleştiren bu klasik tasarım, gümüş zambak motifleriyle taktiksel, zarif bir derinlik katıyor.",
  feature3: "Mat siyah zemin üzerinde kırmızı ve beyaz çizgilerle şekillenen bu tasarım, örümcek zambağının tehlikeli aurasını agresif, taktiksel bir esere dönüştürüyor.",
  ctaHeadline: "Sentinel Sistemi Devreye Al",
  ctaMessage: "Taktiksel ateşli silahların geleceğine adım atın. Sanal iş istasyonumuzda kişisel Ağıt savunma sisteminizi özelleştirin.",
  primaryButtonText: "Atölyeye Giriş Yap",
  accentTheme: "blue",
};

export default function Home() {
  const [siteData, setSiteData] = useState<WebsiteData>(DEFAULT_DATA);
  const [isClient, setIsClient] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll height to show/hide "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Sync state with localStorage if available (to persist user changes between hot reloads!)
  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
      const saved = localStorage.getItem("velora_scrolly_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          let modified = false;
          // Auto-migrate from old brand/model names to ATAC and Ağıt
          if (parsed.brandName === "Apex Savunma") {
            parsed.brandName = "ATAC";
            modified = true;
          }
          if (parsed.productName === "Sentinel-9" || parsed.productName === "Flower") {
            parsed.productName = "Ağıt";
            modified = true;
          }
          if (parsed.heroTagline && parsed.heroTagline.includes("Flower")) {
            parsed.heroTagline = parsed.heroTagline.replace(/Flower/g, "Ağıt");
            modified = true;
          }
          if (parsed.storyMessage && parsed.storyMessage.includes("Flower")) {
            parsed.storyMessage = parsed.storyMessage.replace(/Flower/g, "Ağıt");
            modified = true;
          }
          if (parsed.ctaMessage && parsed.ctaMessage.includes("Flower")) {
            parsed.ctaMessage = parsed.ctaMessage.replace(/Flower/g, "Ağıt");
            modified = true;
          }
          
          // Force update feature1 to the new Turkish description
          if (!parsed.feature1 || !parsed.feature1.includes("Gotik zırh mimarisini")) {
            parsed.feature1 = "Gotik zırh mimarisini güçlü şekilde yansıtan bu tasarım, örümcek motifi ve keskin metalik hatlarıyla ATAC serisine soğuk, endüstriyel estetik kazandırıyor.";
            modified = true;
          }
          // Force update feature2 to the new Turkish engraving description
          if (!parsed.feature2 || !parsed.feature2.includes("3 Boyutla")) {
            parsed.feature2 = "Geleneksel gravür sanatını 3 Boyutla birleştiren bu klasik tasarım, gümüş zambak motifleriyle taktiksel, zarif bir derinlik katıyor.";
            modified = true;
          }
          // Force update feature3 to the new Turkish spider flower description
          if (!parsed.feature3 || !parsed.feature3.includes("kırmızı ve beyaz çizgilerle")) {
            parsed.feature3 = "Mat siyah zemin üzerinde kırmızı ve beyaz çizgilerle şekillenen bu tasarım, örümcek zambağının tehlikeli aurasını agresif, taktiksel bir esere dönüştürüyor.";
            modified = true;
          }
          
          if (modified) {
            localStorage.setItem("velora_scrolly_data", JSON.stringify(parsed));
          }
          setSiteData(parsed);
        } catch (e) {
          console.warn("Could not load persisted brand details", e);
        }
      }
    }, 0);
  }, []);


  if (!isClient) {
    // Elegant static dark layout during hydration loading
    return <div className="min-h-screen bg-[#0b0b0b]" />;
  }

  return (
    <main className="relative bg-[#0b0b0b] min-h-screen overflow-x-hidden">
      {/* Premium Interactive Headbar */}
      <Headbar data={siteData} />

      {/* 1. Interactive Real-Time 3D Tactical Handgun Inspector Hub */}
      <GunInspector data={siteData} />

      {/* 2. Refined Editorial Feature details grid, specifications and pulsing CTA */}
      <EditorialSections data={siteData} />

      {/* 3. Premium Interactive Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex flex-col items-center gap-1 group cursor-pointer transition-all duration-500 ease-out ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
        aria-label="Başa Dön"
      >
        {/* Glow backdrop on hover */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Circle Icon Container */}
        <div className="relative w-11 h-11 rounded-full bg-black/80 border border-zinc-800/80 group-hover:border-blue-500/60 flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
          {/* Top/Bottom luxury accents */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-[1px] bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[1px] bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
          
          <ArrowUp className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300 group-hover:animate-bounce" style={{ animationDuration: '1.5s' }} />
        </div>
        
        {/* "Başa Dön" Text */}
        <span className="font-outfit text-[9px] tracking-[0.25em] text-zinc-500 uppercase group-hover:text-blue-400 transition-colors duration-300 mt-1">
          Başa Dön
        </span>
      </button>
    </main>
  );
}

