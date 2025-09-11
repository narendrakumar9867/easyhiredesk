"use client";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/hooks/useAuth";

interface FormData {
  role: string;
  email: string;
  password: string;
}

interface SignUpPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void; // Add this prop for navigation to login
}

export default function PublicFormSignUp({ isOpen, onClose, onLoginClick }: SignUpPageProps) {
  if(!isOpen) return null;

  const [formData, setFormData] = useState<FormData>({
    role: "candidate", // Default to candidate for job application
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuth();

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
      toast.error("Role selection is required.");
      return false;
    }

    if(!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    if(!validateEmail(formData.email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if(!formData.password) {
      toast.error("Password is required.");
      return false;
    }

    if(formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    return true;
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signup(formData);
      onClose();
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }, [formData, validateForm, signup, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Create your account</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Create an account to apply for this position
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <select 
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={isSigningUp}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          >
            <option value="candidate">Candidate</option>
            <option value="hire_manager">Hire Manager</option>
          </select> 
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isSigningUp}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isSigningUp}
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSigningUp ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onLoginClick}
              className="text-blue-600 hover:underline"
            >
              Log in here
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
  );
}