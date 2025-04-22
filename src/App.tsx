
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseProvider } from "@/contexts/SupabaseProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { MatchProvider } from "@/contexts/MatchContext";
import { MessageProvider } from "@/contexts/MessageContext";
import { BlockProvider } from "@/contexts/BlockContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SupabaseProvider>
        <AuthProvider>
          <MatchProvider>
            <MessageProvider>
              <BlockProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </BlockProvider>
            </MessageProvider>
          </MatchProvider>
        </AuthProvider>
      </SupabaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
