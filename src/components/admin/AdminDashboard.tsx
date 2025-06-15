
import React from 'react';
import { motion } from 'framer-motion';
import { UserRoleManager } from './UserRoleManager';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Navigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { userRole, loading } = useUserRoles();

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if user doesn't have admin privileges
  if (!['admin', 'super_admin'].includes(userRole)) {
    return <Navigate to="/" replace />;
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage user roles and system settings from this admin panel.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <UserRoleManager />
        </motion.div>
      </div>
    </div>
  );
};
