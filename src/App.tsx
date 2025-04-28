
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SupabaseProvider } from "@/contexts/SupabaseProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { MatchProvider } from "@/contexts/MatchContext";
import { MessageProvider } from "@/contexts/MessageContext";
import { BlockProvider } from "@/contexts/BlockContext";
import { useEffect } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-800 to-purple-600">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      <span className="mt-4 text-white text-lg">Loading...</span>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      console.log("Auth state in ProtectedRoute:", { isAuthenticated, path: location.pathname });
    }
  }, [isLoading, isAuthenticated, location.pathname]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Auth state in AppRoutes:", { isAuthenticated, isLoading, path: location.pathname });
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/matches" replace /> : <Index />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/matches" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/matches" replace /> : <Register />} 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/matches" 
        element={
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/messages" 
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 60000, // 1 minute
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SupabaseProvider>
          <BrowserRouter>
            <AuthProvider>
              <MatchProvider>
                <MessageProvider>
                  <BlockProvider>
                    <AppRoutes />
                  </BlockProvider>
                </MessageProvider>
              </MatchProvider>
            </AuthProvider>
          </BrowserRouter>
        </SupabaseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
