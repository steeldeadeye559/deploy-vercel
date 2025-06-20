import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, AlertTriangle, Heart } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: 'doctor@hospital.com',
    password: 'password123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'text-error-600' };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: 'text-warning-600' };
    if (password.length < 12) return { strength: 3, text: 'Good', color: 'text-secondary-600' };
    return { strength: 4, text: 'Strong', color: 'text-success-600' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
              MedCare
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Hospital Management System
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              Caring for India's Health
            </p>
          </div>

          {/* Demo Credentials Notice */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-primary-800 dark:text-primary-300 mb-2">
              Demo Credentials
            </h3>
            <div className="text-sm text-primary-700 dark:text-primary-400 space-y-1">
              <p><strong>Email:</strong> doctor@hospital.com</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>

          {/* Login Error */}
          {loginError && (
            <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-2xl p-4 mb-6 animate-slide-down">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400 mr-2" />
                <p className="text-sm text-error-700 dark:text-error-400">{loginError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`
                    block w-full pl-12 pr-4 py-4 border rounded-2xl shadow-sm placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.email 
                      ? 'border-error-500 bg-error-50 dark:bg-error-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }
                    text-gray-900 dark:text-white
                  `}
                  placeholder="Enter your email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-center" role="alert">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`
                    block w-full pl-12 pr-14 py-4 border rounded-2xl shadow-sm placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.password 
                      ? 'border-error-500 bg-error-50 dark:bg-error-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }
                    text-gray-900 dark:text-white
                  `}
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Password strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1 ? 'bg-error-500 w-1/4' :
                        passwordStrength.strength === 2 ? 'bg-warning-500 w-2/4' :
                        passwordStrength.strength === 3 ? 'bg-secondary-500 w-3/4' :
                        passwordStrength.strength === 4 ? 'bg-success-500 w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-center" role="alert">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-3" />
                  Signing in...
                </>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure hospital management system for India
            </p>
            <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-400 dark:text-gray-500">
              <span>🔒 SSL Encrypted</span>
              <span>•</span>
              <span>🏥 HIPAA Compliant</span>
              <span>•</span>
              <span>🇮🇳 Made in India</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;