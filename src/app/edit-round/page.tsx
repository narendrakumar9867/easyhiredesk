"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Save, Mail, ArrowLeft } from 'lucide-react';
import Navbar from "@/src/components/Navbar";
import FooterLogin from '@/src/components/FooterLogin';
import { axiosInstance } from '@/src/utils/axios';

const EditRoundPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const jobId = searchParams.get('jobId');
  const roundNumber = parseInt(searchParams.get('roundNumber') || '1');

  useEffect(() => {
    const hasTokenInUrl = searchParams.get('token');
    if (!hasTokenInUrl || !jobId) {
      return;
    }

    const safeParams = new URLSearchParams({
      jobId,
      roundNumber: String(roundNumber),
    });

    router.replace(`/edit-round?${safeParams.toString()}`);
  }, [jobId, roundNumber, router, searchParams]);

  const [isEditingFields, setIsEditingFields] = useState(false);
  const [newField, setNewField] = useState({
    label: '',
    fieldType: 'text',
    required: false,
    placeholder: ''
  });
  const [isAddingField, setIsAddingField] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [roundTitle, setRoundTitle] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [rejectionEmail, setRejectionEmail] = useState('');
  const [formFields, setFormFields] = useState<any[]>([]);
  const [totalRounds, setTotalRounds] = useState(1);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'file', label: 'File Upload' }
  ];

  const addField = () => {
    if (newField.label.trim()) {
      const field = {
        label: newField.label,
        fieldType: newField.fieldType,
        required: newField.required,
        placeholder: newField.placeholder
      };
      setFormFields([...formFields, field]);
      setNewField({ label: '', fieldType: 'text', required: false, placeholder: '' });
      setIsAddingField(false);
    }
  };

  const removeField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: any) => {
    setFormFields(formFields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const parseEmail = (emailText: string) => {
    const lines = emailText.split('\n');
    const subject = lines[0].replace('Subject: ', '').trim();
    const body = lines.slice(2).join('\n').trim();
    return { subject, body };
  };

  const formatEmailForDisplay = (email: { subject: string; body: string }) => {
    return `Subject: ${email.subject}\n\n${email.body}`;
  };

  useEffect(() => {
    const fetchRoundDetails = async () => {
      if (!jobId) {
        alert('Job ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/rounds/${jobId}`,
          {}
        );
        
        const data = response.data.data;
        setTotalRounds(data.roundDetails?.length || 1);
        
        const roundDetail = data.roundDetails?.find(
          (rd: any) => rd.roundNumber === roundNumber
        );
        
        if (roundDetail) {
          setRoundTitle(roundDetail.title || '');
          setSelectedEmail(formatEmailForDisplay(roundDetail.selectedEmail));
          setRejectionEmail(formatEmailForDisplay(roundDetail.nonSelectedEmail));
          setFormFields(roundDetail.formFields || []);
        } else {
          alert(`Round ${roundNumber} details not found`);
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching round details:', error);
        alert(`Failed to load round details: ${error.response?.data?.message || error.message}`);
        setLoading(false);
      }
    };

    fetchRoundDetails();
  }, [jobId, roundNumber, router]);

  const handleSave = async () => {
    if (!roundTitle.trim()) {
      alert('Please enter a round title');
      return;
    }

    try {
      const payload = {
        jobId,
        roundNumber,
        title: roundTitle,
        formFields: formFields.map(field => ({
          label: field.label,
          fieldType: field.fieldType || field.type,
          placeholder: field.placeholder || '',
          required: field.required || false,
          options: ['select', 'radio', 'checkbox'].includes(field.fieldType || field.type) 
            ? (field.options || ['Option 1', 'Option 2']) 
            : undefined
        })),
        selectedEmail: parseEmail(selectedEmail),
        nonSelectedEmail: parseEmail(rejectionEmail)
      };

      console.log('Updating round with payload:', payload);

      await axiosInstance.put(
        `/round/details/${jobId}/${roundNumber}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Round details updated successfully!');
      window.close();
    } catch (error: any) {
      console.error('Error updating round details:', error);
      alert(`Failed to update: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-[#e7dfd3] bg-white/95 p-10 text-center shadow-[0_24px_70px_-45px_rgba(0,0,0,0.45)]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading round details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8f6f2] text-neutral-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 top-24 h-64 w-64 rounded-full bg-[#d9eadf] blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#f0e3ce] blur-3xl" />
      </div>

      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="relative z-10 pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-6 rounded-[1.75rem] border border-[#e7dfd3] bg-white/90 p-7 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur sm:p-9">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => window.close()}
                className="rounded-xl border border-[#e5dac9] bg-[#f8f1e3] p-2.5 text-[#6e5b3f] transition-colors hover:bg-[#efe4d1]"
                title="Close"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <span className="inline-flex items-center rounded-full border border-[#d8ccb7] bg-[#f8f1e3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6548]">
                  Round Editor
                </span>
                <h1 className="mt-4 text-3xl font-serif tracking-tight text-[#1d1b18] sm:text-4xl">
                  Edit Round {roundNumber} - {roundTitle || 'Untitled Round'}
                </h1>
                <p className="text-neutral-600 mt-2 leading-6">
                  Update round details and email templates (Round {roundNumber} of {totalRounds})
                </p>
              </div>
            </div>
          </div>

          {/* Round Title */}
          <div className="mb-6 rounded-[1.5rem] border border-[#e8e0d4] bg-white p-6 shadow-[0_22px_55px_-45px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-[#1d1b18] mb-4">Round Title</h3>
            <input
              type="text"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
              placeholder={`Enter title for Round ${roundNumber}`}
              className="w-full rounded-xl border border-[#d9d1c4] bg-[#fffdfa] px-4 py-3 text-lg transition-all duration-200 placeholder:text-neutral-400 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
            />
          </div>

          {roundNumber === 1 && (
            <div className="mb-6 rounded-[1.5rem] border border-[#e8e0d4] bg-white p-6 shadow-[0_22px_55px_-45px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#1d1b18]">Form Fields</h3>
                <button
                  onClick={() => setIsEditingFields(!isEditingFields)}
                  className="rounded-full border border-[#d8ccb7] bg-[#f8f1e3] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6e5b3f] transition-colors hover:bg-[#efe4d1] cursor-pointer"
                >
                  {isEditingFields ? 'View Mode' : 'Edit Mode'}
                </button>
              </div>

              {isEditingFields ? (
                // EDIT MODE
                <>
                  <div className="space-y-4 mb-6">
                    {formFields.map((field, index) => (
                      <div key={index} className="rounded-xl border border-[#e7dfd3] bg-[#fffdfa] p-4">
                        <div className="flex justify-between items-start mb-3">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                            className="w-full border-b border-[#d9d1c4] bg-transparent font-medium text-[#1d1b18] focus:outline-none"
                          />
                          <button
                            onClick={() => removeField(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={field.fieldType}
                            onChange={(e) => updateField(index, { fieldType: e.target.value })}
                            className="rounded-lg border border-[#d9d1c4] bg-white px-3 py-2 text-sm focus:border-[#8b6c3f] focus:outline-none"
                          >
                            {fieldTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            value={field.placeholder}
                            onChange={(e) => updateField(index, { placeholder: e.target.value })}
                            placeholder="Placeholder text"
                            className="rounded-lg border border-[#d9d1c4] bg-white px-3 py-2 text-sm focus:border-[#8b6c3f] focus:outline-none"
                          />
                        </div>
                        
                        <label className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">Required field</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Add New Field */}
                  {isAddingField ? (
                    <div className="rounded-xl border-2 border-dashed border-[#d9d1c4] bg-[#fbf7ef] p-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newField.label}
                          onChange={(e) => setNewField({...newField, label: e.target.value})}
                          placeholder="Field Label"
                          className="w-full rounded-lg border border-[#d9d1c4] bg-white px-3 py-2 focus:border-[#8b6c3f] focus:outline-none"
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={newField.fieldType}
                            onChange={(e) => setNewField({...newField, fieldType: e.target.value})}
                            className="rounded-lg border border-[#d9d1c4] bg-white px-3 py-2 focus:border-[#8b6c3f] focus:outline-none"
                          >
                            {fieldTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            value={newField.placeholder}
                            onChange={(e) => setNewField({...newField, placeholder: e.target.value})}
                            placeholder="Placeholder text"
                            className="rounded-lg border border-[#d9d1c4] bg-white px-3 py-2 focus:border-[#8b6c3f] focus:outline-none"
                          />
                        </div>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newField.required}
                            onChange={(e) => setNewField({...newField, required: e.target.checked})}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">Required field</span>
                        </label>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={addField}
                            className="rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-neutral-800 cursor-pointer"
                          >
                            Add Field
                          </button>
                          <button
                            onClick={() => setIsAddingField(false)}
                            className="rounded-lg border border-[#d9d1c4] bg-white px-4 py-2 text-[#4c4438] transition-colors hover:bg-[#f4eee2] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingField(true)}
                      className="w-full rounded-xl border-2 border-dashed border-[#d9d1c4] p-4 text-[#6e5b3f] transition-colors hover:border-[#c9b28d] hover:bg-[#fbf7ef] cursor-pointer"
                    >
                      + Add New Field
                    </button>
                  )}
                </>
              ) : (
                // VIEW MODE
                <div className="space-y-3">
                  {formFields.map((field, index) => (
                    <div key={index} className="rounded-lg border border-[#e7dfd3] bg-[#fffdfa] p-3">
                      <div className="font-medium text-[#1d1b18]">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Type: {field.fieldType}
                        {field.placeholder && ` • Placeholder: ${field.placeholder}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Email Templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Selected Email */}
            <div className="rounded-[1.25rem] border border-[#e8e0d4] bg-white p-6 shadow-[0_22px_55px_-45px_rgba(0,0,0,0.5)]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
                <Mail size={20} />
                Selected Candidates Email
              </h3>
              <textarea
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="h-64 w-full rounded-lg border border-[#d9d1c4] bg-[#fffdfa] px-3 py-2 font-mono text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Write email template for selected candidates..."
              />
              <div className="mt-3 text-xs text-gray-500">
                Use [Candidate Name] and [Position] as placeholders
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Preview:</h4>
                <div className="text-sm text-green-700 whitespace-pre-line">
                  {selectedEmail
                    .replace('[Candidate Name]', 'John Doe')
                    .replace(/\[Position\]/g, 'Software Developer')}
                </div>
              </div>
            </div>

            {/* Rejection Email */}
            <div className="rounded-[1.25rem] border border-[#e8e0d4] bg-white p-6 shadow-[0_22px_55px_-45px_rgba(0,0,0,0.5)]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700">
                <Mail size={20} />
                Non-Selected Candidates Email
              </h3>
              <textarea
                value={rejectionEmail}
                onChange={(e) => setRejectionEmail(e.target.value)}
                className="h-64 w-full rounded-lg border border-[#d9d1c4] bg-[#fffdfa] px-3 py-2 font-mono text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Write email template for non-selected candidates..."
              />
              <div className="mt-3 text-xs text-gray-500">
                Use [Candidate Name] and [Position] as placeholders
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Preview:</h4>
                <div className="text-sm text-red-700 whitespace-pre-line">
                  {rejectionEmail
                    .replace('[Candidate Name]', 'Jane Smith')
                    .replace(/\[Position\]/g, 'Software Developer')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="rounded-[1.5rem] border border-[#e8e0d4] bg-white p-6 shadow-[0_22px_55px_-45px_rgba(0,0,0,0.5)]">
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => window.close()}
                className="rounded-xl border border-[#d9d1c4] bg-white px-6 py-2.5 font-medium text-[#4c4438] transition-colors hover:bg-[#f4eee2]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 font-medium text-white transition-colors hover:bg-neutral-800"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <FooterLogin />
    </div>
  );
};

export default EditRoundPage;