"use client";

import React from 'react';
import { Building2 } from 'lucide-react';
import { Job } from '@/src/types/Job';

interface CompanyInfoProps {
  job: Job;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ job }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-6">
        <div className="bg-gray-100 rounded-xl p-3 mr-4 border-2 border-gray-300">
          <Building2 className='w-6 h-6 text-black'/>
        </div>
        <h3 className="text-black text-xl">Company Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-600">Company Name</p>
          <p className="text-black font-semibold">{job.companyName}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600">Location</p>
          <p className="text-black">{job.location}</p>
        </div>
        
        {job.companyWebsite && (
          <div>
            <p className="text-sm font-medium text-gray-600">Website</p>
            <a 
              href={job.companyWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {job.companyWebsite}
            </a>
          </div>
        )}
        
        {job.socialLinks && job.socialLinks.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-600">Social Links</p>
            <div className="flex space-x-2">
              {job.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline capitalize"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;