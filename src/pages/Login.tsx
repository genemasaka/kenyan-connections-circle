import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, Beaker } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const { login, isLoading: authLoading, bypassAuth } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoginLoading(true);

    if (!email || !password) {
      setFormError("Please enter both email and password");
      setLoginLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/matches");
      }
      // Always reset loading state regardless of success
      setLoginLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoginLoading(false);
      setFormError("Login failed. Please check your credentials and try again.");
    }
  };

  const handleTestMode = () => {
    bypassAuth();
    navigate("/matches");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link",
        });
        setShowResetForm(false);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {showResetForm ? "Reset Password" : "Sign in to your account"}
              </CardTitle>
              <CardDescription className="text-center">
                {showResetForm 
                  ? "Enter your email to receive a password reset link"
                  : "Enter your email and password to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showResetForm ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isResetting}>
                    {isResetting ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowResetForm(false)}
                  >
                    Back to Login
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <button 
                        type="button" 
                        onClick={() => setShowResetForm(true)}
                        className="text-sm text-primary/90 hover:text-primary"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  {formError && (
                    <div className="text-destructive text-sm">{formError}</div>
                  )}
                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? (
                      "Signing in..."
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </>
                    )}
                  </Button>
                  
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleTestMode}
                  >
                    <Beaker className="mr-2 h-4 w-4" />
                    Enter Test Mode
                  </Button>
                </form>
              )}
            </CardContent>
            {!showResetForm && (
              <CardFooter className="flex flex-col">
                <div className="text-center text-sm mt-2">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
