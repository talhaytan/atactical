"use client";

import React, { useEffect, useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { WebsiteData, ACCENT_THEMES } from "./Customizer";

interface HeadbarProps {
  data: WebsiteData;
}

export default function Headbar({ data }: HeadbarProps) {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentAccent = ACCENT_THEMES[data.accentTheme];

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Smooth scroll tracking to fade from transparent to solid black
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Reaches full solid opacity at 150px of scrolling
      const opacity = Math.min(scrollY / 150, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1. Main Premium Headbar */}
      <header
        className="fixed top-0 left-0 w-full h-[70px] z-50 transition-all duration-300 border-b select-none"
        style={{
          // Solid near-black background with premium lowered maximum opacity (0.85)
          background: `rgba(11, 11, 11, ${scrollOpacity * 0.85})`,
          // Premium glassmorphism dynamic backdrop blur
          backdropFilter: scrollOpacity > 0.05 ? `blur(${scrollOpacity * 10}px)` : "none",
          WebkitBackdropFilter: scrollOpacity > 0.05 ? `blur(${scrollOpacity * 10}px)` : "none",
          // Bottom border smoothly transitions to the canvas accent color (Tactical Blue)
          borderColor: `rgba(${currentAccent.rgb}, ${scrollOpacity * 0.22})`,
          // Soft tactical blue ambient glow/shadow under the header on scroll
          boxShadow: scrollOpacity > 0.1 
            ? `0 10px 30px -10px rgba(${currentAccent.rgb}, ${scrollOpacity * 0.15}), 0 4px 20px rgba(0, 0, 0, 0.65)`
            : "none",
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between relative">
          
          {/* LEFT SIDE LINKS - Desktop */}
          <nav className="hidden md:flex items-center gap-10 w-1/3">
            <a
              href="#kilif"
              onClick={(e) => handleScrollToSection(e, "kilif")}
              className="font-outfit text-[12px] tracking-[0.2em] font-extrabold text-zinc-400 hover:text-white uppercase transition-all duration-300 group relative"
            >
              <span>Kılıf</span>
              <span
                className="absolute bottom-[-6px] left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: currentAccent.hex }}
              />
            </a>
            <a
              href="#kapak"
              onClick={(e) => handleScrollToSection(e, "kapak")}
              className="font-outfit text-[12px] tracking-[0.2em] font-extrabold text-zinc-400 hover:text-white uppercase transition-all duration-300 group relative"
            >
              <span>Kapak</span>
              <span
                className="absolute bottom-[-6px] left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: currentAccent.hex }}
              />
            </a>
          </nav>

          {/* CENTERED LOGO WORKSPACE */}
          <div className="flex items-center justify-center w-full md:w-1/3 h-full">
            <a href="#" className="relative group cursor-pointer flex items-center justify-center pointer-events-auto">
              {!useFallbackLogo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/ATAC LOGO.svg"
                  alt="ATAC LOGO"
                  onError={() => setUseFallbackLogo(true)}
                  className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center gap-2 group">
                  <div className="relative flex items-center justify-center">
                    <Shield
                      className="w-8 h-8 transition-transform duration-500 group-hover:rotate-180"
                      style={{
                        color: currentAccent.hex,
                        filter: `drop-shadow(0 0 8px rgba(${currentAccent.rgb}, 0.6))`,
                      }}
                    />
                    <span className="absolute text-[8px] font-mono font-extrabold uppercase" style={{ color: "#ffffff" }}>
                      AT
                    </span>
                  </div>
                  <span
                    className="font-outfit text-lg tracking-[0.3em] font-black uppercase transition-all duration-500 text-white"
                    style={{
                      textShadow: `0 0 10px rgba(${currentAccent.rgb}, 0.65)`,
                    }}
                  >
                    ATAC
                  </span>
                </div>
              )}
            </a>
          </div>

          {/* RIGHT SIDE LINKS - Desktop */}
          <nav className="hidden md:flex items-center justify-end gap-10 w-1/3">
            <a
              href="#hakkimizda"
              onClick={(e) => handleScrollToSection(e, "hakkimizda")}
              className="font-outfit text-[12px] tracking-[0.2em] font-extrabold text-zinc-400 hover:text-white uppercase transition-all duration-300 group relative"
            >
              <span>Hakkımızda</span>
              <span
                className="absolute bottom-[-6px] left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: currentAccent.hex }}
              />
            </a>
            <a
              href="#misyonumuz"
              onClick={(e) => handleScrollToSection(e, "misyonumuz")}
              className="font-outfit text-[12px] tracking-[0.2em] font-extrabold text-zinc-400 hover:text-white uppercase transition-all duration-300 group relative"
            >
              <span>Misyonumuz</span>
              <span
                className="absolute bottom-[-6px] left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: currentAccent.hex }}
              />
            </a>
          </nav>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 rounded-full border border-zinc-800 bg-black/40 hover:border-zinc-700 transition-colors pointer-events-auto"
            style={{ color: currentAccent.hex }}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Mobile Responsive Navigation Drawer */}
      <div
        className={`fixed top-[70px] left-0 w-full bg-black border-b border-zinc-900 z-40 transition-all duration-500 flex flex-col items-center gap-6 py-8 px-6 md:hidden ${
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <a
          href="#kilif"
          onClick={(e) => {
            setMobileMenuOpen(false);
            handleScrollToSection(e, "kilif");
          }}
          className="font-outfit text-sm tracking-[0.2em] text-zinc-400 hover:text-white uppercase font-extrabold transition-colors"
        >
          Kılıf
        </a>
        <a
          href="#kapak"
          onClick={(e) => {
            setMobileMenuOpen(false);
            handleScrollToSection(e, "kapak");
          }}
          className="font-outfit text-sm tracking-[0.2em] text-zinc-400 hover:text-white uppercase font-extrabold transition-colors"
        >
          Kapak
        </a>
        <a
          href="#hakkimizda"
          onClick={(e) => {
            setMobileMenuOpen(false);
            handleScrollToSection(e, "hakkimizda");
          }}
          className="font-outfit text-sm tracking-[0.2em] text-zinc-400 hover:text-white uppercase font-extrabold transition-colors"
        >
          Hakkımızda
        </a>
        <a
          href="#misyonumuz"
          onClick={(e) => {
            setMobileMenuOpen(false);
            handleScrollToSection(e, "misyonumuz");
          }}
          className="font-outfit text-sm tracking-[0.2em] text-zinc-400 hover:text-white uppercase font-extrabold transition-colors"
        >
          Misyonumuz
        </a>
      </div>
    </>
  );
}