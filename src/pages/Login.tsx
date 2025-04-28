
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/common/AnimatedBackground";
import AppLogo from "@/components/common/AppLogo";
import { GlassCard } from "@/components/ui/glass-card";
import EnhancedLoginForm from "@/components/auth/EnhancedLoginForm";
import EnhancedResetPasswordForm from "@/components/auth/EnhancedResetPasswordForm";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showResetForm, setShowResetForm] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to matches page if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/matches');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <AnimatedBackground variant="purple" showBokeh={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground variant="purple" showBokeh={true}>
      <div className="flex flex-col justify-center min-h-screen px-4">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo and heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <AppLogo variant="light" size="lg" className="justify-center mb-6" />
            <h1 className="text-3xl font-bold text-white font-display">
              {showResetForm ? "Reset Your Password" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {showResetForm 
                ? "Enter your email to receive a password reset link" 
                : "Sign in to continue your journey"}
            </p>
          </motion.div>

          {/* Card with form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard variant="light" className="p-6">
              {showResetForm ? (
                <EnhancedResetPasswordForm onBack={() => setShowResetForm(false)} />
              ) : (
                <EnhancedLoginForm onForgotPassword={() => setShowResetForm(true)} />
              )}
            </GlassCard>
          </motion.div>

          {/* Registration link */}
          {!showResetForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <p className="text-white/80 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-white font-medium hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="mt-4 text-xs text-white/60">
                By signing in, you agree to our{" "}
                <a href="#" className="underline hover:text-white/80">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="underline hover:text-white/80">Privacy Policy</a>.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Login;
