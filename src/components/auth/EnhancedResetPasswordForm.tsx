
import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface EnhancedResetPasswordFormProps {
  onBack: () => void;
  className?: string;
}

const EnhancedResetPasswordForm = ({ onBack, className }: EnhancedResetPasswordFormProps) => {
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
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
          title: 'Password reset failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Password reset email sent',
          description: 'Check your email for a password reset link',
        });
        onBack();
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Password reset failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Label htmlFor="resetEmail" className="sr-only">
              Email
            </Label>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="resetEmail"
              type="email"
              placeholder="Enter your email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border border-gray-200"
              autoComplete="email"
              required
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full"
          disabled={isResetting}
        >
          {isResetting ? 'Sending...' : 'Send Reset Link'}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="w-full text-purple-700 hover:text-purple-800 hover:bg-purple-50"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </form>
    </div>
  );
};

export default EnhancedResetPasswordForm;
