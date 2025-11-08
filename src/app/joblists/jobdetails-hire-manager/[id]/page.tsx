"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/src/hooks/useAuth";
import { useJobDetails } from "@/src/hooks/useJobDetails";
import { useCandidates } from "@/src/hooks/useCandidates";
import { useJobStatus } from "@/src/hooks/useJobStatus";
import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';
import {
  JobHeader,
  CompanyInfo,
  JobDescription,
  ApplicationLink,
  CandidateCard,
  CandidateFilter,
  RoundTabs,
  QuickActions
} from '@/src/components/JobDetails';
import { FileText, Loader2, Lock, LockIcon, LockOpen, Trash2 } from 'lucide-react';

const JobDetailsHireManager: React.FC = () => {
  const params = useParams();
  const { token, authUser } = useAuth();
  const jobId = params?.id as string;

  // Job Details Hook
  const {
    job,
    jobRounds,
    roundTitles,
    candidateResponses,
    loading,
    error
  } = useJobDetails(jobId, token);

  // Candidates Hook with setState
  const [candidateResponsesState, setCandidateResponsesState] = useState(candidateResponses);
  
  React.useEffect(() => {
    setCandidateResponsesState(candidateResponses);
  }, [candidateResponses]);

  const {
    updating,
    openCandidateId,
    setOpenCandidateId,
    updateCandidateStatus,
    viewUploadedFile,
    exportToExcel,
    getRoundStatus,
    getCandidatesForRound,
    getStatusCounts
  } = useCandidates({
    token,
    authUserEmail: authUser?.email,
    candidateResponses: candidateResponsesState,
    setCandidateResponses: setCandidateResponsesState
  });

  // Job Status Hook with setJob
  const [jobState, setJobState] = useState(job);
  
  React.useEffect(() => {
    setJobState(job);
  }, [job]);

  const {
    jobCloseDate,
    jobCloseTime,
    isJobClosed,
    isDeleting,
    setJobCloseDate,
    setJobCloseTime,
    handleCloseJob,
    handleImmediateClose,
    handleReopenJob,
    handleDeleteJob
  } = useJobStatus({
    job: jobState,
    jobId,
    token,
    setJob: setJobState
  });

  const [activeTab, setActiveTab] = useState<string>('Job details');
  const [candidateFilter, setCandidateFilter] = useState<"all" | "selected" | "pending" | "rejected">("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRound, setEditingRound] = useState<number | null>(null);

  const generateTabs = (): string[] => {
    const tabs = ['Job details'];
    try {
      if (jobRounds?.selectedRounds && Array.isArray(jobRounds.selectedRounds) && jobRounds.selectedRounds.length > 0) {
        jobRounds.selectedRounds.forEach((round, index) => {
          tabs.push(`Round ${index + 1}`);
        });
      }
    } catch (error) {
      console.error("Error generating tabs:", error);
    }
    return tabs;
  };

  const tabs = generateTabs();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Job details':
        return (
          <div className="bg-white rounded-lg p-6 mb-6">
            <CompanyInfo job={jobState!} />
            <JobDescription aboutJob={jobState?.aboutJob || ""} />
            <ApplicationLink jobId={jobId} />

            {/* Job Status Info Section */}
            <div className='mt-8 bg-white rounded-xl p-10 border-2 border-gray-200 text-center items-center'>
              <p className='text-black'>
                Manage your jobs active lifecycle with full control.
                <br />
                Schedule an automatic close for smoother hiring workflows, or end it instantly when the position is filled.
                <br />
                Keep your listings updated and avoid confusion for candidates.
                Smart scheduling helps maintain an organized and transparent recruitment process.
              </p>
            </div>

            {/* Job Status Management */}
            <div className="mt-6 p-4 bg-white rounded-lg px-40">
              <h4 className="text-lg font-semibold text-black mb-2 text-center">Job Status</h4>

              {isJobClosed ? (
                <div className="bg-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white border rounded-full p-3 mr-3">
                      <Lock className='w-4 h-4' />
                    </div>
                    <div>
                      <p className="text-black font-semibold">This job is closed</p>
                    </div>
                  </div>

                  <div className="bg-white border border-black rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center text-gray-700">
                      <LockIcon className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-sm">
                        {jobState?.closeDate ?
                          `Closed on: ${new Date(jobState.closeDate).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}` :
                          'This job has been manually closed'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="text-gray-600 text-sm mb-4 text-center max-w-md">
                      This job is currently not accepting applications. Click below to reopen and start receiving applications again.
                    </p>
                    <button
                      onClick={handleReopenJob}
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md hover:shadow-lg flex items-center"
                    >
                      <LockOpen className="w-5 h-5 mr-2" />
                      Reopen Job
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-xl p-4">
                  <p className='text-black mb-3 text-center'>
                    Schedule when this job should automatically close or close it immediately.
                  </p>

                  {/* Schedule Close Section */}
                  <div className="mb-4 p-3 bg-white rounded-lg items-center">
                    <h5 className="font-medium text-gray-800 mb-2">Schedule Automatic Close</h5>
                    <div className='flex items-center space-x-2 mb-3'>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Close Date:</label>
                        <input
                          type="date"
                          value={jobCloseDate}
                          onChange={(e) => setJobCloseDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Close Time:</label>
                        <input
                          type="time"
                          value={jobCloseTime}
                          onChange={(e) => setJobCloseTime(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={handleCloseJob}
                          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Schedule Close
                        </button>
                      </div>
                    </div>
                    {jobState?.closeDate && !isJobClosed && (
                      <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded border-l-4 border-orange-400">
                        Scheduled to close: {new Date(jobState.closeDate).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Immediate Close Section */}
                  <div className="p-3 bg-gray-200 rounded-lg">
                    <h5 className="font-medium text-black mb-2">Close Immediately</h5>
                    <div className='flex items-center justify-between'>
                      <p className="text-black text-sm">
                        Close this job right now. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleImmediateClose}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Close Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Job Warning */}
            <div className='mt-8 bg-white rounded-xl p-10 border-2 border-gray-200 text-center items-center'>
              <p className='text-black'>
                This action is irreversible, please proceed with caution.
                <br />
                Deleting this job will remove all associated applications, interview rounds, and uploaded files permanently.
                <br />
                Once deleted, this data cannot be recovered.
                Make sure you have backed up any important information before confirming deletion.
              </p>
            </div>

            {/* Delete Job Section */}
            <div className="mt-8 p-4 bg-white px-40">
              <div className="flex-1 text-center mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-black mb-1">Danger Zone</h4>
                  <p className="text-black text-sm font-medium">
                    Once you delete this job, there is no going back. Please be certain.
                  </p>
                </div>
              </div>

              <div className="bg-gray-200 border border-white rounded p-3 mb-3">
                <p className="text-black text-sm mb-2">This action will permanently delete:</p>
                <ul className="text-sm text-black space-y-1 ml-4">
                  <li className="flex items-center">
                    <span className="text-black mr-2">•</span>
                    Job posting: <span className="font-semibold ml-1">{jobState?.jobTitle}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-black mr-2">•</span>
                    {candidateResponsesState.length} candidate application(s)
                  </li>
                  <li className="flex items-center">
                    <span className="text-black mr-2">•</span>
                    {tabs.length - 1} interview round(s) and all round data
                  </li>
                  <li className="flex items-center">
                    <span className="text-black mr-2">•</span>
                    All uploaded files and documents
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleDeleteJob(candidateResponsesState.length, tabs.length - 1)}
                disabled={isDeleting}
                className="w-full bg-black text-white px-4 py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Deleting Job...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Job Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        // Handle round tabs
        if (activeTab.startsWith('Round ')) {
          const roundNumber = parseInt(activeTab.split(' ')[1]);
          const candidatesForRound = getCandidatesForRound(roundNumber, candidateFilter);
          const statusCounts = getStatusCounts(roundNumber, candidatesForRound);

          return (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 mb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {roundNumber === 1
                        ? `Round 1 - ${roundTitles[1]}`
                        : `Round ${roundNumber} - ${roundTitles[roundNumber]}`
                      }
                    </h3>
                    <p className="text-gray-600 max-w-4xl">
                      {roundNumber === 1
                        ? 'Review and select candidates who submitted their applications. Once a candidate is marked as Selected or Rejected, they cannot be moved back to Pending status for that round.'
                        : `Candidates who were selected from Round ${roundNumber - 1}.`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">
                      {candidatesForRound.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      {roundNumber === 1 ? 'Total Applications' : `Qualified Candidates`}
                    </div>
                  </div>
                </div>

                {/* Status summary */}
                {candidatesForRound.length > 0 && (
                  <div className="mt-4 flex space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Selected: {statusCounts.selected}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Rejected: {statusCounts.rejected}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Pending: {statusCounts.pending}</span>
                    </div>
                  </div>
                )}
              </div>

              {candidatesForRound.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  {roundNumber === 1 ? (
                    <>
                      <div className="text-gray-400 mb-4">
                        <FileText className="mx-auto h-12 w-12" />
                      </div>
                      <p className="text-gray-600 mb-2">No applications received yet.</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Share the application link to start receiving applications.
                      </p>
                      <button
                        onClick={() => {
                          const shareLink = `${window.location.origin}/apply/${jobId}`;
                          navigator.clipboard.writeText(shareLink);
                          alert('Application link copied to clipboard!');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Copy Application Link
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4">No candidates selected for this round yet.</p>
                      <p className="text-sm text-gray-500">
                        Please select candidates from Round {roundNumber - 1} first.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {candidatesForRound
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .map((candidate, index) => (
                      <CandidateCard
                        key={candidate._id}
                        candidate={candidate}
                        index={index}
                        isOpen={openCandidateId === candidate._id}
                        isUpdating={updating === candidate._id}
                        currentRound={roundNumber}
                        onToggle={() => setOpenCandidateId(openCandidateId === candidate._id ? null : candidate._id)}
                        onUpdateStatus={updateCandidateStatus}
                        onViewFile={viewUploadedFile}
                      />
                    ))}
                </div>
              )}
            </div>
          );
        }
        return null;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading job details...</div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !jobState) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || "Job not found"}</div>
          <Link href="/joblists" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
            Back to Job Lists
          </Link>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-full">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <JobHeader jobTitle={jobState.jobTitle} />

      <div className="mx-auto w-full max-w px-9 py-3 flex-1 flex gap-6">
        <div className="flex-1">
          {/* Navigation Tabs */}
          {!loading && (
            <RoundTabs
              tabs={tabs}
              activeTab={activeTab}
              roundTitles={roundTitles}
              onTabChange={setActiveTab}
            />
          )}

          {/* Content Area */}
          {activeTab.startsWith('Round ') ? (
            <>
              <div className="flex gap-6">
                {/* Filter Sidebar */}
                <CandidateFilter
                  candidateFilter={candidateFilter}
                  onFilterChange={setCandidateFilter}
                />

                {/* Tab Content */}
                <div className="flex-1 max-h-[calc(200vh-300px)] overflow-y-auto">
                  {renderTabContent()}
                </div>
              </div>

              {/* Quick Actions */}
              <QuickActions
                currentRound={parseInt(activeTab.split(" ")[1])}
                jobId={jobId}
                onExport={(round) => exportToExcel(round, jobState, roundTitles, candidateFilter)}
                onEditRound={(round) => {
                  setEditingRound(round);
                  setShowEditModal(true);
                }}
              />
            </>
          ) : (
            <div className="min-h-[400px]">
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>
      <FooterLogin />
    </div>
  );
};

export default JobDetailsHireManager;