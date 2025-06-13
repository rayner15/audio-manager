import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import GradientButton from '../widgets/GradientButton';

interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => void;
  isLoading: boolean;
  error?: string;
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>();
  
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      {error && (
        <motion.div 
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-20">
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                className="block w-full px-5 py-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                {...register('password', { required: 'Password is required' })}
                type={isVisible ? "text" : "password"}
                className="block w-full px-5 py-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="text-gray-400 hover:text-purple-500 focus:outline-none transition-colors duration-200"
                >
                  {isVisible ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link 
            href="/forgot-password" 
            className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </div> */}
        
        <GradientButton
          size="lg"
          fullWidth
          type="submit"
          disabled={isLoading}
          className="relative z-20"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </GradientButton>
      </form>
    </>
  );
} 