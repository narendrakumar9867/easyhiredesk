"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from "@/src/hooks/useAuth";
import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';

interface Job {
  _id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  companyWebsite?: string;
  socialLinks?: { platform: string; url: string; id: number }[];
  aboutJob: string;
  createdAt?: string;
  closeDate?: string;
  isClosed?: boolean;
}

interface FormResponse {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  responses: {
    fieldLabel: string;
    fieldType: string;
    value: any;
  }[];
  status: 'pending' | 'selected' | 'rejected';
  submittedAt: string;
  notes?: string;
  roundStatuses?: {
    round: number;
    status: 'pending' | 'selected' | 'rejected';
    notes?: string;
  }[];
}

interface JobRounds {
  jobId: string;
  selectedRounds: string[];
  createdAt?: string;
}

const JobDetailsHireManager: React.FC = () => {
  const params = useParams();
  const { token } = useAuth();
  const jobId = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [jobRounds, setJobRounds] = useState<JobRounds | null>(null);
  const [candidateResponses, setCandidateResponses] = useState<FormResponse[]>([]);
  const [openCandidateId, setOpenCandidateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null); // Track which candidate is being updated
  const [activeTab, setActiveTab] = useState<string>('Job details');
  const [jobCloseDate, setJobCloseDate] = useState<string>("");
  const [jobCloseTime, setJobCloseTime] = useState<string>("");
  const [isJobClosed, setIsJobClosed] = useState<boolean>(false);

  // Fetch job details, rounds, and candidate responses
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !token) return;
      
      try {
        setLoading(true);
        // Fetch job details
        console.log("Fetching job details for jobId:", jobId);
        const jobResponse = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Job response:", jobResponse.data);
        setJob(jobResponse.data.job);
        // Fetch rounds for this job
        try {
          console.log("Fetching rounds for jobId:", jobId);
          const roundsResponse = await axios.get(`http://localhost:5000/api/rounds/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("Rounds API response:", roundsResponse.data);
          if (roundsResponse.data && roundsResponse.data.data) {
            console.log("Setting jobRounds to:", roundsResponse.data.data);
            setJobRounds(roundsResponse.data.data);
          }
        } catch (roundsError: any) {
          console.log("No rounds found for this job yet:", roundsError.response?.data?.message);
          setJobRounds(null);
        }
        // Fetch candidate responses
        try {
          console.log("Fetching candidate responses for jobId:", jobId);
          const responsesResponse = await axios.get(`http://localhost:5000/api/form/responses/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("Candidate responses API response:", responsesResponse.data);
          if (responsesResponse.data && responsesResponse.data.data) {
            setCandidateResponses(responsesResponse.data.data.responses || []);
            console.log("Set candidate responses:", responsesResponse.data.data.responses);
          }
        } catch (responseError: any) {
          console.log("No candidate responses found:", responseError.response?.data?.message);
          setCandidateResponses([]);
        }
        
        setError(null);
      } catch (error: any) {
        console.error("Error fetching job details:", error);
        setError(error.response?.data?.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, token]);

  useEffect(() => {
    if(job?.closeDate) {
      const closeDateTime = new Date(job.closeDate);
      const now = new Date();

      if(now > closeDateTime) {
        setIsJobClosed(true);
      }
      else {
        setIsJobClosed(job.isClosed || false);
      }

      if(job.closeDate) {
        const closeDate = new Date(job.closeDate);
        setJobCloseDate(closeDate.toISOString().split("T")[0]);
        setJobCloseTime(closeDate.toISOString().split("T")[1].slice(0, 5));
      }
    }
    else {
      setIsJobClosed(job?.isClosed || false);
    }
  }, [job]);

  const handleCloseJob = async () => {
    if(!jobCloseDate || !jobCloseTime) {
      alert("please select both date and time to close the job.");
      return;
    }

    try {
      const closeDateTime = new Date(`${jobCloseDate}T${jobCloseTime}`);
      const now = new Date();

      if(closeDateTime <= now) {
        alert("please select a future date and time.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/close`,
        {
          closeDate: closeDateTime.toISOString(),
          isClosed: false
        },
        { headers: { Authorization: `Bearer ${token}`}}
      );

      if(response.data.success) {
        alert(`Job will automatically close on ${closeDateTime.toISOString()}`);
        setJob(prev => prev ? {
          ...prev,
          closeDate: closeDateTime.toISOString(),
          isClosed: false
        } : null);
      }
    } catch (error: any) {
      console.error("error scheduling job close: ", error);
      alert("Failed to schedule job closure: " + (error.response?.data?.message || error.message));
    }
  };

  // function to immediately close the job:
  const handleImmediateClose = async () => {
    console.log("Token in handleImmedidateClose:", token);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/close`,
        { 
          isClosed: true,
          closeDate: new Date().toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Job closed successfully!');
        setIsJobClosed(true);
        setJob(prev => prev ? {
          ...prev,
          isClosed: true,
          closeDate: new Date().toISOString()
        } : null);
      }
    } catch (error: any) {
      console.error('Error closing job:', error);
      alert('Failed to close job: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReopenJob = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/reopen`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Job reopened successfully!');
        setIsJobClosed(false);
        setJob(prev => prev ? {
          ...prev,
          isClosed: false,
          closeDate: null
        } : null);
        // Clear the form fields
        setJobCloseDate('');
        setJobCloseTime('');
      }
    } catch (error: any) {
      console.error('Error reopening job:', error);
      alert('Failed to reopen job: ' + (error.response?.data?.message || error.message));
    }
  };

  const viewUploadedFile = async (responseId: string, fieldLabel: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/form/file/${responseId}/${fieldLabel}`, {
        headers: { Authorization: `Bearer ${token}`}
      });

      if(response.data.success) {
        // for opening the file in new tab
        window.open(response.data.data.fileUrl);
        console.log("Error in file opening", viewUploadedFile);
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Failed to load file");
    }
  }

  const updateCandidateStatus = async (responseId: string, status: 'selected' | 'rejected', round: number = 1, notes?: string) => {
    try {
      setUpdating(responseId);
      
      console.log(`Updating candidate ${responseId} status to ${status} for round ${round}`);
      const response = await axios.put(
        `http://localhost:5000/api/form/update-status/${responseId}`,
        { status, notes: notes || '', round, hireManagerEmail: "botcoder89@gmail.com" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Status update response:", response.data);
      
      // Update local state with round specific status
      setCandidateResponses(prev => 
        prev.map(candidate => {
          if(candidate._id === responseId) {
            const updatedCandidate = { ...candidate };

            if(!updatedCandidate.roundStatuses) {
              updatedCandidate.roundStatuses = [];
            }
            const existingRoundIndex = updatedCandidate.roundStatuses.findIndex(rs => rs.round === round);

            if(existingRoundIndex >= 0) {
              updatedCandidate.roundStatuses[existingRoundIndex] = {
                ...updatedCandidate.roundStatuses[existingRoundIndex],
                status,
                notes: notes || updatedCandidate.roundStatuses[existingRoundIndex].notes
              };
            }
            else {
              updatedCandidate.roundStatuses.push({
                round,
                status,
                notes: notes || " "
              });
            }

            if(round === 1) {
              updatedCandidate.status = status;
              updatedCandidate.notes = notes || candidate.notes;
            }

            return updatedCandidate;
          }
          return candidate;
        })
      );
      
      // Show success message with email status
      const candidateName = candidateResponses.find(c => c._id === responseId)?.candidateName || 'Candidate';
      
      if (response.data.emailSent) {
        alert(`${candidateName} has been ${status}. Email sent successfully.`);
      } else {
        alert(`${candidateName} has been ${status}. Status updated but email failed to send: ${response.data.emailError || 'Unknown error'}`);
      }
      
    } catch (error: any) {
      console.error("Error updating candidate status:", error);
      alert(`Failed to update candidate status: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(null);
    }
  };

  // Generate tabs dynamically based on rounds
  const generateTabs = (): string[] => {
    const tabs = ['Job details'];
    
    try {
      if (jobRounds && 
          jobRounds.selectedRounds && 
          Array.isArray(jobRounds.selectedRounds) && 
          jobRounds.selectedRounds.length > 0) {
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

  // Render markdown function
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-gray-500 italic">No content added yet...</p>;

    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-3 mt-5">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium text-gray-700 mb-2 mt-4">{line.substring(4)}</h3>;
      }
      
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={index} className="text-gray-700 mb-1 ml-4">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            {line.substring(2)}
          </li>
        );
      }
      
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      return <p key={index} className="text-gray-700 mb-3">{line}</p>;
    });
  };

  const renderCandidateCard = (candidate: FormResponse, index: number, roundNumber?: number) => {
      const isUpdating = updating === candidate._id;
      const isOpen = openCandidateId === candidate._id;

      const getCurrentRoundFromTab = (tab: string): number => {
        if(tab === "Job details") return 1;
        const match = tab.match(/Round (\d+)/);
        return match ? parseInt(match[1]) : 1;
      };

      const getRoundStatus = (candidate: FormResponse, round: number): string => {
        if(round === 1) return candidate.status;

        const roundStatus = candidate.roundStatuses?.find(rs => rs.round === round);
        return roundStatus?.status || "pending";
      }
      
      return (
        <div key={candidate._id} className="bg-white border border-gray-300 rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 cursor-pointer" onClick={() => setOpenCandidateId(isOpen ? null : candidate._id)}>
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
                getRoundStatus(candidate, getCurrentRoundFromTab(activeTab)) === 'selected'  // ✅ Use current round status
                    ? 'bg-green-100 text-green-800'
                    : getRoundStatus(candidate, getCurrentRoundFromTab(activeTab)) === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getRoundStatus(candidate, getCurrentRoundFromTab(activeTab)).charAt(0).toUpperCase() + getRoundStatus(candidate, getCurrentRoundFromTab(activeTab)).slice(1)} {/* ✅ Show current round status */}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => {
                const currentRound = getCurrentRoundFromTab(activeTab);
                updateCandidateStatus(candidate._id, "selected", currentRound);
              }}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                getRoundStatus(candidate, getCurrentRoundFromTab(activeTab)) === 'selected'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-700'
              }`}
            >
              {isUpdating ? 'Updating...' : 'Select'}
            </button>
            <button
              onClick={() => {
                const currentRound = getCurrentRoundFromTab(activeTab);
                updateCandidateStatus(candidate._id, "rejected", currentRound); // ✅ Add round parameter
              }}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                getRoundStatus(candidate, getCurrentRoundFromTab(activeTab)) === 'rejected'  // ✅ Use current round status
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
                                onClick={() => viewUploadedFile(candidate._id, response.fieldLabel)}
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

  const renderTabContent = () => {
  // Helper function to get round-specific status
  const getRoundStatus = (candidate: FormResponse, round: number): string => {
    if (round === 1) return candidate.status; // Use main status for Round 1
    
    const roundStatus = candidate.roundStatuses?.find(rs => rs.round === round);
    return roundStatus?.status || 'pending';
  };

  // Helper function to get candidates for a specific round
  const getCandidatesForRound = (round: number) => {
    if (round === 1) {
      // Round 1 shows all candidates
      return candidateResponses;
    } else {
      // Other rounds show candidates selected from previous round
      return candidateResponses.filter(candidate => {
        const prevRoundStatus = getRoundStatus(candidate, round - 1);
        return prevRoundStatus === 'selected';
      });
    }
  };

  // Helper function to get status counts for a specific round
  const getStatusCounts = (round: number, candidates: FormResponse[]) => {
    const selected = candidates.filter(c => getRoundStatus(c, round) === 'selected').length;
    const rejected = candidates.filter(c => getRoundStatus(c, round) === 'rejected').length;
    const pending = candidates.filter(c => getRoundStatus(c, round) === 'pending').length;
    
    return { selected, rejected, pending };
  };

  try {
    switch (activeTab) {
      case 'Job details':
        return (
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="mb-6">
              <h3 className="text-black text-lg font-semibold mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Company Name</p>
                  <p className="text-black font-semibold">{job?.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-black">{job?.location}</p>
                </div>
                {job?.companyWebsite && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Website</p>
                    <a 
                      href={job.companyWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {job.companyWebsite}
                    </a>
                  </div>
                )}
                {job?.socialLinks && job.socialLinks.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Social Links</p>
                    <div className="flex space-x-2">
                      {job.socialLinks.map((link, index) => (
                        <a 
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline capitalize"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-black text-lg font-semibold mb-4">Job Description</h3>
              <div className="prose prose-blue max-w-none">
                {renderMarkdown(job?.aboutJob || "")}
              </div>
            </div>

            {/* Show selected rounds info or no rounds message */}
            {jobRounds && jobRounds.selectedRounds && Array.isArray(jobRounds.selectedRounds) && jobRounds.selectedRounds.length > 0 ? (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Interview Process</h4>
                <p className="text-gray-600 mb-2">
                  This job has <strong>{jobRounds.selectedRounds.length}</strong> interview rounds:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                  {jobRounds.selectedRounds.map((round, index) => (
                    <li key={index}>{round}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Interview Process</h4>
                <p className="text-yellow-700">
                  No interview rounds have been set up for this job yet. Please configure the hiring process first.
                </p>
                <Link 
                  href={`/rounds?jobId=${jobId}&rounds=3`}
                  className="inline-block mt-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Configure Rounds
                </Link>
              </div>
            )}

            {/* Application link */}
            <div className="mt-6 p-4 bg-gray-50 border border-black rounded-lg">
              <h4 className="text-lg font-semibold text-black mb-2">Application Link</h4>
              <p className="text-black mb-3">
                Share this link with candidates to apply for this position:
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/apply/${jobId}`}
                  className="flex-1 px-3 py-2 border border-black rounded-md bg-white text-sm"
                />
                <button
                  onClick={() => {
                    const shareLink = `${window.location.origin}/apply/${jobId}`;
                    navigator.clipboard.writeText(shareLink);
                    alert('Application link copied to clipboard!');
                  }}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-black rounded-lg">
              <h4 className="text-lg font-semibold text-black mb-2">Job Status</h4>
              
              {isJobClosed ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <p className="text-red-800 font-semibold">This job is closed</p>
                    </div>
                  </div>
                  <p className="text-red-600 text-sm mb-4">
                    {job?.closeDate ? 
                      `Closed on: ${new Date(job.closeDate).toLocaleString()}` : 
                      'This job has been manually closed.'
                    }
                  </p>
                  <button
                    onClick={handleReopenJob}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Reopen Job
                  </button>
                </div>
              ) : (
                <>
                  <p className='text-black mb-3'>
                    Schedule when this job should automatically close or close it immediately.
                  </p>
                  
                  {/* Schedule Close Section */}
                  <div className="mb-4 p-3 bg-white rounded-lg border">
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
                    {job?.closeDate && !isJobClosed && (
                      <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded border-l-4 border-orange-400">
                        Scheduled to close: {new Date(job.closeDate).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Immediate Close Section */}
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-2">Close Immediately</h5>
                    <div className='flex items-center justify-between'>
                      <p className="text-red-600 text-sm">
                        Close this job right now. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleImmediateClose}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Close Now
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      default:
        // Handle round tabs dynamically
        if (activeTab.startsWith('Round ')) {
          const roundNumber = parseInt(activeTab.split(' ')[1]);
          const candidatesForRound = getCandidatesForRound(roundNumber);
          const statusCounts = getStatusCounts(roundNumber, candidatesForRound);
          
          return (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {roundNumber === 1 
                        ? 'Round 1 - Candidate Applications' 
                        : `Round ${roundNumber} - Interview Round`
                      }
                    </h3>
                    <p className="text-gray-600">
                      {roundNumber === 1 
                        ? 'Review and select candidates who submitted their applications.'
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
                
                {/* Status summary for current round */}
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
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
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
                    .map((candidate, index) => {
                      // Pass the current round number to renderCandidateCard
                      return renderCandidateCard(candidate, index, roundNumber);
                    })}
                </div>
              )}
            </div>
          );
        }
        return null;
    }
  } catch (error) {
    console.error("Error rendering tab content:", error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Content</h3>
        <p className="text-red-600">There was an error loading this tab content. Please refresh the page.</p>
      </div>
    );
  }
};

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

  if (error || !job) {
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-full">
      < Navbar />
      <div className="max-w-full px-9 py-3 flex-1">
        {/* Job Title Header */}
        <div className="bg-white border border-black rounded-lg p-6 mb-8">
          <h1 className="text-black text-2xl font-bold text-center">{job.jobTitle}</h1>
        </div>

        {/* Navigation Tabs - Dynamic based on selected rounds */}
        {!loading && (
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-white text-black'
                      : 'bg-black text-white border border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
                {index < tabs.length - 1 && (
                  <div className="flex-1 h-px bg-black mx-4 min-w-[20px]"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>

      < FooterLogin />
    </div>
  );
};

export default JobDetailsHireManager;