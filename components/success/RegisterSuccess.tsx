import { CheckCircleIcon } from "lucide-react";

interface RegisterSuccessProps {
  title?: string;
  message?: string;
  redirectMessage?: string;
}

export default function RegisterSuccess({
  title = "Welcome to Audio Hub!",
  message = "Your account has been created successfully.",
  redirectMessage = "Redirecting you to the login page...",
}: RegisterSuccessProps) {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 text-lg mb-6">{message}</p>
          <p className="text-gray-500">{redirectMessage}</p>
        </div>
      </div>
    </div>
  );
}
