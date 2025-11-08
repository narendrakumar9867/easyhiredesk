"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Save, Mail, ArrowLeft } from 'lucide-react';
import Navbar from "@/src/components/Navbar";
import FooterLogin from '@/src/components/FooterLogin';

const EditRoundPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const jobId = searchParams.get('jobId');
  const roundNumber = parseInt(searchParams.get('roundNumber') || '1');
  const tokenFromUrl = searchParams.get('token');

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
        const token = tokenFromUrl || localStorage.getItem('token');
        if (!token) {
          alert('Authentication required');
          router.push('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/rounds/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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
      const token = tokenFromUrl || localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        router.push('/login');
        return;
      }

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

      await axios.put(
        `http://localhost:5000/api/round/details/${jobId}/${roundNumber}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading round details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="bg-white mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => window.close()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Round {roundNumber} - {roundTitle || 'Untitled Round'}
                </h1>
                <p className="text-gray-600 mt-2">
                  Update round details and email templates (Round {roundNumber} of {totalRounds})
                </p>
              </div>
            </div>
          </div>

          {/* Round Title */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold mb-4">Round Title</h3>
            <input
              type="text"
              value={roundTitle}
              onChange={(e) => setRoundTitle(e.target.value)}
              placeholder={`Enter title for Round ${roundNumber}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          {roundNumber === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Form Fields</h3>
                <button
                  onClick={() => setIsEditingFields(!isEditingFields)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {isEditingFields ? 'View Mode' : 'Edit Mode'}
                </button>
              </div>

              {isEditingFields ? (
                // EDIT MODE
                <>
                  <div className="space-y-4 mb-6">
                    {formFields.map((field, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                            className="font-medium text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                          />
                          <button
                            onClick={() => removeField(index)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={field.fieldType}
                            onChange={(e) => updateField(index, { fieldType: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newField.label}
                          onChange={(e) => setNewField({...newField, label: e.target.value})}
                          placeholder="Field Label"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={newField.fieldType}
                            onChange={(e) => setNewField({...newField, fieldType: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-md"
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
                            className="px-3 py-2 border border-gray-300 rounded-md"
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add Field
                          </button>
                          <button
                            onClick={() => setIsAddingField(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingField(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      + Add New Field
                    </button>
                  )}
                </>
              ) : (
                // VIEW MODE
                <div className="space-y-3">
                  {formFields.map((field, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="font-medium text-gray-900">
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
                <Mail size={20} />
                Selected Candidates Email
              </h3>
              <textarea
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700">
                <Mail size={20} />
                Non-Selected Candidates Email
              </h3>
              <textarea
                value={rejectionEmail}
                onChange={(e) => setRejectionEmail(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => window.close()}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
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