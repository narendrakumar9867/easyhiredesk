// Enum and type definitions for meeting scheduling
export type MailStatus = 'scheduled' | 'sent' | 'failed' | 'cancelled';
export type ScheduleStatus = 'scheduled' | 'partially_failed' | 'failed' | 'cancelled';
export type ScheduleMode = 'same_slot' | 'different_slot';

// Candidate
export interface EligibleCandidate {
  _id: string;
  candidateEmail: string;
  candidateName: string;
}

// Single meeting invite
export interface Invite {
  responseId: string;
  candidateEmail: string;
  candidateName: string;
  startTime: string;
  endTime: string;
  eventId: string;
  meetLink: string;
  calendarEventLink: string;
  mailStatus: MailStatus;
  mailError?: string;
}

// Meeting schedule
export interface Schedule {
  _id: string;
  roundNumber: number;
  mode: ScheduleMode;
  timezone: string;
  notes: string;
  interviewerEmails: string[];
  status: ScheduleStatus;
  invites: Invite[];
  createdAt: string;
  updatedAt: string;
}

// Job round
export interface JobRound {
  roundNumber: number;
  title: string;
}

// Job overview with schedules
export interface JobOverview {
  _id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  rounds: JobRound[];
  schedules?: Schedule[];
}

// API contracts
export interface ContractsData {
  createSchedule: { method: string; path: string };
  reschedule: { method: string; path: string };
  cancel: { method: string; path: string };
  retryFailed: { method: string; path: string };
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Different slot form value
export interface DifferentSlotValue {
  startTime: string;
  endTime: string;
}

// API error
export interface ApiErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
