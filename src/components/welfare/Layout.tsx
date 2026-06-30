import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  HandCoins, 
  ClipboardCheck, 
  FileText, 
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'contributions', label: 'Verifications', icon: ClipboardCheck },
    { id: 'loans', label: 'Loan Management', icon: HandCoins },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/8e73cc50-7bc4-4dc6-a69d-479ca9beb82f/iwms-logo-242d7c0d-1782814369869.webp" 
                alt="Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <div className="font-bold text-lg leading-tight text-sidebar-foreground">
                IWMS <span className="block text-xs font-normal opacity-70 text-sidebar-foreground">Welfare System</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <button className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export const Header = ({ activeTab, setIsOpen }: { activeTab: string, setIsOpen: (open: boolean) => void }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold capitalize">
          {activeTab.replace('-', ' ')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-muted rounded-full text-sm border-none focus:ring-2 focus:ring-primary w-64"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold">Treasurer Admin</p>
            <p className="text-xs text-muted-foreground">Main Office</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            TA
          </div>
        </div>
      </div>
    </header>
  );
};
