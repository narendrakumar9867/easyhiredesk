"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Eye, Save, Edit3 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

import Navbar from "@/src/components/Navbar";
import FooterLogin from '@/src/components/FooterLogin';
import RoundTabs from '@/src/components/Rounds/RoundTabs';
import FormFieldEditor from '@/src/components/Rounds/FormFieldEditor';
import FormFieldPreview from '@/src/components/Rounds/FormFieldPreview';
import EmailTemplateEditor from '@/src/components/Rounds/EmailTemplateEditor';

import { useFormFields } from '@/src/hooks/useFormFields';
import { useRoundData } from '@/src/hooks/useRoundData';

import { parseEmail } from '@/src/utils/emailParser';
import { fieldTypes } from '@/src/utils/fieldTypes';
import { axiosInstance } from '@/src/utils/axios';

import { FormField } from '@/src/types/rounds';

const RoundPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const jobId = searchParams.get('jobId');
  const rounds = searchParams.get('rounds');
  
  const [totalRounds, setTotalRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState<Omit<FormField, 'id'>>({ 
    label: '', 
    type: 'text', 
    required: false, 
    placeholder: '', 
    options: [] 
  });

  // Custom Hooks
  const {
    allRoundsData,
    roundTitles,
    setRoundTitles,
    saveCurrentRoundData,
    updateRoundTitle
  } = useRoundData();

  const {
    formFields,
    setFormFields,
    addField: addFieldToState,
    removeField,
    updateField,
    addOption,
    updateOption,
    removeOption
  } = useFormFields([
    { id: 1, label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
    { id: 2, label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
    { id: 3, label: 'Phone Number', type: 'phone', required: true, placeholder: 'Enter phone number' }
  ]);

  const [selectedEmail, setSelectedEmail] = useState('');
  const [rejectionEmail, setRejectionEmail] = useState('');

  // Initialize emails based on round
  useEffect(() => {
    if (currentRound === totalRounds) {
      setSelectedEmail('Subject: Congratulations! You have been selected\n\nDear [Candidate Name],\n\nWe are pleased to inform you that you have been selected for the position of [Position] at our company.\n\nWe will contact you soon with further details about joining our team.\n\nBest regards,\nHR Team');
    } else {
      setSelectedEmail(`Subject: Congratulations! You have been selected for Round ${currentRound + 1}\n\nDear [Candidate Name],\n\nWe are pleased to inform you that you have been selected to proceed to Round ${currentRound + 1} for the position of [Position] at our company.\n\nWe will contact you soon with further details.\n\nBest regards,\nHR Team`);
    }
    
    setRejectionEmail(`Subject: Thank you for your application - Round ${currentRound}\n\nDear [Candidate Name],\n\nThank you for your interest in the [Position] role at our company.\n\nAfter careful consideration of Round ${currentRound}, we have decided to move forward with other candidates whose qualifications more closely match our current requirements.\n\nWe appreciate the time you invested in the application process and encourage you to apply for future opportunities.\n\nBest regards,\nHR Team`);
    
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

  useEffect(() => {
    const roundsParam = searchParams.get('rounds');
    if (roundsParam) {
      setTotalRounds(parseInt(roundsParam));
    }
  }, [searchParams]);

  const handleAddField = () => {
    if (newField.label.trim()) {
      addFieldToState(newField);
      setNewField({ label: '', type: 'text', required: false, placeholder: '', options: [] });
      setIsAddingField(false);
    }
  };

  const handleRoundChange = (targetRound: number) => {
    if (currentRound === 1 && formFields.length === 0) {
      alert('Please add at least one form field before switching rounds');
      return;
    }
    
    if (!roundTitles[currentRound] || roundTitles[currentRound].trim() === '') {
      alert(`Please enter a title for Round ${currentRound} before switching`);
      return;
    }
    
    saveCurrentRoundData({
      currentRound,
      formFields,
      selectedEmail,
      rejectionEmail,
      roundTitles
    });
    setCurrentRound(targetRound);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobId || !rounds) {
      alert('Missing job or rounds information');
      return;
    }

    try {
      saveCurrentRoundData({
        currentRound,
        formFields,
        selectedEmail,
        rejectionEmail,
        roundTitles
      });
      
      const updatedAllRoundsData = { 
        ...allRoundsData,
        [currentRound]: {
          title: roundTitles[currentRound] || `Round ${currentRound}`,
          formFields: currentRound === 1 ? formFields : [],
          selectedEmail,
          rejectionEmail
        }
      };
      
      for (let roundNum = 1; roundNum <= totalRounds; roundNum++) {
        const roundData = updatedAllRoundsData[roundNum];
        
        if (!roundData) {
          alert(`Please configure Round ${roundNum} before submitting`);
          return;
        }

        const payload = {
          jobId: jobId,
          roundNumber: roundNum,
          title: roundData.title || `Round ${roundNum}`,
          formFields: roundData.formFields.map((field: FormField) => ({
            label: field.label,
            fieldType: field.type,
            placeholder: field.placeholder || '',
            required: field.required || false,
            options: ['select', 'radio', 'checkbox'].includes(field.type) 
              ? (field.options || ['Option 1', 'Option 2']) 
              : undefined
          })),
          selectedEmail: parseEmail(roundData.selectedEmail),
          nonSelectedEmail: parseEmail(roundData.rejectionEmail)
        };

        await axiosInstance.post("/round/details", payload, {
          headers: { "Content-Type": "application/json" }
        });
      }

      alert("All rounds configured successfully!");
      router.push("/");
      
    } catch (error: any) {
      console.error("Error submitting rounds:", error);
      alert(`Error submitting rounds: ${error.response?.data?.message || error.message}`);
    }
  };

  const renderRoundContent = () => {
    if (currentRound === 1) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Fields Section */}
          <div className="bg-white p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Edit3 size={20} />
              Form Fields Configuration
            </h2>
            
            {!showPreview ? (
              <>
                <div className="space-y-4 mb-6">
                  {formFields.map((field, index) => (
                    <FormFieldEditor
                      key={field.id}
                      field={field}
                      index={index}
                      canDelete={index > 2}
                      onUpdate={updateField}
                      onRemove={removeField}
                      onAddOption={addOption}
                      onUpdateOption={updateOption}
                      onRemoveOption={removeOption}
                    />
                  ))}
                </div>

                {isAddingField ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
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

                      {['select', 'radio', 'checkbox'].includes(newField.type) && (
                        <div className="p-3 bg-gray-100 rounded border border-gray-300">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options (comma separated):
                          </label>
                          <input
                            type="text"
                            placeholder="Option 1, Option 2, Option 3"
                            onChange={(e) => setNewField({
                              ...newField, 
                              options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">Separate multiple options with commas</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button onClick={handleAddField} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600">
                          Add Field
                        </button>
                        <button onClick={() => setIsAddingField(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingField(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add New Field
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Form Preview</h3>
                  <p className="text-black text-sm">This is how candidates will see the form</p>
                </div>
                {formFields.map((field) => (
                  <FormFieldPreview key={field.id} field={field} />
                ))}
              </div>
            )}
          </div>

          {/* Email Templates Section */}
          <div className="space-y-6">
            <EmailTemplateEditor
              title="Selected Candidates Email"
              value={selectedEmail}
              onChange={setSelectedEmail}
              type="selected"
            />
            <EmailTemplateEditor
              title="Non-Selected Candidates Email"
              value={rejectionEmail}
              onChange={setRejectionEmail}
              type="rejected"
            />
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
              placeholder={`Enter title for Round ${currentRound}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
            />
          </div>

          <div className="space-y-6">
            <EmailTemplateEditor
              title="Selected Candidates Email"
              value={selectedEmail}
              onChange={setSelectedEmail}
              type="selected"
            />
            <EmailTemplateEditor
              title="Non-Selected Candidates Email"
              value={rejectionEmail}
              onChange={setRejectionEmail}
              type="rejected"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8f6f2] text-neutral-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 top-24 h-64 w-64 rounded-full bg-[#d9eadf] blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#f0e3ce] blur-3xl" />
      </div>

      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="relative z-10 pt-18">
        <RoundTabs
          totalRounds={totalRounds}
          currentRound={currentRound}
          allRoundsData={allRoundsData}
          onRoundChange={handleRoundChange}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[1.5rem] border border-[#e7dfd3] bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
          <div className="inline-flex items-center rounded-full border border-[#d8ccb7] bg-[#f8f1e3] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6548]">
            Round Builder
          </div>
          <h1 className="mt-4 text-3xl font-serif tracking-tight text-[#1d1b18] sm:text-4xl">
            Round {currentRound}{roundTitles[currentRound] ? ` - ${roundTitles[currentRound]}` : ''}
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
            {currentRound === 1
              ? `Configure candidate application form fields and email for Round ${currentRound} of ${totalRounds}`
              : `Configure email templates for Round ${currentRound} of ${totalRounds}`}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[#e8e0d4] bg-white p-4 shadow-[0_28px_60px_-44px_rgba(0,0,0,0.5)] sm:p-6">
          {renderRoundContent()}
        </div>

        <div className="mb-6 mt-6 rounded-2xl border border-[#e8e0d4] bg-[#fcfaf7] px-4 py-4 sm:px-6">
          <div className="flex flex-wrap justify-end gap-3">
            {currentRound === 1 && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1f2321] px-4 py-2 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b312e]"
              >
                <Eye size={20} />
                {showPreview ? 'Edit Mode' : 'Preview'}
              </button>
            )}

            {currentRound > 1 && (
              <button
                onClick={() => handleRoundChange(currentRound - 1)}
                className="rounded-xl border border-[#d9d1c4] bg-white px-4 py-2 text-neutral-800 transition-colors hover:border-[#c4b59d] hover:bg-[#f4efe7]"
              >
                Previous Round
              </button>
            )}
            
            {currentRound < totalRounds && (
              <button
                onClick={() => handleRoundChange(currentRound + 1)}
                className="rounded-xl bg-[#1f2321] px-4 py-2 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b312e]"
              >
                Save & Next
              </button>
            )}

            {currentRound === totalRounds && (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1f2321] px-4 py-2 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b312e]"
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