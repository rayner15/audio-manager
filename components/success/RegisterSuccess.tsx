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
