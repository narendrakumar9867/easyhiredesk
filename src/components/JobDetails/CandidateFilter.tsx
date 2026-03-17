"use client";

import React from 'react';

interface CandidateFilterProps {
  candidateFilter: "all" | "selected" | "pending" | "rejected";
  onFilterChange: (filter: "all" | "selected" | "pending" | "rejected") => void;
}

const CandidateFilter: React.FC<CandidateFilterProps> = ({ 
  candidateFilter, 
  onFilterChange 
}) => {
  const options: CandidateFilterProps["candidateFilter"][] = ["all", "selected", "pending", "rejected"];

  return (
    <div className="w-full rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4 lg:sticky lg:top-28 lg:w-72 lg:self-start">
      <h2 className="mb-2 text-lg font-semibold text-black">
        Filter Candidates
      </h2>
      <p className="mb-4 text-sm leading-6 text-neutral-600">
        Narrow the candidate list by current round decision status.
      </p>
      <div className="flex flex-wrap gap-2 lg:flex-col">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onFilterChange(option)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer lg:w-full lg:rounded-xl lg:text-left ${
              candidateFilter === option
                ? "bg-black text-white"
                : "border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900 hover:text-black"
            }`}
          >
            {option === "all" ? "All candidates" : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CandidateFilter;