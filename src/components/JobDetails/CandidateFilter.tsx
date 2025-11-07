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
  return (
    <div className="w-64 flex-shrink-0 bg-gray-100 rounded-lg shadow-md p-4 sticky top-4 self-start">
      <h2 className="text-lg font-semibold mb-4 text-black text-center border-b rounded-lg">
        Filter Candidates
      </h2>
      <div className="space-y-2">
        <button
          onClick={() => onFilterChange("all")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
            candidateFilter === "all"
              ? "bg-white text-gray-800 border-l-4 border-blue-600"
              : "text-black hover:bg-gray-200"
          }`}
        >
          All Candidates
        </button>
        <button
          onClick={() => onFilterChange("selected")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
            candidateFilter === "selected"
              ? "bg-white text-gray-800 border-l-4 border-blue-600"
              : "text-black hover:bg-gray-200"
          }`}
        >
          Selected
        </button>
        <button
          onClick={() => onFilterChange("pending")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
            candidateFilter === "pending"
              ? "bg-white text-gray-800 border-l-4 border-blue-600"
              : "text-black hover:bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => onFilterChange("rejected")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
            candidateFilter === "rejected"
              ? "bg-white text-gray-800 border-l-4 border-blue-600"
              : "text-black hover:bg-gray-200"
          }`}
        >
          Rejected
        </button>
      </div>
    </div>
  );
};

export default CandidateFilter;