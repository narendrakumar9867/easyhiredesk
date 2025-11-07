"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

interface JobHeaderProps {
  jobTitle: string;
}

const JobHeader: React.FC<JobHeaderProps> = ({ jobTitle }) => {
  return (
    <div className="relative left-0 mx-auto w-full mb-8">
      <div className="w-full h-70 relative overflow-hidden">
        <Image 
          src="/images/hire-process-bg.jpg" 
          alt="Background" 
          width={1920}
          height={400}
          priority
          className="w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute top-6 left-9 z-10 pt-20">
          <Link href="/joblists">
            <button className="flex items-center gap-2 underline text-black px-4 py-2 font-medium">
              <ChevronLeft className='w-5 h-5'/>
              Back to Jobs
            </button>
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 px-9">
        <div className="bg-black/90 backdrop-blur-sm rounded-xl shadow-xl p-4 border-2 border-gray-700 mx-auto max-w-4xl">
          <h1 className="text-white text-xl md:text-3xl font-light text-center tracking-wider">
            {jobTitle}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;