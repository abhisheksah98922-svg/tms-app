"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/navigation/sidebar";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Truck, Receipt, Compass, Share2, ArrowRight } from "lucide-react";

export default function VideoAdPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const scenes = [
    {
      id: 1,
      duration: 10, // seconds
      title: "Problem: Paper Slip Chaos & Delayed Freight Payments",
      subtitle: "Are lost bill receipts and manual rate calculation errors slowing down your fleet?",
      voiceover_hi: "क्या आप भी ट्रकों के रसीद बिल खोने, गलत भाड़ा कैलकुलेशन और अटके हुए पेमेंट्स से परेशान हैं?",
      voiceover_en: "Are lost paper slips, manual rate-per-ton errors, and delayed freight payments slowing down your transport business?",
      visual_badge: "SCENE 1 • THE PROBLEM",
      bg_gradient: "from-slate-900 via-rose-950/40 to-slate-950",
      accent_color: "text-rose-400",
      icon: Receipt,
    },
    {
      id: 2,
      duration: 15,
      title: "Solution: Enterprise TMS & Instant Digital Billing",
      subtitle: "India's Most Advanced Transport Management System with 100% Data Isolation",
      voiceover_hi: "पेश है भारत का सबसे एडवांस Enterprise Transport Management System! अब बनाइए Exact Paper Slip Bills, 1-Click WhatsApp sharing और GST Invoices चुटकियों में!",
      voiceover_en: "Introducing India's Most Advanced Enterprise TMS! Generate exact physical transport slip bills, 1-click WhatsApp sharing, and GST invoices instantly!",
      visual_badge: "SCENE 2 • THE SOLUTION",
      bg_gradient: "from-slate-900 via-indigo-950/60 to-slate-950",
      accent_color: "text-indigo-400",
      icon: Truck,
    },
    {
      id: 3,
      duration: 10,
      title: "AI Route Profit Intelligence & WhatsApp 1-Click Sharing",
      subtitle: "Know exact diesel fuel liters, toll costs, and net profit before dispatching",
      voiceover_hi: "AI Route Profitability Calculator से हर ट्रिप का डीजल और टोल खर्च पहले ही जानें, और 100% Data Isolation के साथ अपना बिज़नेस बढ़ाएं!",
      voiceover_en: "Calculate exact diesel and toll expenses upfront with AI Route Intelligence, and scale your fleet with 100% data isolation!",
      visual_badge: "SCENE 3 • AI INTELLIGENCE",
      bg_gradient: "from-slate-900 via-emerald-950/50 to-slate-950",
      accent_color: "text-emerald-400",
      icon: Compass,
    },
    {
      id: 4,
      duration: 10,
      title: "Register Your Free Transport Workspace Today!",
      subtitle: "Join thousands of fleet owners using Enterprise TMS & Custom Slip Studio",
      voiceover_hi: "आज ही बिल्कुल फ्री रजिस्टर करें! नीचे दिए गए लिंक पर क्लिक करें!",
      voiceover_en: "Register your free transport workspace today! Visit the link below!",
      visual_badge: "SCENE 4 • CALL TO ACTION",
      bg_gradient: "from-slate-900 via-violet-950/60 to-slate-950",
      accent_color: "text-violet-400",
      icon: Sparkles,
    },
  ];

  // Auto-play timer loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentScene < scenes.length - 1) {
              setCurrentScene((s) => s + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 2; // Increment progress
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentScene]);

  const handleReplay = () => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const scene = scenes[currentScene];
  const SceneIcon = scene.icon;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 mr-1 inline" />
                <span>COMMERCIAL AI ADVERTISEMENT PLAYER</span>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-3 mt-1">
              <Truck className="h-7 w-7 text-indigo-400" />
              <span>Promotional Commercial Video Showcase</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Interactive 4K advertising commercial animation for social media and client promotion</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReplay}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Replay Ad</span>
            </button>
          </div>
        </div>

        {/* 16:9 Video Canvas Display Player */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-950 flex flex-col justify-between p-8 md:p-12">
          {/* Animated Background Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${scene.bg_gradient} transition-all duration-700 opacity-90`} />

          {/* Video Header Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 ${scene.accent_color} text-xs font-mono font-bold tracking-widest flex items-center space-x-2`}>
              <SceneIcon className="h-4 w-4 inline mr-1" />
              <span>{scene.visual_badge}</span>
            </span>

            <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">SCENE</span>
              <span className="text-white font-bold">{currentScene + 1} / {scenes.length}</span>
            </div>
          </div>

          {/* Central Animated Scene Content */}
          <div className="relative z-10 text-center space-y-4 max-w-3xl mx-auto my-auto">
            <div className="inline-flex p-4 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl text-indigo-400 mb-2">
              <SceneIcon className="h-12 w-12" />
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {scene.title}
            </h2>

            <p className="text-sm md:text-lg text-slate-300 font-medium max-w-2xl mx-auto">
              {scene.subtitle}
            </p>

            {/* Live Subtitle Voiceover Captions */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-xs md:text-sm font-sans space-y-2 shadow-2xl max-w-xl mx-auto">
              <p className="text-amber-300 font-semibold italic">🇮🇳 "{scene.voiceover_hi}"</p>
              <p className="text-slate-300 text-xs">🇬🇧 "{scene.voiceover_en}"</p>
            </div>
          </div>

          {/* Call to Action Button in Final Scene */}
          {currentScene === scenes.length - 1 && (
            <div className="relative z-10 flex justify-center">
              <Link
                href="/billing"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-extrabold text-base shadow-2xl shadow-indigo-600/50 hover:scale-105 transition-all flex items-center space-x-3"
              >
                <Sparkles className="h-5 w-5 text-indigo-300" />
                <span>Try Custom Billing Studio Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}

          {/* Video Player Controls Bar */}
          <div className="relative z-10 space-y-3 pt-4 border-t border-slate-800/80">
            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-500 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <span className="font-mono text-slate-400">{isPlaying ? "PLAYING COMMERCIAL..." : "PAUSED"}</span>
              </div>

              <div className="flex items-center space-x-2">
                {scenes.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentScene(idx);
                      setProgress(0);
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentScene === idx ? "bg-indigo-400 scale-125" : "bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
