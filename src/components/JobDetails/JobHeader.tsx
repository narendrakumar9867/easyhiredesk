"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface JobHeaderProps {
  jobTitle: string;
}

const JobHeader: React.FC<JobHeaderProps> = ({ jobTitle }) => {
  return (
    <div className="mx-auto w-full border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-8 pt-18 sm:px-6 lg:px-8">
        <div>
          <Link 
            href="/joblists"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-black"
          >
            <ChevronLeft className='w-5 h-5'/>
            Back to Jobs
          </Link>
        </div>

        <div className="rounded-[2rem] border border-neutral-200 bg-black p-6 shadow-sm sm:p-8">
          <h1 className="mt-3 text-3xl font-serif tracking-tight text-white sm:text-4xl md:text-5xl">
            {jobTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
            Review job information, manage rounds, and make candidate decisions from one workspace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;