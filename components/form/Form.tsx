import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  useFormMethods: UseFormReturn<any>;
}

const Form = ({
  children,
  onSubmit,
  className = "",
  useFormMethods,
}: FormProps) => {
  return (
    <FormProvider {...useFormMethods}>
      <form onSubmit={onSubmit} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

// Attach components to Form
Form.Input = Input;
Form.Button = Button;

export default Form;
