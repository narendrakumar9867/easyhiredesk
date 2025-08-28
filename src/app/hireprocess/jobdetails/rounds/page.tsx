"use client";
import React, { useState } from 'react';
import { Plus, Trash2, Mail, Eye, Save, Edit3 } from 'lucide-react';

import Navbar from "@/src/components/Navbar"
import FooterLogin from '@/src/components/FooterLogin';

const HRCandidateForm = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [formFields, setFormFields] = useState([
    { id: 1, label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
    { id: 2, label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
    { id: 3, label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter phone number' }
  ]);
  
  const [selectedEmail, setSelectedEmail] = useState('Subject: Congratulations! You have been selected\n\nDear [Candidate Name],\n\nWe are pleased to inform you that you have been selected for the position of [Position] at our company.\n\nWe will contact you soon with further details.\n\nBest regards,\nHR Team');
  
  const [rejectionEmail, setRejectionEmail] = useState('Subject: Thank you for your application\n\nDear [Candidate Name],\n\nThank you for your interest in the [Position] role at our company.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current requirements.\n\nWe appreciate the time you invested in the application process and encourage you to apply for future opportunities.\n\nBest regards,\nHR Team');
  
  const [showPreview, setShowPreview] = useState(false);
  const [newField, setNewField] = useState({ label: '', type: 'text', required: false, placeholder: '' });
  const [isAddingField, setIsAddingField] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
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
        id: Date.now(),
        label: newField.label,
        type: newField.type,
        required: newField.required,
        placeholder: newField.placeholder
      };
      setFormFields([...formFields, field]);
      setNewField({ label: '', type: 'text', required: false, placeholder: '' });
      setIsAddingField(false);
    }
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const updateField = (id, updates) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const renderFieldPreview = (field) => {
    const commonProps = {
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
      placeholder: field.placeholder,
      required: field.required
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows="3" />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        );
      case 'file':
        return <input type="file" {...commonProps} className="w-full px-3 py-2 border border-gray-300 rounded-md" />;
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  const saveForm = () => {
    const formData = {
      fields: formFields,
      selectedEmail,
      rejectionEmail,
      createdAt: new Date().toISOString()
    };

    console.log('Form saved:', formData);
    alert('Form configuration saved successfully!');
  };

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <div className="flex justify-center gap-8 border-gray-300 pb-2 pt-4">
        {[1, 2, 3].map((round) => (
          <div 
            key={round}
            className={`pb-2 cursor-pointer ${currentRound === round ? "border-b-4 boder-blue-600 font-bold text-gray-500" : "text-gray-600"}`}
          >
            Round {round}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Round 1- Candidate Details Form</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Edit3 size={20} />
              Form Fields Configuration
            </h2>
            
            {!showPreview ? (
              <>
                <div className="space-y-4 mb-6">
                  {formFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="font-medium text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                          />
                        </div>
                        {index > 2 && (
                          <button
                            onClick={() => removeField(field.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="Placeholder text"
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      
                      <label className="flex items-center mt-3">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">Required field</span>
                      </label>
                    </div>
                  ))}
                </div>

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
                          value={newField.type}
                          onChange={(e) => setNewField({...newField, type: e.target.value})}
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
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add New Field
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Form Preview</h3>
                  <p className="text-blue-700 text-sm">This is how candidates will see the form</p>
                </div>
                
                {formFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFieldPreview(field)}
                  </div>
                ))}
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Submit Application
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
                <Mail size={20} />
                Selected Candidates Email Template
              </h3>
              <textarea
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                placeholder="Write email template for selected candidates..."
              />
              <div className="mt-3 text-xs text-gray-500">
                Use [Candidate Name] and [Position] as placeholders
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700">
                <Mail size={20} />
                Non-Selected Candidates Email Template
              </h3>
              <textarea
                value={rejectionEmail}
                onChange={(e) => setRejectionEmail(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                placeholder="Write email template for non-selected candidates..."
              />
              <div className="mt-3 text-xs text-gray-500">
                Use [Candidate Name] and [Position] as placeholders
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Selected Email Preview:</h4>
                  <div className="text-sm text-green-700 whitespace-pre-line">
                    {selectedEmail.replace('[Candidate Name]', 'John Doe').replace(/\[Position\]/g, 'Software Developer')}
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Rejection Email Preview:</h4>
                  <div className="text-sm text-red-700 whitespace-pre-line">
                    {rejectionEmail.replace('[Candidate Name]', 'Jane Smith').replace(/\[Position\]/g, 'Software Developer')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white pb-6 mb-6 mt-6">
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Eye size={20} />
              {showPreview ? 'Edit Mode' : 'Preview'}
            </button>
            <button
              onClick={saveForm}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={20} />
              Save Form
            </button>

            {currentRound > 1 && (
              <button
                onClick={() => setCurrentRound(currentRound - 1)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Previous
              </button>
            )}
            {currentRound < 3 && (
              <button
                onClick={() => setCurrentRound(currentRound + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <FooterLogin />
    </div>
  );
};

export default HRCandidateForm;