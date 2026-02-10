import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
            </button>
            {isAdmin && (
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
