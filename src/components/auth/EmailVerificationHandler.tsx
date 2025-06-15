
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const EmailVerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (!token || type !== 'signup') {
        setVerificationState('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          setVerificationState('error');
          setMessage(error.message);
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setVerificationState('success');
          setMessage('Your email has been verified successfully!');
          toast({
            title: "Email verified",
            description: "Welcome! Your account is now active."
          });
          
          // Redirect to home after a short delay
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (err) {
        setVerificationState('error');
        setMessage('An unexpected error occurred during verification.');
        toast({
          title: "Verification failed",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  const getIcon = () => {
    switch (verificationState) {
      case 'loading':
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (verificationState) {
      case 'loading':
        return 'Verifying your email...';
      case 'success':
        return 'Email verified!';
      case 'error':
        return 'Verification failed';
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="bg-white rounded-2xl shadow-elevation p-8 border border-border">
            <div className="flex justify-center mb-6">
              {getIcon()}
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{getTitle()}</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            
            {verificationState === 'error' && (
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
            )}
            
            {verificationState === 'success' && (
              <p className="text-sm text-muted-foreground">
                Redirecting you to the home page...
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationHandler;
