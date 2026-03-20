"use client";

import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Job } from '@/src/types/Job';
import { axiosInstance } from '@/src/utils/axios';

interface CompanyInfoProps {
  job: Job;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ job }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    companyName: job.companyName,
    jobTitle: job.jobTitle,
    location: job.location,
    companyWebsite: job.companyWebsite || ''
  });

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/jobs/${job._id}/company-info`, editedData);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating company info:", error);
      alert("Failed to update company information.")
    }
  }
  return (
    <div className="mb-6">
      <div className='flex items-center mb-6 justify-between'>
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-xl p-3 mr-4 border-2 border-gray-300">
            <Building2 className='w-6 h-6 text-black'/>
          </div>
          <h3 className="text-black text-xl">Company Information</h3>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className='px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 text-sm cursor-pointer'
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-600">Company Name</p>
          {isEditing ? (
            <input
              type='text'
              value={editedData.companyName}
              onChange={(e) => setEditedData({...editedData, companyName: e.target.value})}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
            />
          ) : (
            <p className="text-black font-semibold">{job.companyName}</p>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600">Job Title</p>
          {isEditing ? (
            <input
              type='text'
              value={editedData.jobTitle}
              onChange={(e) => setEditedData({...editedData, jobTitle: e.target.value})}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
            />
          ) : (
            <p className="text-black font-semibold">{job.jobTitle}</p>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600">Location</p>
          {isEditing ? (
            <input
              type='text'
              value={editedData.location}
              onChange={(e) => setEditedData({...editedData, location: e.target.value})}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
            />
          ) : (
            <p className="text-black">{job.location}</p>
          )}
        </div>

        <div>
          <p className='text-sm font-medium text-gray-600'>Website</p>
          {isEditing ? (
            <input
              type='url'
              value={editedData.companyWebsite}
              onChange={(e) => setEditedData({...editedData, companyWebsite: e.target.value})}
              placeholder='https://example.com'
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          ) : (
            job.companyWebsite && (
              <a
                href={job.companyWebsite}
                target='blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                {job.companyWebsite}
              </a>
            )
          )}
        </div>
        
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

      {isEditing && (
        <div className='flex justify-end mt-4'>
          <button
            onClick={handleSave}
            className='px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-600 cursor-pointer'
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyInfo;