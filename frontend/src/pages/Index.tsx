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
    <div className="min-h-screen bg-background">
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
  );
};

export default Index;
