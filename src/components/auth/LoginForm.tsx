
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const { login, bypassAuth } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
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
        // If login was successful, redirect to matches page
        navigate("/matches");
      } else {
        setFormError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleTestMode = () => {
    bypassAuth();
    navigate("/matches");
  };

  return (
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
            onClick={onForgotPassword}
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
            onClick={() => setShowPassword(!showPassword)}
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
  );
};

export default LoginForm;
