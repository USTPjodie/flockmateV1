import { Home, Plus, Bell, User, BarChart3 } from "lucide-react";
import { useState } from "react";

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function MobileLayout({ children, activeTab = "dashboard", onTabChange }: MobileLayoutProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "history", label: "History", icon: BarChart3 },
    { id: "add", label: "Add", icon: Plus },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border h-16 safe-area-bottom">
        <div className="flex items-center justify-around h-full px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const isAddButton = tab.id === "add";

            if (isAddButton) {
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex flex-col items-center justify-center -mt-8"
                  data-testid={`button-nav-${tab.id}`}
                >
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover-elevate active-elevate-2">
                    <Icon className="w-6 h-6" />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-testid={`button-nav-${tab.id}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "fill-primary" : ""}`} />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
