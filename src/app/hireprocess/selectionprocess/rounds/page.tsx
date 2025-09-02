"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Mail, Eye, Save, Edit3 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Navbar from "@/src/components/Navbar"
import FooterLogin from '@/src/components/FooterLogin';
import axios from 'axios';

const RoundPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [totalRounds, setTotalRounds] = useState(3);
  const [allRoundsData, setAllRoundsData] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [roundDetailsIds, setRoundDetailsIds] = useState({});
  
  const jobId = searchParams.get('jobId');
  const rounds = searchParams.get('rounds');
  
  const [roundTitles, setRoundTitles] = useState({
    1: 'Candidate Details Form'
  });
  const [formFields, setFormFields] = useState([
    { id: 1, label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
    { id: 2, label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
    { id: 3, label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter phone number' }
  ]);
  
  const [selectedEmail, setSelectedEmail] = useState('Subject: Congratulations! You have been selected for Round ' + (currentRound + 1) + '\n\nDear [Candidate Name],\n\nWe are pleased to inform you that you have been selected to proceed to Round ' + (currentRound + 1) + ' for the position of [Position] at our company.\n\nWe will contact you soon with further details.\n\nBest regards,\nHR Team');
  
  const [rejectionEmail, setRejectionEmail] = useState('Subject: Thank you for your application - Round ' + currentRound + '\n\nDear [Candidate Name],\n\nThank you for your interest in the [Position] role at our company.\n\nAfter careful consideration of Round ' + currentRound + ', we have decided to move forward with other candidates whose qualifications more closely match our current requirements.\n\nWe appreciate the time you invested in the application process and encourage you to apply for future opportunities.\n\nBest regards,\nHR Team');
  
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

  const parseEmail = useCallback((emailText) => {
    const lines = emailText.split('\n');
    const subject = lines[0].replace('Subject: ', '').trim();
    const body = lines.slice(2).join('\n').trim();
    return { subject, body };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobId || !rounds) {
      alert('Missing job or rounds information');
      return;
    }

    try {
      saveCurrentRoundData();
      
      const updatedAllRoundsData = { ...allRoundsData };
      const currentData = {
        title: roundTitles[currentRound] || `Round ${currentRound}`,
        formFields: currentRound === 1 ? formFields : [],
        selectedEmail,
        rejectionEmail
      };
      updatedAllRoundsData[currentRound] = currentData;
      
      for (let roundNum = 1; roundNum <= totalRounds; roundNum++) {
        const roundData = updatedAllRoundsData[roundNum];
        
        if (!roundData) {
          alert(`Please configure Round ${roundNum} before submitting`);
          return;
        }

        const roundDetailsId = jobId;
        
        const payload = {
          roundDetailsId: roundDetailsId,
          title: roundData.title || `Round ${roundNum}`,
          formFields: roundData.formFields.map(field => ({
            label: field.label,
            fieldType: field.type,
            placeholder: field.placeholder || '',
            required: field.required || false,
            options: field.type === 'select' ? ['Option 1', 'Option 2'] : undefined
          })),
          selectedEmail: parseEmail(roundData.selectedEmail),
          nonSelectedEmail: parseEmail(roundData.rejectionEmail)
        };

        console.log(`Submitting Round ${roundNum} with payload:`, payload);

        const res = await axios.post("http://localhost:5000/api/round/details", payload, {
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        console.log(`Round ${roundNum} saved:`, res.data);
      }

      alert("All rounds configured successfully!");
      router.push("/");
      
    } catch (error) {
      console.error("Error submitting rounds:", error);
      console.error("Error details:", error.response?.data);
      alert(`Error submitting rounds: ${error.response?.data?.message || error.message}`);
    }
  };

  const saveCurrentRoundData = useCallback(() => {
    const currentRoundData = {
      title: roundTitles[currentRound] || `Round ${currentRound}`,
      formFields: currentRound === 1 ? formFields : [],
      selectedEmail,
      rejectionEmail
    };
    
    setAllRoundsData(prev => ({
      ...prev,
      [currentRound]: currentRoundData
    }));
  }, [currentRound, formFields, selectedEmail, rejectionEmail, roundTitles]);

  useEffect(() => {
    const fetchRoundDetails = async () => {
      if (jobId && rounds) {
        try {
          console.log("Job ID:", jobId);
          console.log("Number of rounds:", rounds);
          
          const ids = {};
          const numberOfRounds = parseInt(rounds);
          
          for (let i = 1; i <= numberOfRounds; i++) {
            ids[i] = jobId;
          }
          
          setRoundDetailsIds(ids);
          console.log("Round details IDs mapping:", ids);
          
        } catch (error) {
          console.error('Error setting up round details:', error);
          alert('Error setting up round details. Please try again.');
        }
      }
    };
  
    fetchRoundDetails();
  }, [jobId, rounds]);

  useEffect(() => {
    const rounds = searchParams.get('rounds');
    if (rounds) {
      setTotalRounds(parseInt(rounds));
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentRound === totalRounds) {
      setSelectedEmail('Subject: Congratulations! You have been selected\n\nDear [Candidate Name],\n\nWe are pleased to inform you that you have been selected for the position of [Position] at our company.\n\nWe will contact you soon with further details about joining our team.\n\nBest regards,\nHR Team');
    } else {
      setSelectedEmail('Subject: Congratulations! You have been selected for Round ' + (currentRound + 1) + '\n\nDear [Candidate Name],\n\nWe are pleased to inform you that you have been selected to proceed to Round ' + (currentRound + 1) + ' for the position of [Position] at our company.\n\nWe will contact you soon with further details.\n\nBest regards,\nHR Team');
    }
    
    setRejectionEmail('Subject: Thank you for your application - Round ' + currentRound + '\n\nDear [Candidate Name],\n\nThank you for your interest in the [Position] role at our company.\n\nAfter careful consideration of Round ' + currentRound + ', we have decided to move forward with other candidates whose qualifications more closely match our current requirements.\n\nWe appreciate the time you invested in the application process and encourage you to apply for future opportunities.\n\nBest regards,\nHR Team');
    
    const savedData = allRoundsData[currentRound];
    if (savedData) {
      setRoundTitles(prev => ({
        ...prev,
        [currentRound]: savedData.title
      }));
      setSelectedEmail(savedData.selectedEmail);
      setRejectionEmail(savedData.rejectionEmail);
      if (currentRound === 1 && savedData.formFields.length > 0) {
        setFormFields(savedData.formFields);
      }
    }
  }, [currentRound, totalRounds, allRoundsData]);

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

  const updateRoundTitle = (roundNumber, title) => {
    setRoundTitles(prev => ({
      ...prev,
      [roundNumber]: title
    }));
  };

  const generateRounds = () => {
    return Array.from({ length: totalRounds }, (_, i) => i + 1);
  };

  const handleRoundChange = (targetRound) => {
    if (currentRound === 1 && formFields.length === 0) {
      alert('Please add at least one form field before switching rounds');
      return;
    }
    
    if (!roundTitles[currentRound] || roundTitles[currentRound].trim() === '') {
      alert(`Please enter a title for Round ${currentRound} before switching`);
      return;
    }
    
    saveCurrentRoundData();
    setCurrentRound(targetRound);
  };

  const renderRoundContent = () => {
    if (currentRound === 1) {
      return (
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
                            className="font-medium text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
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
                
                <button className="w-full bg-gray-100 text-black py-3 rounded-lg hover:bg-black hover:text-white transition-colors">
                  Submit Application
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
                <Mail size={20} />
                Selected Candidates Email
              </h3>
              <textarea
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                placeholder="Write email template for selected candidates..."
              />
              <div className="mt-3 text-xs text-gray-500">
                Use [Candidate Name] and [Position] as placeholders
              </div>
            </div>

            <div className="bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700">
                <Mail size={20} />
                Non-Selected Candidates Email
              </h3>
              <textarea
                value={rejectionEmail}
                onChange={(e) => setRejectionEmail(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                placeholder="Write email template for non-selected candidates..."
              />
              <div className="mt-3 text-xs text-gray-500">
                Use [Candidate Name] and [Position] as placeholders
              </div>
            </div>

            <div className="bg-white p-6">
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
      );
    } else {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white mb-6">
            <h3 className="text-lg font-semibold mb-4">Round Title</h3>
            <input
              type="text"
              value={roundTitles[currentRound] || ''}
              onChange={(e) => updateRoundTitle(currentRound, e.target.value)}
              placeholder={`Enter title for Round ${currentRound} (e.g., Technical Interview, HR Interview, Final Interview)`}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
                <Mail size={20} />
                Selected Candidates Email
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

            <div className="bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700">
                <Mail size={20} />
                Non-Selected Candidates Email
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

            <div className="bg-white p-6">
              <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Selected Email Preview:</h4>
                  <div className="text-sm text-green-700 whitespace-pre-line">
                    {selectedEmail.replace('[Candidate Name]', 'John Doe').replace(/\[Position\]/g, 'Software Developer')}
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-808 mb-2">Rejection Email Preview:</h4>
                  <div className="text-sm text-red-700 whitespace-pre-line">
                    {rejectionEmail.replace('[Candidate Name]', 'Jane Smith').replace(/\[Position\]/g, 'Software Developer')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex justify-center gap-8 border-gray-300 pb-2 pt-4">
        {generateRounds().map((round) => (
          <div 
            key={round}
            onClick={() => handleRoundChange(round)}
            className={`pb-2 cursor-pointer transition-all ${
              currentRound === round 
                ? "border-b-4 border-blue-600 font-bold text-blue-600" 
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Round {round}
            {allRoundsData[round] && <span className="ml-1 text-green-500">✓</span>}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Round {currentRound}{roundTitles[currentRound] ? ` - ${roundTitles[currentRound]}` : ''}
              </h1>
              <p className="text-gray-600 mt-2">
                {currentRound === 1 
                  ? `Configure candidate application form fields and email for Round ${currentRound} of ${totalRounds}`
                  : `Configure email templates for Round ${currentRound} of ${totalRounds}`
                }
              </p>
            </div>
          </div>
        </div>

        {renderRoundContent()}

        <div className="bg-white pb-6 mb-6 mt-6 px-6">
          <div className="flex gap-3 justify-end">
            {currentRound === 1 && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:text-black hover:bg-gray-200 transition-colors"
              >
                <Eye size={20} />
                {showPreview ? 'Edit Mode' : 'Preview'}
              </button>
            )}

            {currentRound > 1 && (
              <button
                onClick={() => handleRoundChange(currentRound - 1)}
                className="px-4 py-2 bg-gray-200 text-black hover:text-white hover:bg-black rounded-lg"
              >
                Previous Round
              </button>
            )}
            
            {currentRound < totalRounds && (
              <button
                onClick={() => handleRoundChange(currentRound + 1)}
                className="px-4 py-2 bg-gray-200 text-black hover:text-white hover:bg-black rounded-lg"
              >
                Next Round
              </button>
            )}

            {currentRound === totalRounds && (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-200 hover:text-black transition-colors"
              >
                <Save size={20} />
                Submit All Rounds
              </button>
            )}
          </div>
        </div>
      </div>

      <FooterLogin />
    </div>
  );
};

export default RoundPage;