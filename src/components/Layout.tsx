
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, MessageSquare, Users, Settings, LogIn } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <h1 className="text-xl md:text-2xl font-bold flex items-center">
              <span className="text-secondary">Kenyan</span>
              <span className="mx-1">Connections</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Button
                  variant={isActive("/matches") ? "secondary" : "ghost"}
                  onClick={() => navigate("/matches")}
                  className="text-primary-foreground"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Matches
                </Button>
                <Button
                  variant={isActive("/messages") ? "secondary" : "ghost"}
                  onClick={() => navigate("/messages")}
                  className="text-primary-foreground"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button
                  variant={isActive("/profile") ? "secondary" : "ghost"}
                  onClick={() => navigate("/profile")}
                  className="text-primary-foreground"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={isActive("/settings") ? "secondary" : "ghost"}
                  onClick={() => navigate("/settings")}
                  className="text-primary-foreground"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-primary-foreground">
                      {user?.name?.split(" ")[0] || "Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")} className="text-primary-foreground">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate("/register")}
                  className="text-secondary-foreground"
                >
                  Sign up
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>{user?.name || "Welcome"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/matches")}>
                      <Users className="mr-2 h-4 w-4" />
                      Matches
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/messages")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/register")}>
                      Sign up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 Kenyan Connections. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground hover:text-secondary text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground hover:text-secondary text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground hover:text-secondary text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
