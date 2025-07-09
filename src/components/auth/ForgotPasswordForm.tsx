
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [method, setMethod] = useState<'reset' | 'magic'>('reset');
  const { toast } = useToast();
  const { signInWithMagicLink, requestPasswordReset } = useAuth();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await requestPasswordReset(email);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSent(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for the password reset link."
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signInWithMagicLink(email);
      if (!error) {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-elevation p-8 border border-border text-center"
        >
          <div className="mb-6">
            <Mail className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Check your email</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a {method === 'reset' ? 'password reset link' : 'magic login link'} to <strong>{email}</strong>
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft size={16} className="mr-2" />
              Back to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-elevation p-8 border border-border"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Account Recovery</h2>
          <p className="text-muted-foreground">
            Choose how you'd like to access your account.
          </p>
        </div>

        {/* Method Selection */}
        <div className="mb-6">
          <div className="flex rounded-lg border border-border p-1">
            <button
              type="button"
              onClick={() => setMethod('reset')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                method === 'reset'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => setMethod('magic')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                method === 'magic'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Magic Link
            </button>
          </div>
        </div>

        <form onSubmit={method === 'reset' ? handlePasswordReset : handleMagicLink} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {method === 'reset' ? (
              <p>We'll send you a link to reset your password.</p>
            ) : (
              <p>We'll send you a magic link to log in without a password.</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : (
              <>
                {method === 'magic' && <Wand2 size={16} className="mr-2" />}
                {method === 'reset' ? 'Send Reset Link' : 'Send Magic Link'}
              </>
            )}
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft size={14} className="inline mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;
