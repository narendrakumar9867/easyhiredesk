'use client';

import { useState, useEffect } from 'react';
import { axiosInstance } from '@/src/utils/axios';
import { JobOverview, EligibleCandidate, Schedule, ApiResponse } from './types';
import JobSelector from './JobSelector';
import ScheduleForm from './ScheduleForm';
import ScheduleList from './ScheduleList';

interface SchedulePayload {
  mode: 'same_slot' | 'different_slot';
  timezone: string;
  interviewerEmails: string[];
  notes: string;
  sameSlot?: {
    startTime: string;
    endTime: string;
    candidateResponseIds: string[];
  };
  candidateSlots?: Array<{
    responseId: string;
    startTime: string;
    endTime: string;
  }>;
}

interface EligibleCandidatesResponse {
  roundTitle: string;
  candidates: EligibleCandidate[];
}

export default function MeetingDashboard() {
  const [jobs, setJobs] = useState<JobOverview[]>([]);
  const [candidates, setCandidates] = useState<EligibleCandidate[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [selectedJob, setSelectedJob] = useState<JobOverview | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [selectedRoundTitle, setSelectedRoundTitle] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
        'string'
    ) {
      return (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get<ApiResponse<JobOverview[]>>('/meetings/jobs-overview');
        setJobs(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setMessage('Failed to load jobs. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedJob || !selectedRound || selectedRound < 2) {
        setCandidates([]);
        setSchedules([]);
        setSelectedRoundTitle('');
        return;
      }

      try {
        setIsFetching(true);

        const candidatesRes = await axiosInstance.get<ApiResponse<EligibleCandidatesResponse>>(
          `/meetings/jobs/${selectedJob._id}/rounds/${selectedRound}/eligible-candidates`
        );
        setCandidates(candidatesRes.data.data?.candidates || []);
        setSelectedRoundTitle(candidatesRes.data.data?.roundTitle || `Round ${selectedRound}`);

        const schedulesRes = await axiosInstance.get<ApiResponse<Schedule[]>>(
          `/meetings/jobs/${selectedJob._id}/rounds/${selectedRound}/schedules`
        );
        setSchedules(Array.isArray(schedulesRes.data.data) ? schedulesRes.data.data : []);
      } catch (error) {
        console.error('Failed to fetch candidates/schedules:', error);
        setStatus('error');
        setMessage(getErrorMessage(error, 'Failed to load round data.'));
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [selectedJob, selectedRound]);

  const handleCreateSchedule = async (payload: SchedulePayload) => {
    if (!selectedJob || !selectedRound || selectedRound < 2) {
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('Creating schedule...');

      const response = await axiosInstance.post<ApiResponse<{ schedule: Schedule }>>(
        `/meetings/jobs/${selectedJob._id}/rounds/${selectedRound}/schedules`,
        payload
      );

      const created = response.data.data?.schedule;
      if (created) {
        setSchedules((prev) => [created, ...prev]);
      }

      setStatus('success');
      setMessage('Schedule created successfully!');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: unknown) {
      setStatus('error');
      setMessage(getErrorMessage(error, 'Failed to create schedule'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = async (scheduleId: string) => {
    const schedule = schedules.find((s) => s._id === scheduleId);
    if (!schedule) {
      return;
    }

    const payload: SchedulePayload = {
      mode: schedule.mode,
      timezone: schedule.timezone,
      notes: schedule.notes,
      interviewerEmails: schedule.interviewerEmails,
    };

    if (schedule.mode === 'same_slot' && schedule.invites.length > 0) {
      payload.sameSlot = {
        startTime: schedule.invites[0].startTime,
        endTime: schedule.invites[0].endTime,
        candidateResponseIds: schedule.invites.map((invite) => invite.responseId),
      };
    } else {
      payload.candidateSlots = schedule.invites.map((invite) => ({
        responseId: invite.responseId,
        startTime: invite.startTime,
        endTime: invite.endTime,
      }));
    }

    try {
      setIsSubmitting(true);
      setMessage('Rescheduling...');

      const response = await axiosInstance.put<ApiResponse<{ schedule: Schedule }>>(
        `/meetings/schedules/${scheduleId}/reschedule`,
        payload
      );

      const updated = response.data.data?.schedule;
      if (updated) {
        setSchedules((prev) => prev.map((s) => (s._id === scheduleId ? updated : s)));
      }

      setStatus('success');
      setMessage('Schedule updated successfully!');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: unknown) {
      setStatus('error');
      setMessage(getErrorMessage(error, 'Failed to reschedule'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (scheduleId: string, candidateResponseIds: string[]) => {
    try {
      setIsSubmitting(true);
      setMessage('Cancelling schedule...');

      const response = await axiosInstance.post<ApiResponse<{ schedule: Schedule }>>(
        `/meetings/schedules/${scheduleId}/cancel`,
        { candidateResponseIds }
      );

      const updated = response.data.data?.schedule;
      if (updated) {
        setSchedules((prev) => prev.map((s) => (s._id === scheduleId ? updated : s)));
      }

      setStatus('success');
      setMessage('Cancellation processed successfully!');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: unknown) {
      setStatus('error');
      setMessage(getErrorMessage(error, 'Failed to cancel schedule'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async (scheduleId: string) => {
    try {
      setIsSubmitting(true);
      setMessage('Retrying failed invites...');

      const response = await axiosInstance.post<ApiResponse<{ schedule: Schedule }>>(
        `/meetings/schedules/${scheduleId}/retry-failed`,
        {}
      );

      const updated = response.data.data?.schedule;
      if (updated) {
        setSchedules((prev) => prev.map((s) => (s._id === scheduleId ? updated : s)));
      }

      setStatus('success');
      setMessage('Retry processed successfully!');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: unknown) {
      setStatus('error');
      setMessage(getErrorMessage(error, 'Failed to retry failed invites'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canManageRound = Boolean(selectedJob && selectedRound && selectedRound >= 2);
  const roundTitle =
    selectedRoundTitle ||
    selectedJob?.rounds.find((round) => round.roundNumber === selectedRound)?.title ||
    '';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-8 h-8 mb-3 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            status === 'success'
              ? 'bg-green-50 border-green-300 text-green-700'
              : status === 'error'
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-blue-50 border-blue-300 text-blue-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Job & Round Selection */}
      <JobSelector
        jobs={jobs}
        selectedJob={selectedJob}
        selectedRound={selectedRound}
        onSelectJob={setSelectedJob}
        onSelectRound={setSelectedRound}
        loading={isLoading}
      />

      {canManageRound && selectedJob && selectedRound && (
        <>
          <div className="grid grid-cols-1 gap-6">
            <ScheduleForm
              jobId={selectedJob._id}
              roundNumber={selectedRound}
              jobTitle={selectedJob.jobTitle}
              roundTitle={roundTitle}
              candidates={candidates}
              onSubmit={handleCreateSchedule}
              loading={isFetching || isSubmitting}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Scheduled Meetings</h3>
            <ScheduleList
              schedules={schedules}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
              onRetry={handleRetry}
              loading={isFetching}
            />
          </div>
        </>
      )}
    </div>
  );
}
