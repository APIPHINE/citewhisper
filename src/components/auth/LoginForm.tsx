
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, User } from 'lucide-react';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is where we would connect to an authentication service
    console.log('Authentication form submitted:', { email, password, name });
    
    // Here you would typically:
    // 1. Call an authentication API (like Supabase, Firebase, etc.)
    // 2. Store the user token/session
    // 3. Redirect to the appropriate page
    
    alert('Authentication not yet implemented. Please connect to Supabase for full functionality.');
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-border">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-accent/10 p-3 rounded-full">
          <User size={24} className="text-accent" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required={!isLogin}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        
        {isLogin && (
          <div className="flex justify-end">
            <button type="button" className="text-sm text-accent hover:underline">
              Forgot password?
            </button>
          </div>
        )}
        
        <Button type="submit" className="w-full flex items-center justify-center gap-2">
          <LogIn size={16} />
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-accent hover:underline font-medium"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>Note: Authentication requires backend integration.</p>
        <p>Please integrate with Supabase to enable full user authentication functionality.</p>
      </div>
    </div>
  );
};

export default LoginForm;
