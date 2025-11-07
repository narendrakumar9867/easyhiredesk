"use client";

import React from 'react';
import { FormResponse } from '@/src/types/form';

interface CandidateCardProps {
  candidate: FormResponse;
  index: number;
  isOpen: boolean;
  isUpdating: boolean;
  currentRound: number;
  onToggle: () => void;
  onUpdateStatus: (responseId: string, status: 'selected' | 'rejected', round: number) => void;
  onViewFile: (responseId: string, fieldLabel: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  index,
  isOpen,
  isUpdating,
  currentRound,
  onToggle,
  onUpdateStatus,
  onViewFile
}) => {
  const getRoundStatus = (candidate: FormResponse, round: number): string => {
    if (round === 1) return candidate.status;
    const roundStatus = candidate.roundStatuses?.find(rs => rs.round === round);
    return roundStatus?.status || "pending";
  };

  const status = getRoundStatus(candidate, currentRound);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 cursor-pointer" onClick={onToggle}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {index + 1}. {candidate.candidateName}
          </h3>
          <p className="text-sm text-gray-500">
            Applied: {new Date(candidate.submittedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        {/* Status badge */}
        <div className="mb-2">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            status === 'selected'
              ? 'bg-green-100 text-green-800'
              : status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => onUpdateStatus(candidate._id, "selected", currentRound)}
          disabled={isUpdating}
          className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            status === 'selected'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-700'
          }`}
        >
          {isUpdating ? 'Updating...' : 'Select'}
        </button>
        <button
          onClick={() => onUpdateStatus(candidate._id, "rejected", currentRound)}
          disabled={isUpdating}
          className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            status === 'rejected' 
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-700'
          }`}
        >
          {isUpdating ? 'Updating...' : 'Reject'}
        </button>
      </div>

      {/* Candidate responses */}
      {isOpen && (
        <>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 border-b pb-2">Application Details:</h4>
            <div className="grid gap-3">
              {candidate.responses.map((response, responseIndex) => (
                <div key={responseIndex} className="border-l-4 border-gray-200 pl-4 py-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {response.fieldLabel}:
                  </p>
                  
                  {/* Handle file responses differently */}
                  {response.fieldType === 'file' ? (
                    <div className="flex items-center space-x-2">
                      {response.value && response.value.fileName ? (
                        <>
                          <span className="text-gray-900">{response.value.fileName}</span>
                          <button
                            onClick={() => onViewFile(candidate._id, response.fieldLabel)}
                            className="bg-black text-white px-3 py-1 rounded-md text-sm hover:text-white hover:bg-gray-500 transition-colors"
                          >
                            View File
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500 italic">No file uploaded</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900">
                      {Array.isArray(response.value) 
                        ? response.value.length > 0 
                          ? response.value.join(', ')
                          : 'No options selected'
                        : response.value || 'No answer provided'
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {candidate.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-gray-900">{candidate.notes}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CandidateCard;