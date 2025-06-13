import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  highlightPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none';
  intensity?: 'low' | 'medium' | 'high';
  onClick?: () => void;
}

export default function GlassCard({ 
  children, 
  className = '',
  highlightPosition = 'top-left',
  intensity = 'medium',
  onClick
}: GlassCardProps) {
  // Configure highlight gradient based on position
  const getHighlightStyle = () => {
    const opacityMap = {
      low: 'opacity-10',
      medium: 'opacity-20',
      high: 'opacity-30'
    };
    
    const opacity = opacityMap[intensity];
    
    if (highlightPosition === 'none') return '';
    
    const positionStyles = {
      'top-left': 'bg-gradient-to-br from-white via-transparent to-transparent',
      'top-right': 'bg-gradient-to-bl from-white via-transparent to-transparent',
      'bottom-left': 'bg-gradient-to-tr from-white via-transparent to-transparent',
      'bottom-right': 'bg-gradient-to-tl from-white via-transparent to-transparent'
    };
    
    return `absolute inset-0 ${positionStyles[highlightPosition]} ${opacity} rounded-inherit`;
  };

  return (
    <motion.div
      className={`relative apple-card overflow-hidden ${className}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <div className={getHighlightStyle()} />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
} 