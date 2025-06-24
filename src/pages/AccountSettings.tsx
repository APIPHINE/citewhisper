
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, Shield } from 'lucide-react';

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width text-center">
          <p>Please log in to access your account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Settings */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User size={20} />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Your username"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Email cannot be changed from this page
                      </p>
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Account Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} />
                    Account Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">User ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Sign In</p>
                    <p className="text-sm text-muted-foreground">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Manage your account security settings
                  </p>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountSettings;
