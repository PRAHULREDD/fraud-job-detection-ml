import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // After loading completes, show the title animation
          setTimeout(() => setShowTitle(true), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showTitle) {
      // After showing title for 2 seconds, complete the splash
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showTitle, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {!showTitle ? (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 animate-glow-pulse">
              <Brain className="w-24 h-24 text-primary mx-auto" />
            </div>
            <Brain className="w-24 h-24 text-primary mx-auto animate-spin-slow" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Fake Job Predictor AI
            </h1>
            <p className="text-muted-foreground text-lg">Initializing neural networks...</p>
          </div>

          <div className="w-64 mx-auto space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{progress}%</p>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
            Job Prediction Analyser
          </h1>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent animate-glow-pulse" />
        </div>
      )}
    </div>
  );
};
