"use client";

import React from 'react';
import Link from 'next/link';
import { FileDown, Info, LifeBuoy } from 'lucide-react';

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
    if (jobId) {
      const params = new URLSearchParams({
        jobId,
        roundNumber: String(currentRound),
      });

      window.open(`/edit-round?${params.toString()}`, '_blank');
    } else {
      alert('Job ID not found');
    }
  };
  return (
    <div className='mt-10'>
      <div className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Quick actions</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-600">
            Use these tools to export candidate data, update round details, or get support when needed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Export Applications */}
          <div className="group rounded-[1.25rem] border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-col items-start text-left">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 transition-all duration-300 group-hover:bg-gray-900">
                <FileDown className='h-6 w-6 text-gray-900 group-hover:text-white'/>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Applications</h4>
              <p className="mb-6 text-sm leading-6 text-gray-600">
                Download candidate data for the current round in spreadsheet format.
              </p>
              
              <button 
                className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 cursor-pointer"
                onClick={() => onExport(currentRound)}
              >
                Export data
              </button>
            </div>
          </div>

          {/* Rounds Details */}
          <div className="group rounded-[1.25rem] border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-col items-start text-left">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 transition-all duration-300 group-hover:bg-gray-900">
                <Info className='h-6 w-6 text-gray-900 group-hover:text-white'/>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Round details</h4>
              <p className="mb-6 text-sm leading-6 text-gray-600">
                Open the round editor and update titles or communication content.
              </p>
              
              <button
                className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 cursor-pointer"
                onClick={handleEdit}
              >
                Edit round
              </button>
            </div>
          </div>

          {/* Get Support */}
          <div className="group rounded-[1.25rem] border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex flex-col items-start text-left">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 transition-all duration-300 group-hover:bg-gray-900">
                <LifeBuoy className='h-6 w-6 text-gray-900 group-hover:text-white'/>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="mb-6 text-sm leading-6 text-gray-600">
                Contact the support team if you need help with job or round management.
              </p>
              
              <Link href="/contact">
                <button className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 cursor-pointer">
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