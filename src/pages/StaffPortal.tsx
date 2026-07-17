import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertTriangle, CheckCircle, RefreshCw, ChevronLeft } from 'lucide-react';

type PortalMode = 'login' | 'forgot' | 'reset-password';

export default function StaffPortal() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<PortalMode>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check URL parameters and hash for recovery/invite flows
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const type = searchParams.get('type');
    
    if (
      type === 'recovery' || 
      hash.includes('type=recovery') || 
      search.includes('type=recovery') ||
      hash.includes('type=invite') ||
      search.includes('type=invite')
    ) {
      setMode('reset-password');
    }
  }, [searchParams]);

  // Redirect if already authenticated (skip redirection if in password recovery/reset mode)
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const isResetFlow = 
      hash.includes('type=recovery') || 
      search.includes('type=recovery') || 
      hash.includes('type=invite') || 
      search.includes('type=invite') ||
      mode === 'reset-password';

    if (!authLoading && user && profile && !isResetFlow) {
      if (profile.status === 'suspended') {
        setError('Your account is suspended. Please contact your manager.');
        return;
      }
      if (profile.role === 'manager') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    }
  }, [user, profile, authLoading, navigate, mode]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginErr) {
        if (loginErr.message.toLowerCase().includes('confirm') || loginErr.message.toLowerCase().includes('verified') || loginErr.message.toLowerCase().includes('not confirmed')) {
          throw new Error('Please verify your email before signing in. Check your inbox for the confirmation link sent to your email.');
        }
        throw loginErr;
      }

      if (data.user) {
        const { data: prof, error: profErr } = await supabase
          .from('profiles')
          .select('status, role')
          .eq('id', data.user.id)
          .single();

        if (profErr) throw profErr;

        if (prof.status === 'suspended') {
          await supabase.auth.signOut();
          throw new Error('Your account is suspended. Please contact your manager.');
        }

        setSuccess('Logged in successfully!');
        if (prof.role === 'manager') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/staff?type=recovery`,
      });

      if (resetErr) throw resetErr;

      setSuccess('A secure password reset link has been sent to your email. Please click the link to reset your password.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateErr) throw updateErr;

      setSuccess('Your password has been successfully updated! Redirecting to login page...');
      
      // Clean hashes and parameters
      window.history.replaceState(null, '', window.location.pathname);
      
      // Sign out current temp session to ensure they log in with new password
      await supabase.auth.signOut();
      
      setTimeout(() => {
        setMode('login');
        clearMessages();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative font-sans">
      
      {/* Back to main site link */}
      <div className="absolute top-6 left-6">
        <a 
          href="/" 
          className="flex items-center gap-1 text-sm font-semibold text-[#0B2E6B] hover:text-blue-900 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Website
        </a>
      </div>

      <div className="my-auto max-w-md w-full mx-auto space-y-8 bg-white border border-[#E2E8F0] p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/images/logo.png" alt="El Gibbor Trading" className="h-12 w-auto object-contain" />
            <div className="flex flex-col text-left">
              <span className="text-[#0B2E6B] font-bold text-xl leading-tight">El Gibbor</span>
              <span className="text-[#D4A017] text-xs font-semibold tracking-wider uppercase">Trading PLC</span>
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-[#1E293B] tracking-tight">
            Staff Portal
          </h2>
          <p className="mt-2 text-sm text-[#64748B]">
            {mode === 'login' && 'Please sign in using your company email address and password to continue.'}
            {mode === 'forgot' && 'Reset your password to regain access.'}
            {mode === 'reset-password' && 'Enter your new secure password below to complete onboarding/recovery.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 text-red-800">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start space-x-3 text-emerald-800">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E6B] focus:border-transparent transition-all text-sm"
                    placeholder="name@elgibbor.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E6B] focus:border-transparent transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { clearMessages(); setMode('forgot'); }}
                className="text-sm font-medium text-[#0B2E6B] hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#0B2E6B] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2E6B] disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'Login to Dashboard'}
              </button>
            </div>

            <div className="text-center pt-2 border-t border-[#E2E8F0]">
              <p className="text-xs text-[#64748B] leading-relaxed">
                This portal is exclusively for authorized employees and management. 
                If you need access to your account, please contact your manager.
              </p>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form className="space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E6B] text-sm"
                  placeholder="name@elgibbor.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#0B2E6B] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[#0B2E6B] disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'Send Recovery Email Link'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { clearMessages(); setMode('login'); }}
                className="font-bold text-sm text-[#0B2E6B] hover:underline transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* RESET PASSWORD MODE */}
        {mode === 'reset-password' && (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E6B] text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2E6B] text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#0B2E6B] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-[#0B2E6B] disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'Set Secure Password'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="text-center text-xs text-[#64748B] mt-8">
        &copy; {new Date().getFullYear()} EL GIBBOR Import & Export. All rights reserved.
      </div>
    </div>
  );
}
