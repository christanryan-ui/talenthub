'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Briefcase, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Users, Building } from 'lucide-react';

const roleConfig = {
  jobseeker: {
    title: 'Job Seeker Login',
    subtitle: 'Find your dream job',
    gradient: 'from-blue-600 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    icon: Briefcase,
    registerLink: '/auth/register'
  },
  employer: {
    title: 'Employer Login',
    subtitle: 'Find top talent for your team',
    gradient: 'from-green-600 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    icon: Building,
    registerLink: '/companies/register'
  },
  interviewer: {
    title: 'Interviewer Login',
    subtitle: 'Verify skills and earn rewards',
    gradient: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    icon: Users,
    registerLink: '/interviewers/register'
  },
  admin: {
    title: 'Admin Login',
    subtitle: 'Platform management portal',
    gradient: 'from-red-600 to-orange-600',
    bgGradient: 'from-red-50 to-orange-50',
    icon: Lock,
    registerLink: null
  }
};

export default function RoleLogin({ role = 'jobseeker' }) {
  const router = useRouter();
  const config = roleConfig[role];
  const IconComponent = config.icon;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      // Verify role matches
      if (role !== 'admin' && response.data.user.role !== role) {
        setError(`This account is not registered as a ${role}. Please use the correct login page.`);
        setLoading(false);
        return;
      }
      
      // Store auth token
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on user role
      const userRole = response.data.user.role;
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (userRole === 'employer') {
        router.push('/employer/dashboard');
      } else if (userRole === 'interviewer') {
        router.push('/interviewer/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center px-4`}>
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className={`inline-flex items-center space-x-2 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            <IconComponent className={`h-10 w-10 text-${role === 'jobseeker' ? 'blue' : role === 'employer' ? 'green' : role === 'interviewer' ? 'purple' : 'red'}-600`} />
            <span className="text-3xl font-bold">TalentHub</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-2 text-center`}>
            {config.title}
          </h1>
          <p className="text-gray-600 text-center mb-8">{config.subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${role === 'jobseeker' ? 'blue' : role === 'employer' ? 'green' : role === 'interviewer' ? 'purple' : 'red'}-500 focus:border-transparent`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/auth/forgot-password" className={`text-sm bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent hover:opacity-80`}>
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${role === 'jobseeker' ? 'blue' : role === 'employer' ? 'green' : role === 'interviewer' ? 'purple' : 'red'}-500 focus:border-transparent`}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${config.gradient} text-white py-3 rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {config.registerLink && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link href={config.registerLink} className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent hover:opacity-80 font-medium`}>
                  Sign up
                </Link>
              </p>
            </div>
          )}
          
          {/* Other Login Options */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-gray-600 text-xs text-center mb-3">Sign in as:</p>
            <div className="grid grid-cols-3 gap-2">
              {role !== 'jobseeker' && (
                <Link 
                  href="/auth/login/jobseeker" 
                  className="text-center px-3 py-2 text-xs border border-blue-200 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                >
                  Job Seeker
                </Link>
              )}
              {role !== 'employer' && (
                <Link 
                  href="/auth/login/employer" 
                  className="text-center px-3 py-2 text-xs border border-green-200 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                >
                  Employer
                </Link>
              )}
              {role !== 'interviewer' && (
                <Link 
                  href="/auth/login/interviewer" 
                  className="text-center px-3 py-2 text-xs border border-purple-200 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
                >
                  Interviewer
                </Link>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent hover:opacity-80`}>
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
