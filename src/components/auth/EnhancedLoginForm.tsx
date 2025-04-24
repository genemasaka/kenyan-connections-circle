
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface EnhancedLoginFormProps {
  onForgotPassword: () => void;
  className?: string;
}

const EnhancedLoginForm = ({ onForgotPassword, className }: EnhancedLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook') => {
    toast({
      title: 'Social login',
      description: `${provider} login is not implemented yet`,
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border border-gray-200"
              autoComplete="email"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-white/80 backdrop-blur-sm border border-gray-200"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
            >
              I forgot my password
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-full bg-white hover:bg-gray-50 border border-gray-300"
        onClick={() => handleSocialLogin('facebook')}
      >
        <Facebook className="mr-2 h-4 w-4 text-blue-600" />
        Continue with Facebook
      </Button>
    </div>
  );
};

export default EnhancedLoginForm;
