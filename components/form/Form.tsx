import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import Input from './Input';
import Button from './Button';

interface FormProps {
  children: React.ReactNode;
  useFormMethods: UseFormReturn<any>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
  className?: string;
}

const Form = ({
  children,
  useFormMethods,
  onSubmit,
  className = '',
}: FormProps) => {
  return (
    <FormProvider {...useFormMethods}>
      <form className={`flex flex-col ${className}`} onSubmit={onSubmit}>
        {children}
      </form>
    </FormProvider>
  );
};

// Attach components to Form
Form.Input = Input;
Form.Button = Button;

export default Form; 