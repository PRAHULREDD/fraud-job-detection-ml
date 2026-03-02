import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Prediction {
  id: string;
  jobTitle: string;
  isFake: boolean;
  probability: number;
  timestamp: Date;
  isCorrect?: boolean;
}

interface PredictionStore {
  predictions: Prediction[];
  addPrediction: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
  clearPredictions: () => void;
  getStats: () => {
    totalPredictions: number;
    fraudDetected: number;
    legitimateDetected: number;
    averageAccuracy: number;
    truePositives: number;
    trueNegatives: number;
    falsePositives: number;
    falseNegatives: number;
  };
}

export const usePredictionStore = create<PredictionStore>()(
  persist(
    (set, get) => ({
      predictions: [],
      
      addPrediction: (prediction) => {
        const newPrediction: Prediction = {
          ...prediction,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
          isCorrect: Math.random() > 0.5, // Simulate correctness
        };
        
        set((state) => ({
          predictions: [newPrediction, ...state.predictions].slice(0, 100), // Keep last 100
        }));
      },
      
      clearPredictions: () => set({ predictions: [] }),
      
      getStats: () => {
        const { predictions } = get();
        const fraudDetected = predictions.filter(p => p.isFake).length;
        const legitimateDetected = predictions.length - fraudDetected;
        const averageAccuracy = predictions.length > 0
          ? predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length
          : 0;

        const truePositives = predictions.filter(p => p.isFake && p.isCorrect).length;
        const falseNegatives = predictions.filter(p => p.isFake && !p.isCorrect).length;
        const trueNegatives = predictions.filter(p => !p.isFake && p.isCorrect).length;
        const falsePositives = predictions.filter(p => !p.isFake && !p.isCorrect).length;
        
        return {
          totalPredictions: predictions.length,
          fraudDetected,
          legitimateDetected,
          averageAccuracy: averageAccuracy * 100,
          truePositives,
          trueNegatives,
          falsePositives,
          falseNegatives,
        };
      },
    }),
    {
      name: 'prediction-store',
    }
  )
);