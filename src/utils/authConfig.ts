
/**
 * Authentication configuration utilities
 * Provides consistent redirect URLs for all auth flows
 */

export const getAuthRedirectUrl = (path: string = '') => {
  const baseUrl = window.location.origin;
  return `${baseUrl}${path}`;
};

export const AUTH_REDIRECT_URLS = {
  // Main app redirect after successful auth
  home: () => getAuthRedirectUrl('/'),
  
  // Password reset page
  resetPassword: () => getAuthRedirectUrl('/reset-password'),
  
  // Email verification page  
  emailVerification: () => getAuthRedirectUrl('/email-verification'),
  
  // Login page for redirects
  login: () => getAuthRedirectUrl('/login')
};
