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
import { FileText, Loader2, Lock, LockIcon, LockOpen, ShieldCheck, Trash2 } from 'lucide-react';

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
          <div className="space-y-10">
            <section className="rounded-2xl bg-white px-5 sm:px-7">
              <CompanyInfo job={jobState!} />
            </section>

            <section className="rounded-2xl bg-white px-5 sm:px-7">
              <JobDescription 
                aboutJob={jobState?.aboutJob || ""}
                jobId={jobId}
              />
            </section>

            <section className="rounded-2xl bg-white px-5 sm:px-7">
              <ApplicationLink jobId={jobId} />
            </section>

            <section className="border-l-2 border-neutral-300 pl-4 sm:pl-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-2xl border border-neutral-200 bg-white p-3">
                  <ShieldCheck className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-black">Job status management</h4>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                    Control whether the role is accepting applications, schedule an automatic close, or reopen it when hiring resumes.
                  </p>
                </div>
              </div>

              {isJobClosed ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="mr-3 rounded-full border bg-neutral-50 p-3">
                      <Lock className='w-4 h-4' />
                    </div>
                    <div>
                      <p className="text-black font-semibold">This job is closed</p>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
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
                    <p className="mb-4 max-w-md text-center text-sm text-gray-600">
                      This job is currently not accepting applications. Click below to reopen and start receiving applications again.
                    </p>
                    <button
                      onClick={handleReopenJob}
                      className="flex items-center rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
                    >
                      <LockOpen className="w-5 h-5 mr-2" />
                      Reopen Job
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
                    <h5 className="mb-3 text-base font-semibold text-black">Schedule automatic close</h5>
                    <div className='mb-3 flex flex-col gap-3 sm:flex-row sm:items-end'>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Close Date</label>
                        <input
                          type="date"
                          value={jobCloseDate}
                          onChange={(e) => setJobCloseDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="rounded-lg border border-gray-300 px-3 py-2 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Close Time</label>
                        <input
                          type="time"
                          value={jobCloseTime}
                          onChange={(e) => setJobCloseTime(e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2 cursor-pointer"
                        />
                      </div>
                      <div>
                        <button
                          onClick={handleCloseJob}
                          className="rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-700 cursor-pointer"
                        >
                          Schedule Close
                        </button>
                      </div>
                    </div>
                    {jobState?.closeDate && !isJobClosed && (
                      <div className="rounded-lg border-l-4 border-orange-400 bg-orange-50 p-3 text-sm text-orange-600">
                        Scheduled to close: {new Date(jobState.closeDate).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5">
                    <h5 className="mb-3 text-base font-semibold text-black">Close immediately</h5>
                    <div className='flex h-full flex-col gap-4'>
                      <p className="text-sm leading-6 text-neutral-600">
                        Stop accepting applications right away if the role is filled or no longer active.

                      </p>

                      <button
                        onClick={handleImmediateClose}
                        className="w-fit rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-600 cursor-pointer"
                      >
                        Close Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="border-l-2 border-red-200 pl-4 sm:pl-6">
              <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                      Danger zone
                    </div>
                    <p className="text-sm leading-6 text-red-800">
                      Permanently removes this job and all related applications, rounds, and uploaded files.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteJob(candidateResponsesState.length, tabs.length - 1)}
                    disabled={isDeleting}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Job
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        );

      default:
        if (activeTab.startsWith('Round ')) {
          const roundNumber = parseInt(activeTab.split(' ')[1]);
          const candidatesForRound = getCandidatesForRound(roundNumber, candidateFilter);
          const statusCounts = getStatusCounts(roundNumber, candidatesForRound);

          return (
            <div className="space-y-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
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
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
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
                        className="rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-neutral-800"
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
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
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
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-8 text-center shadow-sm">
          <div className="text-xl text-red-600 mb-4">{error || "Job not found"}</div>
          <Link href="/joblists" className="inline-flex rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-600 transition-colors">
            Back to Job Lists
          </Link>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-full text-neutral-900">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <JobHeader jobTitle={jobState.jobTitle} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-10 sm:px-6 lg:px-8">

        <div className="flex-1 pt-3">
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
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Filter Sidebar */}
                <CandidateFilter
                  candidateFilter={candidateFilter}
                  onFilterChange={setCandidateFilter}
                />

                {/* Tab Content */}
                <div className="flex-1">
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
      </main>
      <FooterLogin />
    </div>
  );
};

export default JobDetailsHireManager;