import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, AlertTriangle, Copy } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: {
    isFake: boolean;
    probability: number;
    jobTitle: string;
  };
}

export const ResultModal = ({ isOpen, onClose, prediction }: ResultModalProps) => {
  const suspicionLevel = prediction.isFake ? prediction.probability * 100 : (1 - prediction.probability) * 100;
  const roundedProbability = Math.round(prediction.probability * 100);

  const handleShare = () => {
    const status = prediction.isFake ? "🚨 Suspicious Job Alert! 🚨" : "✅ Legitimate Job Check ✅";
    const statusText = prediction.isFake ? "FAKE" : "LEGITIMATE";
    const text = `${status}\n\nI just scanned a job posting for '${prediction.jobTitle}' and it has a ${roundedProbability}% probability of being ${statusText}.\n\nStay safe out there!`;

    navigator.clipboard.writeText(text);
    toast.success("Report copied to clipboard!");
  };

  useEffect(() => {
    if (isOpen && !prediction.isFake) {
      // Fire confetti when a legitimate job is detected
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#06b6d4', '#22c55e']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#06b6d4', '#22c55e']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen, prediction.isFake]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${prediction.isFake ? 'glow-danger animate-shake border-danger/50' : 'glow-success border-success/50'} border-2`}>
        <div className="text-center space-y-6 py-6">
          <div className="relative">
            {prediction.isFake ? (
              <ShieldAlert className="w-24 h-24 mx-auto text-danger animate-pulse filter drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            ) : (
              <ShieldCheck className="w-24 h-24 mx-auto text-success animate-bounce filter drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              {prediction.isFake ? "⚠️ Suspicious Job Posting" : "✅ Legitimate Job Posting"}
            </h3>
            <p className="text-muted-foreground">
              {prediction.jobTitle}
            </p>
          </div>

          <div className="space-y-4 p-6 glass rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confidence Level</span>
              <span className="text-lg font-bold">{roundedProbability}%</span>
            </div>
            <Progress value={roundedProbability} className="h-2" />

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Fraud Risk Score</span>
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`w-4 h-4 ${prediction.isFake ? 'text-danger' : 'text-success'}`} />
                <span className="text-lg font-bold">{Math.round(suspicionLevel)}%</span>
              </div>
            </div>
          </div>

          {prediction.isFake ? (
            <div className="text-left space-y-2 p-4 bg-danger/10 border border-danger/20 rounded-lg">
              <h4 className="font-semibold text-danger">Warning Signs Detected:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Unusual job description patterns</li>
                <li>Suspicious company profile indicators</li>
                <li>Inconsistent requirement details</li>
              </ul>
            </div>
          ) : (
            <div className="text-left space-y-2 p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-semibold text-success">Positive Indicators:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Comprehensive job description</li>
                <li>Detailed company information</li>
                <li>Clear requirements and benefits</li>
              </ul>
            </div>
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleShare} className="flex-1 text-primary border-primary/20 hover:bg-primary/10">
              <Copy className="w-4 h-4 mr-2" />
              Share Report
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onClose} className="flex-1">
              Predict Another
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
