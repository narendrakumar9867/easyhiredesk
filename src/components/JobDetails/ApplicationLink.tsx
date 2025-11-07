"use client";

import React from 'react';
import { Link2, Copy, FileText } from 'lucide-react';

interface ApplicationLinkProps {
  jobId: string;
}

const ApplicationLink: React.FC<ApplicationLinkProps> = ({ jobId }) => {
  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/apply/${jobId}`;
    navigator.clipboard.writeText(shareLink);
    alert('Application link copied to clipboard!');
  };

  return (
    <>
      <div className='mt-8 bg-white rounded-xl p-10 border-2 border-gray-200 text-center items-center'>
        <p className='text-black'>
          Take your hiring beyond boundaries.
          <br />
          With this application link, candidates can apply from anywhere anytime.
          Share it across platforms like LinkedIn, email, or social media.
          <br />
          Every application is tracked automatically in your EasyHireDesk workspace.
        </p>
      </div>

      <div className="mt-6 bg-white p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mr-3">
            <Link2 className='w-6 h-6 text-black'/>
          </div>
          <div className="text-left">
            <h4 className="text-xl font-bold text-gray-800">Application Link</h4>
            <p className="text-sm text-gray-600">Share this link to receive applications</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4 px-40">
          <p className="text-gray-600 text-sm mb-3 text-center">
            Candidates can apply for this position using the link below
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/apply/${jobId}`}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 focus:outline-none focus:border-black transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FileText className='w-4 h-4'/>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-black transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <Copy className='w-4 h-4'/>
              Copy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationLink;