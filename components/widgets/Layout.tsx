'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  backgroundType?: 'light' | 'dark' | 'purple' | 'blue' | 'green';
}

export default function Layout({ 
  children, 
  backgroundType = 'light' 
}: LayoutProps) {
  // Background gradient based on type
  const getBackgroundGradient = () => {
    switch (backgroundType) {
      case 'dark':
        return 'from-gray-900 via-gray-800 to-gray-900';
      case 'purple':
        return 'from-purple-50 via-pink-50 to-indigo-50';
      case 'blue':
        return 'from-slate-50 via-blue-50 to-indigo-50';
      case 'green':
        return 'from-green-50 via-emerald-50 to-teal-50';
      default:
        return 'from-gray-50 via-white to-gray-100';
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${getBackgroundGradient()}`}>
      {/* Ambient Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
            animate={{
              x: [0, 20, 0],
              y: [0, 20, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </div>

      {/* Glass Panel Effect */}
      {/* <div className="absolute inset-x-0 top-0 h-24 apple-glass z-0 pointer-events-none" /> */}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 