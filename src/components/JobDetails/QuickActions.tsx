"use client";

import React from 'react';
import Link from 'next/link';
import { FileDown, Info, Radiation } from 'lucide-react';

interface QuickActionsProps {
  currentRound: number;
  jobId: string;
  onExport: (roundNumber: number) => void;
  onEditRound: (roundNumber: number) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  currentRound,
  jobId, 
  onExport, 
  onEditRound 
}) => {
  const handleEdit = () => {
    // Open edit page in new tab with proper parameters
    if (jobId) {
      const token = localStorage.getItem('token');
      window.open(
        `/edit-round?jobId=${jobId}&roundNumber=${currentRound}&token=${token}`,
        '_blank'
      );
    } else {
      alert('Job ID not found');
    }
  };
  return (
    <div className='flex-1 mt-12'>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Quick Actions</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Essential tools to manage your recruitment process efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {/* Export Applications */}
          <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-900 transition-all duration-300 p-8 hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gray-900 transition-all duration-300">
                <FileDown className='w-8 h-8 text-gray-900 group-hover:text-white'/>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Applications</h4>
              <p className="text-sm text-gray-600 mb-6">
                Download candidate data in CSV format
              </p>
              
              <button 
                className="bg-black text-white px-8 py-2.5 rounded-lg hover:bg-white hover:text-black border transition-all duration-200 font-medium text-sm"
                onClick={() => onExport(currentRound)}
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Rounds Details */}
          <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-900 transition-all duration-300 p-8 hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gray-900 transition-all duration-300">
                <Info className='w-8 h-8 text-gray-900 group-hover:text-white'/>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Rounds details</h4>
              <p className="text-sm text-gray-600 mb-6">
                Make changes this rounds details
              </p>
              
              <button
                className="bg-black text-white px-8 py-2.5 rounded-lg hover:bg-white hover:text-black border transition-all duration-200 font-medium text-sm"
                onClick={handleEdit} // Changed from onEditRound to handleEdit
              >
                Edit
              </button>
            </div>
          </div>

          {/* Get Support */}
          <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-900 transition-all duration-300 p-8 hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gray-900 transition-all duration-300">
                <Radiation className='w-8 h-8 text-gray-900 group-hover:text-white'/>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-6">
                Contact our support team for assistance
              </p>
              
              <Link href="/contact">
                <button className="bg-black text-white px-8 py-2.5 rounded-lg hover:bg-white hover:text-black border transition-all duration-200 font-medium text-sm">
                  Get Support
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;