"use client";
import { useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/src/hooks/useAuth";

interface FormData {
  role: string;
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
    role: "candidate",
    email: "",
    password: "",
  });
  const { login, loginWithGoogle, getCachedLoginAuthProvider, isLoggingIn, isGoogleSigningIn } = useAuth();
  
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

  const validateForm = useCallback((): boolean => {
    if(!formData.role) {
      toast.error("Please select role.")
      return false;
    }

    if(!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!validateForm()) return;

    const provider = getCachedLoginAuthProvider(formData.email);
    if (provider === "google") {
      toast.error("Yeh account Google se registered hai. Sign in with Google use karo.");
      return;
    }

    try {
      await login(formData);
      toast.success("Logged in successfully!");
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      
      if (error.response?.status === 400) {
        if (errorMessage?.includes("does not exist")) {
          toast.error("No account found with this email.");
        } else if (errorMessage?.includes("password")) {
          toast.error("Incorrect password.");
        } else if (errorMessage?.includes("role")) {
          toast.error(errorMessage);
        } else {
          toast.error(errorMessage || "Invalid credentials.");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  }, [formData, validateForm, getCachedLoginAuthProvider, login, onClose]);

  const handleGoogleLogin = useCallback(async () => {
    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }

    const provider = getCachedLoginAuthProvider(formData.email);
    if (provider === "email") {
      toast.error("Yeh account email/password se registered hai. Password se login karo.");
      return;
    }

    try {
      await loginWithGoogle(formData.role);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Google login failed.");
    }
  }, [formData.email, formData.role, getCachedLoginAuthProvider, loginWithGoogle, onClose]);

  return (
    <>
      <Toaster position="top-center"/>

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
          {/* <select 
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={isLoggingIn}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          >
            <option value="candidate">Candidate</option>
            <option value="hire_manager">Hire Manager</option>
          </select> */}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoggingIn || isGoogleSigningIn}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />

            <>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoggingIn || isGoogleSigningIn}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />

              <button
                type="submit"
                disabled={isLoggingIn || isGoogleSigningIn}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {isLoggingIn ? "Logging In..." : "Log In"}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleSigningIn || isLoggingIn}
                className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                {isGoogleSigningIn ? "Signing in with Google..." : "Sign in with Google"}
              </button>
            </>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSignupClick}
              className="text-black hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          By proceeding you accept our{" "}
          <a href="#" className="text-black">Terms of Use</a> and{" "}
          <a href="#" className="text-black">Privacy Policy</a>.
        </p>
      </div>
    </div>
    </>
  );
}