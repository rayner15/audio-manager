import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  rules?: Record<string, any>;
  icon?: React.ReactNode;
  className?: string;
}

const Input = ({
  name,
  label,
  placeholder,
  type = 'text',
  rules,
  icon,
  className,
}: InputProps) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue=""
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              value={field.value || ""}
              className={`block w-full px-4 py-2 mt-1 text-gray-900 placeholder-gray-400 bg-white border ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
            {icon && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {icon}
              </div>
            )}
          </div>
        )}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]?.message as string}</p>
      )}
    </div>
  );
};

export default Input; 