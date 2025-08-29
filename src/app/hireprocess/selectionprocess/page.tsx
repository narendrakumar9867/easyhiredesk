"use client";
import React from 'react';
import { useState } from 'react';
import { Users, Clock, Star } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';

export default function HirePage() {
  const [selectedRounds, setSelectedRounds] = useState(2);
  const router = useRouter();

  const handleNextStep = () => {
    // Navigate to job details with rounds parameter
    router.push(`/hireprocess/selectionprocess/rounds?rounds=${selectedRounds}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white">

        < Navbar />
        
        {/* <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r bg-white"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-12">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
                  <Star className="w-4 h-4 mr-2" />
                  Professional Hiring Solutions
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Find Your Perfect
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Candidate</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                  Streamlined hiring process with customizable interview rounds. From quick screenings to comprehensive assessments.
                </p>
            
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">500+</div>
                    <div className="text-gray-600">Successful Hires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">95%</div>
                    <div className="text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">24hr</div>
                    <div className="text-gray-600">Avg Response</div>
                  </div>
                </div>
              </div>
            </div>
        </div> */}
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 justify-center">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Hiring Process</h2>
            <p className="text-gray-600 text-lg">Select the number of interview rounds that best fits your needs</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
            <div className="flex items-center justify-center mb-8">
              <Users className="w-8 h-8 text-black mr-3" />
              <span className="text-xl font-semibold text-gray-800">Number of Rounds:</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[2, 3, 4, 5, 6, 7].map((rounds) => (
                <button
                  key={rounds}
                  onClick={() => setSelectedRounds(rounds)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedRounds === rounds
                      ? 'bg-black text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rounds} Round{rounds > 1 ? 's' : ''}
                </button>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-black">
                <Clock className="w-4 h-4 mr-2" />
                Selected: {selectedRounds} Round{selectedRounds > 1 ? 's' : ''}
              </div>
            </div>

            <div className="text-center py-6">
              <button 
                onClick={handleNextStep}
                className="px-4 py-2 w-fit rounded-xl border-1 bg-black text-white transition-all hover:bg-gray-200 hover:bg-transparent hover:text-black"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>

      < FooterLogin />

    </div>
  );
}