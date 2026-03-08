import { useState, useEffect, lazy, Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Navigation } from "@/components/Navigation";
import { PredictView } from "@/components/PredictView";
import { useAccentColor } from "@/hooks/useAccentColor";

// Lazy-loaded heavy components for faster initial load
const AnalyticsView = lazy(() => import("@/components/AnalyticsView").then(m => ({ default: m.AnalyticsView })));
const SettingsView = lazy(() => import("@/components/SettingsView").then(m => ({ default: m.SettingsView })));

import Hero from "@/components/ui/animated-shader-hero";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

type TabType = "predict" | "analytics" | "settings";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("predict");

  // Initialize accent color on mount
  useAccentColor();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!showApp) {
    return (
      <Hero
        trustBadge={{
          text: "Trusted by forward-thinking ML teams.",
          icons: [<ShieldCheck className="w-4 h-4" />, <Sparkles className="w-4 h-4" />, <Zap className="w-4 h-4" />]
        }}
        headline={{
          line1: "Detect Fake",
          line2: "Job Postings"
        }}
        subtitle="Supercharge your job search productivity with AI-powered fraud detection built for the next generation of applicants — fast, seamless, and secure."
        buttons={{
          primary: {
            text: "Get Started for Free",
            onClick: () => setShowApp(true)
          },
          secondary: {
            text: "Explore Features",
            onClick: () => {
              setActiveTab("analytics");
              setShowApp(true);
            }
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium UI Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="pb-8">
          <div className="animate-fade-in min-h-[500px]">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground animate-pulse">
                <Sparkles className="w-8 h-8 mb-4 text-primary opacity-50 absolute" />
                <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin"></div>
                <p className="mt-4 font-mono text-sm tracking-widest">LOADING MODULE...</p>
              </div>
            }>
              {activeTab === "predict" && <PredictView key="predict" />}
              {activeTab === "analytics" && <AnalyticsView key="analytics" />}
              {activeTab === "settings" && <SettingsView key="settings" />}
            </Suspense>
          </div>
        </main>

        <footer className="fixed bottom-4 right-4 text-sm text-muted-foreground">
          Built with ❤️ using AI and Python
        </footer>
      </div>
    </div>
  );
};

export default Index;
