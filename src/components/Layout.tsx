import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  History, 
  Trophy, 
  Wallet, 
  Shield, 
  Ban, 
  Bell, 
  Film, 
  Settings,
  Menu,
  X,
  User,
  LogOut,
  UserCircle,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: History, label: "Scan History", path: "/scan-history" },
  { icon: Trophy, label: "Rewards", path: "/rewards" },
  { icon: Wallet, label: "M-Pesa", path: "/mpesa" },
  { icon: Shield, label: "Audit Proofs", path: "/audit" },
  { icon: Ban, label: "Lost/Blocked", path: "/blocked" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Film, label: "Media Library", path: "/media" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden btn-glow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="text-neon-blue" /> : <Menu className="text-neon-blue" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen nav-glow z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-72 overflow-y-auto`}
      >
        <div className="p-6">
          <div className="relative mb-8">
            {/* Subtle radial background glow - flush to edges */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/10 to-transparent blur-sm"></div>
            
            {/* Logo image - completely flush with transparent background */}
            <img 
              src="/logo-transparent.png" 
              alt="Kardiverse" 
              className="h-16 w-full object-contain relative z-10"
            />
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20 neon-glow"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground glow-on-hover"
                      }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-neon-blue' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex-1 lg:ml-0 ml-16">
              <h2 className="text-sm text-muted-foreground text-glow">Welcome back,</h2>
              <p className="text-lg font-semibold text-neon-blue">{user?.name || 'User'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full btn-glow">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse neon-glow" />
                <span className="text-sm text-primary font-medium text-neon-blue">
                  {user?.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center icon-glow">
                <Globe className="w-5 h-5 text-primary text-neon-blue" />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full btn-glow">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
