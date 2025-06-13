'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  EyeIcon, 
  EyeOffIcon, 
  MusicIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CloudIcon
} from 'lucide-react';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 apple-hover-scale shadow-2xl">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Audio Hub!</h1>
            <p className="text-gray-600 text-lg mb-6">Your account has been created successfully.</p>
            <p className="text-gray-500">Redirecting you to the login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 float">
          <SparklesIcon className="w-6 h-6 text-purple-300 opacity-60" />
        </div>
        <div className="absolute top-1/3 right-1/4 float" style={{ animationDelay: '2s' }}>
          <CloudIcon className="w-8 h-8 text-pink-300 opacity-50" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 float" style={{ animationDelay: '4s' }}>
          <ShieldCheckIcon className="w-7 h-7 text-indigo-300 opacity-40" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg fade-in-up">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-6 apple-hover-scale shadow-2xl">
              <MusicIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Join Audio Hub
            </h1>
            <p className="text-gray-600 font-medium">
              Create your premium audio management account
            </p>
          </div>

          {/* Registration Card */}
          <Card className="apple-card border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Start managing your audio files today</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10 apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10 apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="pl-10 apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={isVisible ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        className="text-gray-400 hover:text-purple-500 focus:outline-none transition-colors duration-200"
                      >
                        {isVisible ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={isConfirmVisible ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 apple-input border-gray-200 hover:border-purple-300 focus-within:border-purple-500 bg-white/50"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleConfirmVisibility}
                        className="text-gray-400 hover:text-purple-500 focus:outline-none transition-colors duration-200"
                      >
                        {isConfirmVisible ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-px bg-gray-200"></div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                  
                  <p className="text-center text-gray-600">
                    Already have an account?{" "}
                    <Link href="/" className="text-purple-600 hover:text-purple-800 font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
} 