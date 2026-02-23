"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Edit2, FileTextIcon, Save, X } from 'lucide-react';
import renderMarkdown from '@/src/components/MarkdownRenderer';

interface JobDescriptionProps {
  aboutJob: string;
  jobId: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ aboutJob, jobId }) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(aboutJob);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editedDescription.trim()) {
      alert('Job description cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/description`,
        { aboutJob: editedDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      window.location.reload(); 
    } catch (error: any) {
      console.error('Error updating job description:', error);
      alert(`Failed to update: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedDescription(aboutJob);
    setIsEditing(false);
  };

  return (
    <div className="mt-8">
      <div className='flex items-center justify-between mb-6'>
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-xl p-3 mr-4 border-2 border-gray-300">
            <FileTextIcon className='w-6 h-6 text-black'/>
          </div>
          <h3 className="text-black text-xl">Job Description</h3>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 cursor-pointer text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      
      <div className="max-w-none bg-white rounded-xl p-8 border-2 border-gray-200">
        {isEditing ? (
          <div>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full min-h-[400px] px-4 py-3 border-gray-300 rounded-lg focus:outline-none font-mono text-sm"
              placeholder="Enter job description (Markdown supported)..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Supports Markdown formatting (bold, italic, lists, headings, etc.)
            </p>
          </div>
        ) : (
          renderMarkdown(aboutJob || "")
        )}
      </div>
    </div>
  );
};

export default JobDescription;