
import React from 'react';
import { motion } from 'framer-motion';
import UserProfileForm from '../components/auth/UserProfileForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Profile Settings</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your account settings and preferences.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <UserProfileForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
