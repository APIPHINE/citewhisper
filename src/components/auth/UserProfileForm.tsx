
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        displayName: user.user_metadata?.display_name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          display_name: formData.displayName
        }
      });

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated."
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

  if (!user) {
    return null;
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
          <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
          <p className="text-muted-foreground">
            Update your personal information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                className="pl-10 bg-gray-50"
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed from this form
            </p>
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Display Name Field */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </Label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Choose a public display name"
                className="pl-10"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be your public-facing name on the platform
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Update Profile
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserProfileForm;
