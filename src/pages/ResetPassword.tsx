
import React from 'react';
import { EmailPasswordResetForm } from '@/components/auth/EmailPasswordResetForm';

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-36">
      <EmailPasswordResetForm />
    </div>
  );
};

export default ResetPassword;
