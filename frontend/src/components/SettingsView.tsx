import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings2, Database, Palette, Info, Check } from "lucide-react";
import { toast } from "sonner";
import { useAccentColor, type AccentColorType } from "@/hooks/useAccentColor";
import { usePredictionStore } from "@/hooks/usePredictionStore";

export const SettingsView = () => {
  const { accentColor, setAccentColor } = useAccentColor();
  const clearPredictions = usePredictionStore((state) => state.clearPredictions);
  
  const handleCheckModel = () => {
    toast.success("Model file found and loaded successfully!");
  };

  const handleClearState = () => {
    clearPredictions();
    toast.success("All predictions and analytics data cleared!");
  };
  
  const handleColorChange = (color: AccentColorType) => {
    setAccentColor(color);
    toast.success(`Accent color changed to ${color}!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-muted-foreground">
            Configure your application preferences and system settings
          </p>
        </div>

        {/* Appearance Settings */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Enable Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Show smooth transitions and effects
                </p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleColorChange('cyan')}
                  className="relative w-12 h-12 p-0 bg-[hsl(189,94%,55%)] hover:bg-[hsl(189,94%,55%)]/80"
                >
                  {accentColor === 'cyan' && <Check className="w-5 h-5 text-white" />}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleColorChange('green')}
                  className="relative w-12 h-12 p-0 bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,45%)]/80"
                >
                  {accentColor === 'green' && <Check className="w-5 h-5 text-white" />}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleColorChange('red')}
                  className="relative w-12 h-12 p-0 bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,60%)]/80"
                >
                  {accentColor === 'red' && <Check className="w-5 h-5 text-white" />}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleColorChange('orange')}
                  className="relative w-12 h-12 p-0 bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,53%)]/80"
                >
                  {accentColor === 'orange' && <Check className="w-5 h-5 text-white" />}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleColorChange('purple')}
                  className="relative w-12 h-12 p-0 bg-[hsl(271,76%,53%)] hover:bg-[hsl(271,76%,53%)]/80"
                >
                  {accentColor === 'purple' && <Check className="w-5 h-5 text-white" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Settings */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle>Model Configuration</CardTitle>
            </div>
            <CardDescription>Manage your ML model settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-path">Model File Path</Label>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <Input
                  id="model-path"
                  defaultValue="saved_model.pkl"
                  placeholder="/path/to/saved_model.pkl"
                  className="flex-1"
                />
                <Button onClick={handleCheckModel} variant="secondary">
                  Check Model
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Path to your trained machine learning model file
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-reload Model</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically reload model when file changes
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings2 className="w-5 h-5 text-primary" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>Manage application data and cache</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <div>
                <h4 className="font-medium">Clear UI State</h4>
                <p className="text-sm text-muted-foreground">
                  Remove cached predictions and local data
                </p>
              </div>
              <Button onClick={handleClearState} variant="destructive">
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-primary" />
              <CardTitle>System Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Backend Status</span>
              <span className="text-sm font-medium text-primary">Demo Mode</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Model Status</span>
              <span className="text-sm font-medium text-success">Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
