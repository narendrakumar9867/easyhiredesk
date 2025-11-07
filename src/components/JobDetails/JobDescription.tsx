"use client";

import React from 'react';
import { FileTextIcon } from 'lucide-react';
import renderMarkdown from '@/src/components/MarkdownRenderer';

interface JobDescriptionProps {
  aboutJob: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ aboutJob }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center mb-6">
        <div className="bg-gray-100 rounded-xl p-3 mr-4 border-2 border-gray-300">
          <FileTextIcon className='w-6 h-6 text-black'/>
        </div>
        <h3 className="text-black text-xl">Job Description</h3>
      </div>
      
      <div className="max-w-none bg-white rounded-xl p-8 border-2 border-gray-200">
        {renderMarkdown(aboutJob || "")}
      </div>
    </div>
  );
};

export default JobDescription;