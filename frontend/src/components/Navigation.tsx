import { Brain, Sparkles, BarChart3, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";
import { useIsMobile } from "@/hooks/use-mobile";

type TabType = "predict" | "analytics" | "settings";

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const isMobile = useIsMobile();

  const navItems = [
    {
      id: "predict",
      tab: "predict" as TabType,
      icon: <Sparkles className="w-5 h-5 mr-1" />,
      label: "Predict Job",
      onClick: () => onTabChange("predict" as TabType)
    },
    {
      id: "analytics",
      tab: "analytics" as TabType,
      icon: <BarChart3 className="w-5 h-5 mr-1" />,
      label: "Analytics",
      onClick: () => onTabChange("analytics" as TabType)
    },
    {
      id: "settings",
      tab: "settings" as TabType,
      icon: <Settings className="w-5 h-5 mr-1" />,
      label: "Settings",
      onClick: () => onTabChange("settings" as TabType)
    },
  ];

  const currentTabIndex = navItems.findIndex(i => i.tab === activeTab);

  return (
    <nav className="glass sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-primary animate-glow-pulse" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                Fake Job Predictor AI
              </h1>
            </div>
          </div>

          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.tab}
                    onClick={() => onTabChange(item.tab)}
                    className={activeTab === item.tab ? "bg-accent" : ""}
                  >
                    {item.icon}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <LimelightNav
                items={navItems}
                defaultActiveIndex={currentTabIndex !== -1 ? currentTabIndex : 0}
                className="bg-transparent border-0"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
