import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Navigation } from "@/components/Navigation";
import { PredictView } from "@/components/PredictView";
import { AnalyticsView } from "@/components/AnalyticsView";
import { SettingsView } from "@/components/SettingsView";
import { useAccentColor } from "@/hooks/useAccentColor";

type TabType = "predict" | "analytics" | "settings";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("predict");

  // Initialize accent color on mount
  useAccentColor();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium UI Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="pb-8">
          <div className="animate-fade-in">
            {activeTab === "predict" && <PredictView key="predict" />}
            {activeTab === "analytics" && <AnalyticsView key="analytics" />}
            {activeTab === "settings" && <SettingsView key="settings" />}
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
