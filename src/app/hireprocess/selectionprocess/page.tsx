"use client";
import React from 'react';
import { useState } from 'react';
import { Users, Clock, Star } from 'lucide-react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';

export default function HirePage() {
  const [selectedRounds, setSelectedRounds] = useState(2);
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const router = useRouter();

  const handleNextStep = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!jobId) {
    alert("Job ID not found!");
    return;
  }

  try {
    const roundsArray = Array.from({ length: selectedRounds }, (_, i) => `Round ${i + 1}`);
    console.log("roundsArray:", roundsArray);

    const res = await axios.post(
      "http://localhost:5000/api/rounds",
      { 
        jobId: jobId, 
        selectedRounds: roundsArray, 
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    router.push(`/hireprocess/selectionprocess/rounds?jobId=${jobId}&rounds=${selectedRounds}`);
    console.log("Rounds: ", res.data);
    alert("Rounds are selected.");
  } catch (error) {
    console.error(error);
    alert("Error choosing rounds.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white">

        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
          < Navbar />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 justify-center pt-28">
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
                className="px-4 py-2 w-fit rounded-xl border-1 bg-black text-white transition-all hover:bg-transparent hover:text-black"
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