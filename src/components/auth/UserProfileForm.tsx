
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EditableProfileField } from './EditableProfileField';

interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const UserProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      } else if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        await createInitialProfile();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async () => {
    if (!user) return;

    const initialProfile = {
      id: user.id,
      full_name: user.user_metadata?.full_name || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      avatar_url: null,
    };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([initialProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error creating profile:', err);
    }
  };

  const updateProfileField = async (field: keyof UserProfile, value: string) => {
    if (!user || !profile) return;

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Also update auth metadata for full_name
      if (field === 'full_name') {
        const { error: authError } = await supabase.auth.updateUser({
          data: { full_name: value }
        });

        if (authError) {
          console.warn('Failed to update auth metadata:', authError);
        }
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, [field]: value } : null);

      toast({
        title: "Profile updated",
        description: `Your ${field.replace('_', ' ')} has been updated successfully.`
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
      throw error; // Re-throw to trigger field revert
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-elevation p-8 border border-border">
          <div className="text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
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
          <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
          <p className="text-muted-foreground">
            Click the edit button next to any field to modify it.
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Field (Read-only) */}
          <EditableProfileField
            label="Email Address"
            value={user.email || ''}
            onSave={async () => {}} // No-op since email can't be changed
            placeholder="No email"
            type="email"
            disabled={true}
            icon={<Mail size={18} />}
          />

          {/* Full Name Field */}
          <EditableProfileField
            label="Full Name"
            value={profile?.full_name || ''}
            onSave={(value) => updateProfileField('full_name', value)}
            placeholder="Enter your full name"
            icon={<User size={18} />}
          />

          {/* Username Field */}
          <EditableProfileField
            label="Username"
            value={profile?.username || ''}
            onSave={(value) => updateProfileField('username', value)}
            placeholder="Choose a username"
            icon={<User size={18} />}
          />

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Account created: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileForm;
