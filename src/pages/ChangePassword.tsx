
import React from 'react';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ChangePassword = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-36">
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePassword;
