import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${prediction.isFake ? 'glow-danger' : 'glow-success'} border-2 animate-scale-in`}>
        <div className="text-center space-y-6 py-6">
          <div className="animate-bounce-in">
            {prediction.isFake ? (
              <XCircle className="w-20 h-20 mx-auto text-danger animate-glow-pulse" />
            ) : (
              <CheckCircle2 className="w-20 h-20 mx-auto text-success animate-glow-pulse" />
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
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={onClose} className="flex-1">
              Predict Another Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
