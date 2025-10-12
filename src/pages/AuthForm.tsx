import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, Github, User } from 'lucide-react';
import Spinner from '../../components/Spinner';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,36.49,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

interface AuthFormProps {
  onViewTerms: () => void;
  onViewPrivacy: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onViewTerms, onViewPrivacy }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) {
        setError(error.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
    }
    
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white text-center mb-2">
        {isSignUp ? 'Create an Account' : 'Welcome Back'}
      </h2>
      <p className="text-gray-400 text-center mb-6">
        {isSignUp ? 'Start your creative journey with us.' : 'Sign in to continue to your studio.'}
      </p>

      <div className="space-y-4 mb-6">
        <button 
            onClick={() => handleOAuthSignIn('google')} 
            disabled 
            className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-zinc-700 text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <GoogleIcon />
            Continue with Google
        </button>
        <button 
            onClick={() => handleOAuthSignIn('github')} 
            disabled 
            className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-zinc-700 text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Github size={20} />
            Continue with GitHub
        </button>
      </div>

      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-zinc-700"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-zinc-700"></div>
      </div>

      <form onSubmit={handleAuthAction} className="space-y-4">
        {isSignUp && (
          <div className="flex gap-4">
            <div className="relative w-1/2">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-full py-3 pl-12 pr-4 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-full py-3 pl-4 pr-4 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-full py-3 pl-12 pr-4 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-full py-3 pl-12 pr-12 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {isSignUp && (
          <div className="pt-2">
            <label className="flex items-start gap-3 text-gray-400">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-600"
              />
              <span className="text-sm">
                I agree to the{' '}
                <button type="button" onClick={onViewTerms} className="font-semibold text-purple-400 hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" onClick={onViewPrivacy} className="font-semibold text-purple-400 hover:underline">
                  Privacy Policy
                </button>
                .
              </span>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (isSignUp && !agreedToTerms)}
          className="w-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black hover:from-zinc-700 hover:to-zinc-900 text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>

      {error && <p className="mt-4 text-center text-red-400 bg-red-900/20 p-3 rounded-lg">{error}</p>}

      <p className="mt-6 text-center text-gray-400">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-semibold text-purple-400 hover:text-purple-300 ml-2">
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;