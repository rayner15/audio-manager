'use client';

import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoginFormData } from '@/interface/login';
import Layout from '../components/widgets/Layout';
import Logo from "@/components/widgets/Logo";
import Footer from "@/components/widgets/Footer";
import LoginForm from "@/components/ui/LoginForm";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: data.username,
        password: data.password,
      });
      
      if (result?.error) {
        setError('Invalid username or password');
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred during login');
      setIsLoading(false);
      console.log(error)
    }
  };

  return (
    <Layout backgroundType="purple">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md px-4">
          <Logo />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="p-8 apple-card">
              <CardContent className="p-0">
                <LoginForm 
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                  error={error}
                />

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">Don't have an account?</p>
                  <Link href="/register">
                    <button className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm">
                      Create Account
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <Footer text="By signing in, you agree to our Terms of Service and Privacy Policy" />
        </div>
      </div>
    </Layout>
  );
}

