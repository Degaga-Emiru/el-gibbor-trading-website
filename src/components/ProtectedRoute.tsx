import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'manager' | 'employee';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Loading secure session...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/staff" replace />;
  }

  if (profile.status === 'suspended') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-slate-950 border border-red-500/30 p-8 rounded-2xl text-center space-y-4">
          <div className="h-12 w-12 bg-red-950 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h1 className="text-xl font-bold text-red-400">Account Suspended</h1>
          <p className="text-slate-400 text-sm">
            Your employee account has been suspended by the management. Please contact your administrator.
          </p>
          <a
            href="/"
            className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (allowedRole && profile.role !== allowedRole) {
    // If manager tries to go to employee path, redirect to manager dashboard, and vice versa
    return <Navigate to={profile.role === 'manager' ? '/admin' : '/employee'} replace />;
  }

  return <>{children}</>;
}
