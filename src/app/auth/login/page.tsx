"use client";
import { useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

interface FormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick?: () => void; // Add this prop for navigation to signup
}

export default function LoginPage({ isOpen, onClose, onSignupClick }: LoginPageProps) {
  if(!isOpen) return null;

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuth();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const validateEmail = (email: string): boolean => {
    if(!email) {
      return false;
    }

    const trimmedEmail = email.trim();
    
    const atIndex = trimmedEmail.indexOf('@');
    if (atIndex <= 0 || atIndex === trimmedEmail.length - 1) return false;
    
    const localPart = trimmedEmail.substring(0, atIndex);
    const domainPart = trimmedEmail.substring(atIndex + 1);
    
    if (localPart.length === 0) return false;
    
    const dotIndex = domainPart.lastIndexOf('.');
    if (dotIndex <= 0 || dotIndex === domainPart.length - 1) return false;
    
    const domainName = domainPart.substring(0, dotIndex);
    const topLevelDomain = domainPart.substring(dotIndex + 1);
    
    return domainName.length > 0 && topLevelDomain.length > 0;
  }

  const handleGooleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // Get the current URL without any existing query parameters
      const currentUrl = new URL(window.location.href);
      const cleanUrl = `${currentUrl.origin}${currentUrl.pathname}`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: cleanUrl
        }
      });
      if(error) {
        setError(error.message);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const validateForm = useCallback((): boolean => {
    if(!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required.");
      return false;
    }

    return true;
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!validateForm()) return;

    try {
      await login(formData);
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, [formData, validateForm, login, onClose]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Log in to your account</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your credentials to apply for this position
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoggingIn}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoggingIn}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoggingIn ? "Logging In..." : "Log In"}
          </button>

          <p className="flex flex-col items-center">or</p>

          <div className="mt-4">
            <button
            type="button"
            onClick={handleGooleLogin}
            disabled={loading}
            className="w-full py-2 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50 transition-colors gap-2"
            >
              <Image
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width={10}
                  height={10}
                  className="w-5 h-5"
              />
              Sign In with Google
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSignupClick}
              className="text-blue-600 hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          By proceeding you accept our{" "}
          <a href="#" className="text-blue-600">Terms of Use</a> and{" "}
          <a href="#" className="text-blue-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
    </>
  );
}