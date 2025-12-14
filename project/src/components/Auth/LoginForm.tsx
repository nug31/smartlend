import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Handshake } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onToggleForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setErrors({ general: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-slate-dark via-dark-slate to-dark-slate-light">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 163, 175, 0.1) 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Glass morphism card */}
        <div className="glass rounded-3xl p-8 shadow-2xl backdrop-blur-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto relative mb-6">
              {/* Enhanced logo with multiple layers */}
              <div className="relative">
                <div className="h-24 w-24 bg-gradient-to-br from-red-500 via-red-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 mx-auto float">
                  <div className="relative">
                    <Handshake size={40} className="text-white drop-shadow-lg" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg animate-ping"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg"></div>
                  </div>
                </div>
                {/* Multiple glow effects */}
                <div className="absolute inset-0 h-24 w-24 bg-red-400 rounded-3xl blur-2xl opacity-30 -z-10 mx-auto animate-pulse"></div>
                <div className="absolute inset-0 h-24 w-24 bg-blue-400 rounded-3xl blur-3xl opacity-20 -z-20 mx-auto pulse-slow"></div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold gradient-text mb-2">SmartLend</h1>
                <p className="text-white/80 font-medium text-sm tracking-wide">Asset Management System</p>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mx-auto"></div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome
                </h2>
                <p className="text-white/70 text-sm">
                  Sign in to continue your journey
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-sm">
                <AlertCircle className="text-red-400" size={20} />
                <span className="text-red-300 text-sm">{errors.general}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`
                      block w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl
                      text-white placeholder-white/50 backdrop-blur-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                      transition-all duration-300
                      ${errors.email ? 'border-red-400/50 focus:ring-red-400/50' : ''}
                    `}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-300">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`
                      block w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl
                      text-white placeholder-white/50 backdrop-blur-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                      transition-all duration-300
                      ${errors.password ? 'border-red-400/50 focus:ring-red-400/50' : ''}
                    `}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-300">{errors.password}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-400 border-white/30 rounded bg-white/10 backdrop-blur-sm"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-white/80">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="text-sm text-gray-300 hover:text-gray-200 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </span>
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-white/70">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleForm}
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
                >
                  Sign up
                </button>
              </span>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
};