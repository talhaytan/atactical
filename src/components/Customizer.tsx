"use client";

import React, { useState } from "react";
import { Settings, X, RotateCcw, Sparkles } from "lucide-react";

export interface WebsiteData {
  brandName: string;
  productName: string;
  category: "perfume" | "audio" | "phone" | "chocolate";
  heroHeadline: string;
  heroTagline: string;
  storyMessage: string;
  feature1: string;
  feature2: string;
  feature3: string;
  ctaHeadline: string;
  ctaMessage: string;
  primaryButtonText: string;
  accentTheme: "blue" | "cyan" | "gold" | "rosegold" | "champagne" | "platinum" | "amber";
}

interface CustomizerProps {
  data: WebsiteData;
  onChange: (newData: WebsiteData) => void;
  onReset: () => void;
}

export const ACCENT_THEMES = {
  blue: { name: "Taktiksel Mavi", hex: "#0072ff", rgb: "0, 114, 255" },
  cyan: { name: "Siber Camgöbeği", hex: "#00f0ff", rgb: "0, 240, 255" },
  gold: { name: "Vibrant Gold", hex: "#d4af37", rgb: "212, 175, 55" },
  rosegold: { name: "Rose Gold", hex: "#b76e79", rgb: "183, 110, 121" },
  champagne: { name: "Champagne", hex: "#f7e7ce", rgb: "247, 231, 206" },
  platinum: { name: "Platinum Silver", hex: "#e5e4e2", rgb: "229, 228, 226" },
  amber: { name: "Deep Amber", hex: "#ffbf00", rgb: "255, 191, 0" },
};

export default function Customizer({ data, onChange, onReset }: CustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTextChange = (field: keyof WebsiteData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const currentAccent = ACCENT_THEMES[data.accentTheme];

  return (
    <>
      {/* Floating Design Suite Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border bg-black/80 text-xs tracking-widest uppercase transition-all duration-300 group hover:scale-105"
        style={{
          borderColor: `rgba(${currentAccent.rgb}, 0.3)`,
          color: currentAccent.hex,
          boxShadow: `0 0 15px rgba(${currentAccent.rgb}, 0.15)`,
        }}
      >
        <Settings className="w-3.5 h-3.5 animate-spin-slow group-hover:rotate-90 transition-transform duration-500" />
        <span>Design Suite</span>
      </button>

      {/* Slide-out Sidebar Control Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) border-l bg-black/90 backdrop-blur-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          borderColor: `rgba(${currentAccent.rgb}, 0.15)`,
          boxShadow: `-10px 0 40px rgba(0, 0, 0, 0.8)`,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: `rgba(${currentAccent.rgb}, 0.1)` }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: currentAccent.hex }} />
              <h2 className="font-cinzel text-sm tracking-widest uppercase font-semibold">
                Brand Customizer
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200"
              style={{ color: currentAccent.hex }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* Theme & Category Setup */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-xs tracking-widest text-zinc-400 uppercase">
                Visual Identity
              </h3>

              {/* Theme Selector */}
              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-2">
                  Luxury Theme Accent
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(ACCENT_THEMES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleTextChange("accentTheme", key)}
                      className={`h-9 w-full rounded border flex items-center justify-center transition-all duration-300 ${
                        data.accentTheme === key
                          ? "border-white scale-105"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                      style={{
                        backgroundColor: "#0d0d0d",
                        boxShadow:
                          data.accentTheme === key
                            ? `0 0 10px rgba(${value.rgb}, 0.3)`
                            : "none",
                      }}
                      title={value.name}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: value.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Category Selector */}
              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1.5">
                  Product Category
                </label>
                <select
                  value={data.category}
                  onChange={(e) => handleTextChange("category", e.target.value)}
                  className="w-full bg-zinc-950 border rounded px-3 py-2 text-xs text-white focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: `rgba(${currentAccent.rgb}, 0.2)`,
                    fontFamily: "inherit",
                  }}
                >
                  <option value="audio">Audio / Headphones</option>
                  <option value="perfume">Luxury Perfume</option>
                  <option value="phone">High-End Phone / Tech</option>
                  <option value="chocolate">Premium Chocolate</option>
                </select>
              </div>
            </div>

            <div
              className="w-full h-px"
              style={{ backgroundColor: `rgba(${currentAccent.rgb}, 0.1)` }}
            />

            {/* Brand details */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-xs tracking-widest text-zinc-400 uppercase">
                Product & Hero
              </h3>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={data.brandName}
                  onChange={(e) => handleTextChange("brandName", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={data.productName}
                  onChange={(e) => handleTextChange("productName", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={data.heroHeadline}
                  onChange={(e) => handleTextChange("heroHeadline", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={data.heroTagline}
                  onChange={(e) => handleTextChange("heroTagline", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Story Narrative Message
                </label>
                <textarea
                  value={data.storyMessage}
                  onChange={(e) => handleTextChange("storyMessage", e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                />
              </div>
            </div>

            <div
              className="w-full h-px"
              style={{ backgroundColor: `rgba(${currentAccent.rgb}, 0.1)` }}
            />

            {/* Features list */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-xs tracking-widest text-zinc-400 uppercase">
                Glassmorphic Features
              </h3>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Feature 1
                </label>
                <input
                  type="text"
                  value={data.feature1}
                  onChange={(e) => handleTextChange("feature1", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Feature 2
                </label>
                <input
                  type="text"
                  value={data.feature2}
                  onChange={(e) => handleTextChange("feature2", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Feature 3
                </label>
                <input
                  type="text"
                  value={data.feature3}
                  onChange={(e) => handleTextChange("feature3", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            <div
              className="w-full h-px"
              style={{ backgroundColor: `rgba(${currentAccent.rgb}, 0.1)` }}
            />

            {/* CTA panel */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-xs tracking-widest text-zinc-400 uppercase">
                Final Call to Action
              </h3>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  CTA Headline
                </label>
                <input
                  type="text"
                  value={data.ctaHeadline}
                  onChange={(e) => handleTextChange("ctaHeadline", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  CTA Message
                </label>
                <input
                  type="text"
                  value={data.ctaMessage}
                  onChange={(e) => handleTextChange("ctaMessage", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-500 uppercase mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={data.primaryButtonText}
                  onChange={(e) => handleTextChange("primaryButtonText", e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Reset Options footer */}
          <div
            className="p-6 border-t bg-black/90 flex gap-4"
            style={{ borderColor: `rgba(${currentAccent.rgb}, 0.1)` }}
          >
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-zinc-800 hover:border-zinc-600 text-xs rounded transition-all duration-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
