"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Job, JobRounds } from '@/src/types/Job';
import { FormResponse } from '@/src/types/form';

interface UseJobDetailsReturn {
  job: Job | null;
  jobRounds: JobRounds | null;
  roundTitles: { [key: number]: string };
  candidateResponses: FormResponse[];
  loading: boolean;
  error: string | null;
  refetchJobDetails: () => Promise<void>;
}

export const useJobDetails = (jobId: string, token: string | null): UseJobDetailsReturn => {
  const [job, setJob] = useState<Job | null>(null);
  const [jobRounds, setJobRounds] = useState<JobRounds | null>(null);
  const [roundTitles, setRoundTitles] = useState<{ [key: number]: string }>({});
  const [candidateResponses, setCandidateResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          // Extract and store round titles
          if (roundsResponse.data.data.roundDetails && Array.isArray(roundsResponse.data.data.roundDetails)) {
            const titles: { [key: number]: string } = {};
            for (const detail of roundsResponse.data.data.roundDetails) {
              if (detail.roundNumber && detail.title) {
                titles[detail.roundNumber] = detail.title;
              }
            }
            setRoundTitles(titles);
            console.log("Round titles set:", titles);
          }
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

  useEffect(() => {
    fetchJobDetails();
  }, [jobId, token]);

  return {
    job,
    jobRounds,
    roundTitles,
    candidateResponses,
    loading,
    error,
    refetchJobDetails: fetchJobDetails
  };
};