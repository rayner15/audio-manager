import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function GradientButton({
  children,
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  icon,
  fullWidth = false,
  type = 'button'
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const gradientClasses = 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg';

  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200 ease-in-out
    ${sizeClasses[size]}
    ${gradientClasses}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'apple-button-hover'}
    ${className}
  `;

  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
} 