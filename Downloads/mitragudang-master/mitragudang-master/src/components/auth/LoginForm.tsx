import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // If already authenticated, redirect to home page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log(`Attempting to login with email: ${email}`);

      // Try direct fetch to test API connection
      try {
        console.log('Testing direct API connection...');
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        console.log('Using API URL:', apiUrl);
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        console.log(`Direct API test - Response status: ${response.status}`);
        const responseText = await response.text();
        console.log(`Direct API test - Response text: ${responseText.substring(0, 100)}...`);

        try {
          const data = JSON.parse(responseText);
          console.log('Direct API test - Parsed JSON:', data);
        } catch (e) {
          console.error('Direct API test - Failed to parse JSON:', e);
        }
      } catch (directError) {
        console.error('Direct API test - Error:', directError);
      }

      // Now try the regular login
      await login(email, password);

      // Show success animation
      setLoginSuccess(true);

      // Navigate after success animation
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (loginSuccess) {
    return (
      <div className="login-card p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-success-scale">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-white">Login Successful!</h3>
          <p className="mt-2 text-white/60">Redirecting you to dashboard...</p>
          <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-[shrink_1s_linear_forwards]"
              style={{ width: '100%', animation: 'shrink 1s linear reverse forwards' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-card p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">
          Welcome Back
        </h2>
        <p className="mt-2 text-white/60">
          Sign in to your account to continue
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm animate-fade-in-up">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center mt-0.5">
              <span className="text-red-400 text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="text-red-400 font-medium text-sm">Authentication Error</h4>
              <p className="text-red-300/80 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400/60 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white/80">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="login-input pl-12"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-white/80">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="login-input pl-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0"
            />
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
              Remember me
            </span>
          </label>
          <a
            href="#"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="login-button flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-white/60 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Create account
          </a>
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-tr-full pointer-events-none" />
    </div>
  );
};

export default LoginForm;
