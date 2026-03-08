import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, RotateCcw, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ResultModal } from "./ResultModal";
import { usePredictionStore } from "@/hooks/usePredictionStore";

const initialFormData = {
  title: "",
  location: "",
  department: "",
  salary_range: "",
  company_profile: "",
  description: "",
  requirements: "",
  benefits: "",
  employment_type: "",
  required_experience: "",
  required_education: "",
  industry: "",
  function: "",
  telecommuting: "0",
  has_company_logo: "0",
  has_questions: "0",
};

export const PredictView = () => {
  const addPrediction = usePredictionStore((state) => state.addPrediction);
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState<{
    isFake: boolean;
    probability: number;
    jobTitle: string;
  } | null>(null);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("predictFormData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  useEffect(() => {
    localStorage.setItem("predictFormData", JSON.stringify(formData));
  }, [formData]);

  const loadingMessages = [
    "Initializing NLP Engine...",
    "Scanning Semantic Footprint...",
    "Consulting AI Classifier...",
    "Calculating Fraud Risk Score...",
    "Finalizing Threat Assessment...",
  ];
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);

  // Network Fetching Logic via React Query
  const predictMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const API_KEY = import.meta.env.VITE_API_SECRET_KEY || 'your-default-dev-key';

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (predictionResult) => {
      addPrediction(predictionResult);
      setPrediction(predictionResult);
      setShowResult(true);
      toast.success("Prediction completed successfully!");
    },
    onError: (error) => {
      console.error('Prediction error:', error);
      toast.error(error.message || 'Failed to get prediction. Ensure the API server is running.');
    }
  });

  useEffect(() => {
    if (!predictMutation.isPending) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[i]);
    }, 800);
    return () => clearInterval(interval);
  }, [predictMutation.isPending]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearAll = () => {
    setFormData(initialFormData);
    localStorage.removeItem("predictFormData");
    toast.info("All fields cleared");
  };

  const validateForm = () => {
    const required = ["title", "location", "company_profile", "description", "requirements", "industry"];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        const formattedField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        toast.error(`${formattedField} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Trigger the mutation
    predictMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="glass rounded-2xl p-6 md:p-8 transition-all duration-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-fade-in-up">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Predict Job Authenticity
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fill in the form below with job posting details. Fields marked with <span className="text-red-500">*</span> are mandatory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="e.g., Senior Software Engineer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="e.g., San Francisco, CA" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} placeholder="e.g., Engineering" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input id="salary_range" value={formData.salary_range} onChange={(e) => handleInputChange("salary_range", e.target.value)} placeholder="e.g., 100000-150000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input id="industry" value={formData.industry} onChange={(e) => handleInputChange("industry", e.target.value)} placeholder="e.g., Information Technology" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="function">Function</Label>
              <Input id="function" value={formData.function} onChange={(e) => handleInputChange("function", e.target.value)} placeholder="e.g., Engineering" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type</Label>
              <Input id="employment_type" value={formData.employment_type} onChange={(e) => handleInputChange("employment_type", e.target.value)} placeholder="e.g., Full-time" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="required_experience">Required Experience</Label>
              <Input id="required_experience" value={formData.required_experience} onChange={(e) => handleInputChange("required_experience", e.target.value)} placeholder="e.g., Mid-Senior level" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="required_education">Required Education</Label>
              <Input id="required_education" value={formData.required_education} onChange={(e) => handleInputChange("required_education", e.target.value)} placeholder="e.g., Bachelor's Degree" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telecommuting">Telecommuting</Label>
              <Select value={formData.telecommuting} onValueChange={(value) => handleInputChange("telecommuting", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No</SelectItem>
                  <SelectItem value="1">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="has_company_logo">Has Company Logo</Label>
              <Select value={formData.has_company_logo} onValueChange={(value) => handleInputChange("has_company_logo", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No</SelectItem>
                  <SelectItem value="1">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="has_questions">Has Screening Questions</Label>
              <Select value={formData.has_questions} onValueChange={(value) => handleInputChange("has_questions", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No</SelectItem>
                  <SelectItem value="1">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_profile">Company Profile *</Label>
            <Textarea id="company_profile" value={formData.company_profile} onChange={(e) => handleInputChange("company_profile", e.target.value)} placeholder="Brief description of the company..." className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Detailed job description..." className="min-h-[120px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements *</Label>
            <Textarea id="requirements" value={formData.requirements} onChange={(e) => handleInputChange("requirements", e.target.value)} placeholder="Job requirements and qualifications..." className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea id="benefits" value={formData.benefits} onChange={(e) => handleInputChange("benefits", e.target.value)} placeholder="Employee benefits and perks..." className="min-h-[100px]" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" className="flex-1 h-12 text-lg font-semibold">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass border border-white/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will wipe out all local storage progression and clear the entire form data simultaneously. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600">
                    Yes, clear data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit" disabled={predictMutation.isPending} className="flex-1 h-12 text-lg font-semibold glow-primary relative overflow-hidden">
              {predictMutation.isPending ? (
                <div className="flex items-center space-x-2 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-mono text-sm tracking-tight">{loadingText}</span>
                </div>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Predict Authenticity</>
              )}
            </Button>
          </div>
        </form>
      </div>

      {prediction && (
        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          prediction={prediction}
        />
      )}
    </div>
  );
};
