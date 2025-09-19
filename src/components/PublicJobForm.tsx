"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import LoginPage from '../app/(auth)/Login';
import PublicFormSignUp from '../app/(auth)/SignUp';
import { useAuth } from "@/src/hooks/useAuth";

interface FormConfig {
  job: JobInfo;
  formFields: FormField[];
  roundTitle: string;
}

interface FormField {
  label: string;
  fieldType: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface JobInfo {
  title: string;
  company: string;
  location: string;
  companyWebsite: string;
  socialLinks: Array<{platform: string; url: string}>;
  aboutJob: string;
}

const PublicJobApplicationForm = () => {
  const params = useParams();
  const router = useRouter();
  const { authUser, token, checkAuth } = useAuth();
  
  const jobId = params?.id as string;
  
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch form configuration
  useEffect(() => {
    const fetchFormConfig = async () => {
      if (!jobId) return;
      console.log("Fetching form config for jobId:", jobId);

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/form/config/${jobId}`);
        console.log("Form config response:", response.data);
        
        if (response.data.success) {
          // Check if job is closed
          if (response.data.data.job.isClosed) {
            setError("This job application is no longer accepting submissions.");
            return;
          }
          
          // Check if job is expired
          if (response.data.data.job.closeDate) {
            const closeDate = new Date(response.data.data.job.closeDate);
            const now = new Date();
            if (now > closeDate) {
              setError("This job application deadline has passed.");
              return;
            }
          }
          
          setFormConfig(response.data.data);
          // Initialize form data with empty values
          const initialData: Record<string, any> = {};
          response.data.data.formFields.forEach((field: FormField) => {
            initialData[field.label] = field.fieldType === 'checkbox' ? [] : '';
          });
          setFormData(initialData);
          console.log("Initial form data:", initialData);
        } else {
          setError("Form configuration not found");
        }
      } catch (error: any) {
        console.error("Error fetching form config:", error);
        setError(error.response?.data?.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchFormConfig();
  }, [jobId]);

  // Check if user already submitted
  useEffect(() => {
    const checkExistingSubmission = async () => {
      if (!token || !jobId) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/form/my-submission/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data.success) {
          setAlreadySubmitted(true);
        }
      } catch (error) {
        // No existing submission - this is expected for new candidates
        setAlreadySubmitted(false);
      }
    };

    if (authUser && token) {
      checkExistingSubmission();
    }
  }, [authUser, token, jobId]);

  const handleInputChange = (fieldLabel: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldLabel]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authUser) {
      setShowLogin(true);
      return;
    }

    if (!formConfig) return;

    console.log("Form data before submission:", formData);
    console.log("Form config fields:", formConfig.formFields);

    // Validate required fields
    for (const field of formConfig.formFields) {
      const fieldValue = formData[field.label];
      console.log(`Checking field ${field.label}:`, fieldValue, "Required:", field.required);
      
      if (field.required && (!fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0))) {
        alert(`${field.label} is required`);
        return;
      }
    }

    try {
      setSubmitting(true);
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add basic form data
      formDataToSend.append('jobId', jobId);
      formDataToSend.append('candidateEmail', authUser.email);
      formDataToSend.append('candidateName', formData['Full Name'] || authUser.email);
      
      // Prepare responses with proper value handling
      const responses = formConfig.formFields.map((field, index) => {
        const fieldValue = formData[field.label];
        
        console.log(`Processing field ${field.label} (${field.fieldType}):`, fieldValue);
        
        if (field.fieldType === 'file') {
          // For file fields, append the file separately
          if (fieldValue) {
            formDataToSend.append(`file_${index}`, fieldValue);
          }
          
          return {
            fieldLabel: field.label,
            fieldType: field.fieldType,
            value: fieldValue ? fieldValue.name : null
          };
        } else if (field.fieldType === 'checkbox') {
          // Handle checkbox arrays
          return {
            fieldLabel: field.label,
            fieldType: field.fieldType,
            value: Array.isArray(fieldValue) ? fieldValue : []
          };
        } else {
          // Handle all other field types
          return {
            fieldLabel: field.label,
            fieldType: field.fieldType,
            value: fieldValue || '' // Ensure we send empty string instead of undefined/null
          };
        }
      });

      console.log("Prepared responses:", responses);

      // Add responses as JSON string
      formDataToSend.append('responses', JSON.stringify(responses));
      const response = await axios.post(
        'http://localhost:5000/api/form/submit',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log("Submission response:", response.data);

      if (response.data) {
        setApplicationSubmitted(true);
      }
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      console.error("Error response:", error.response?.data);
      alert(error.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSignupToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      required: field.required,
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
      placeholder: field.placeholder,
      value: formData[field.label] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleInputChange(field.label, e.target.value)
    };

    switch (field.fieldType) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={formData[field.label] || ''}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(formData[field.label] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = formData[field.label] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleInputChange(field.label, newValues);
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  checked={formData[field.label] === option}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              required={field.required}
              accept='.pdf,.doc,.docx'
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInputChange(field.label, file);
              }}
            />
            {field.required && (
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX (Max: 10 MB)
              </p>
            )}
            {formData[field.label] && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {formData[field.label].name}
              </p>
            )}
          </div>
        );

      default:
        return (
          <input
            type={field.fieldType}
            {...commonProps}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading application form...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Already Submitted</h2>
          <p className="text-gray-600 mb-4">
            You have already submitted your application for this position. 
            We'll contact you if you're selected for the next round.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View My Applications
          </button>
        </div>
      </div>
    );
  }

  if (applicationSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your application. We have received your submission and will review it shortly. 
            We'll contact you if you're selected for the next round.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/`)}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View My Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Form configuration not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {formConfig.job.title}
          </h1>
          
          {/* Job Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium text-sm">Company:</span>
                <p className="text-gray-800">{formConfig.job.company}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium text-sm">Location:</span>
                <p className="text-gray-800">{formConfig.job.location}</p>
              </div>
            </div>
            <div className="space-y-3">
              {formConfig.job.companyWebsite && (
                <div>
                  <span className="text-gray-600 font-medium text-sm">Website:</span>
                  <p className="text-gray-800">
                    <a href={formConfig.job.companyWebsite} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {formConfig.job.companyWebsite}
                    </a>
                  </p>
                </div>
              )}
              {formConfig.job.socialLinks && Array.isArray(formConfig.job.socialLinks) && formConfig.job.socialLinks.length > 0 && (
                <div>
                  <span className="text-gray-600 font-medium text-sm">Social Links:</span>
                  <div className="text-gray-800">
                    {formConfig.job.socialLinks.map((link, index) => (
                      <div key={index}>
                        <a href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline capitalize">
                          {link.platform}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Job Description */}
          {formConfig.job.aboutJob && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
              <div className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                <div className="whitespace-pre-line">
                  {formConfig.job.aboutJob}
                </div>
              </div>
            </div>
          )}
            
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {formConfig.roundTitle}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Please fill out all required fields to submit your application.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formConfig.formFields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

            {!authUser ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-4 text-center font-medium">
                  Sign up or log in to submit your application
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLogin(true)}
                    className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Log In
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Login Modal */}
      <LoginPage 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSignupClick={handleLoginToSignup}
      />

      {/* Signup Modal */}
      <PublicFormSignUp
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onLoginClick={handleSignupToLogin}
      />
    </div>
  );
};

export default PublicJobApplicationForm;