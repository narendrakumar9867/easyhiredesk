"use client";
import React from 'react';
import { useState } from 'react';
import { Users, Clock, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';
import { axiosInstance } from '@/src/utils/axios';

export default function HirePage() {
  const [selectedRounds, setSelectedRounds] = useState(2);
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const router = useRouter();
  const estimatedTimeline = `${selectedRounds * 5}-${selectedRounds * 7} days`;

  const handleNextStep = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!jobId) {
    alert("Job ID not found!");
    return;
  }

  try {
    const roundsArray = Array.from({ length: selectedRounds }, (_, i) => `Round ${i + 1}`);
    console.log("roundsArray:", roundsArray);

    const res = await axiosInstance.post(
      "/rounds",
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8f6f2] text-neutral-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-14 top-24 h-64 w-64 rounded-full bg-[#d9eadf] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#f0e3ce] blur-3xl" />
        </div>

        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
          < Navbar />
        </div>
        
        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-18 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-[1.75rem] border border-[#e7dfd3] bg-white/90 p-7 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur sm:p-9">
            <span className="inline-flex items-center rounded-full border border-[#d8ccb7] bg-[#f8f1e3] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6548]">
              Step 2 of Hiring
            </span>
            <h2 className="mt-4 text-4xl font-serif tracking-tight text-[#1d1b18] sm:text-5xl">Choose Your Hiring Process</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              Select the number of interview rounds that best fits your team workflow and role complexity.
            </p>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[#e8e0d4] bg-white shadow-[0_28px_60px_-44px_rgba(0,0,0,0.5)]">
            <div className="border-b border-[#eee6da] p-8 sm:p-10">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <Users className="mr-3 h-7 w-7 text-[#8b6c3f]" />
                  <span className="text-xl font-semibold text-[#2a241c]">Number of rounds</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#e5dac9] bg-[#f8f2e7] px-4 py-2 text-sm font-medium text-[#6e5b3f]">
                  <Clock className="h-4 w-4" />
                  Estimated timeline: {estimatedTimeline}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[2, 3, 4, 5, 6, 7].map((rounds) => (
                  <button
                    key={rounds}
                    onClick={() => setSelectedRounds(rounds)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                      selectedRounds === rounds
                        ? 'border-[#8b6c3f] bg-[#f8f1e6] shadow-[0_12px_30px_-20px_rgba(0,0,0,0.5)]'
                        : 'border-[#e6ded1] bg-[#fffdfa] hover:-translate-y-0.5 hover:border-[#d2c4ad]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-[#2a241c]">{rounds} rounds</span>
                      {selectedRounds === rounds && <Star className="h-4 w-4 fill-[#8b6c3f] text-[#8b6c3f]" />}
                    </div>
                    <p className="mt-2 text-sm text-neutral-600">
                      Good for {rounds <= 3 ? 'fast-moving roles' : rounds <= 5 ? 'balanced screening' : 'high-stakes hiring'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-[#eee6da] bg-[#fcfaf7] px-8 py-6 sm:flex-row sm:px-10">
              <div className="inline-flex items-center rounded-full border border-[#e5dac9] bg-white px-4 py-2 text-sm font-medium text-[#2a241c]">
                <Clock className="mr-2 h-4 w-4 text-[#8b6c3f]" />
                Selected: {selectedRounds} round{selectedRounds > 1 ? 's' : ''}
              </div>
              <button 
                onClick={handleNextStep}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1f2321] px-7 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b312e] sm:w-auto"
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