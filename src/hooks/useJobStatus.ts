"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Job } from '@/src/types/Job';

interface UseJobStatusProps {
  job: Job | null;
  jobId: string;
  token: string | null;
  setJob: React.Dispatch<React.SetStateAction<Job | null>>;
}

interface UseJobStatusReturn {
  jobCloseDate: string;
  jobCloseTime: string;
  isJobClosed: boolean;
  isDeleting: boolean;
  setJobCloseDate: (date: string) => void;
  setJobCloseTime: (time: string) => void;
  handleCloseJob: () => Promise<void>;
  handleImmediateClose: () => Promise<void>;
  handleReopenJob: () => Promise<void>;
  handleDeleteJob: (candidateCount: number, roundCount: number) => Promise<void>;
}

export const useJobStatus = ({
  job,
  jobId,
  token,
  setJob
}: UseJobStatusProps): UseJobStatusReturn => {
  const [jobCloseDate, setJobCloseDate] = useState<string>("");
  const [jobCloseTime, setJobCloseTime] = useState<string>("");
  const [isJobClosed, setIsJobClosed] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set initial job closed status
  useEffect(() => {
    if (job?.closeDate) {
      const closeDateTime = new Date(job.closeDate);
      const now = new Date();

      if (now > closeDateTime) {
        setIsJobClosed(true);
      } else {
        setIsJobClosed(job.isClosed || false);
      }

      if (job.closeDate) {
        const closeDate = new Date(job.closeDate);
        setJobCloseDate(closeDate.toISOString().split("T")[0]);
        setJobCloseTime(closeDate.toISOString().split("T")[1].slice(0, 5));
      }
    } else {
      setIsJobClosed(job?.isClosed || false);
    }
  }, [job]);

  // Schedule job close
  const handleCloseJob = async () => {
    if (!jobCloseDate || !jobCloseTime) {
      alert("please select both date and time to close the job.");
      return;
    }

    try {
      const closeDateTime = new Date(`${jobCloseDate}T${jobCloseTime}`);
      const now = new Date();

      if (closeDateTime <= now) {
        alert("please select a future date and time.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/close`,
        {
          closeDate: closeDateTime.toISOString(),
          isClosed: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`Job will automatically close on ${closeDateTime.toLocaleString()}`);
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

  // Immediate close
  const handleImmediateClose = async () => {
    console.log("Token in handleImmediateClose:", token);
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

  // Reopen job
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
          closeDate: undefined
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

  // Delete job
  const handleDeleteJob = async (candidateCount: number, roundCount: number) => {
    const proceedToDelete = window.confirm(
      `⚠️ WARNING: You are about to permanently delete this job!\n\n` +
      `This will delete:\n` +
      `• Job posting: "${job?.jobTitle}"\n` +
      `• All ${candidateCount} candidate application(s)\n` +
      `• All ${roundCount} interview round(s)\n` +
      `• All associated data and files\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Click OK to proceed to confirmation.`
    );

    if (!proceedToDelete) return;

    const userInput = prompt(
      `To confirm deletion, please type DELETE (in capital letters):`
    );

    if (userInput !== 'DELETE') {
      if (userInput !== null) {
        alert('Deletion cancelled. You must type "DELETE" exactly to confirm.');
      }
      return;
    }

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('✓ Job deleted successfully!');
        window.location.href = '/joblists';
      }
    } catch (error: any) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
  };
};