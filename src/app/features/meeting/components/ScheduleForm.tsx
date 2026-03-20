'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import CandidateSelector from './CandidateSelector';
import type { EligibleCandidate, ScheduleMode, DifferentSlotValue } from './types';
import { localToIso, parseInterviewerEmails } from './utils';

interface ScheduleFormProps {
  jobId: string;
  roundNumber: number;
  jobTitle: string;
  roundTitle: string;
  candidates: EligibleCandidate[];
  onSubmit: (data: SchedulePayload) => Promise<void>;
  loading?: boolean;
  title?: string;
}

interface SchedulePayload {
  mode: ScheduleMode;
  timezone: string;
  notes: string;
  interviewerEmails: string[];
  sameSlot?: {
    startTime: string;
    endTime: string;
    candidateResponseIds: string[];
  };
  candidateSlots?: Array<{ responseId: string; startTime: string; endTime: string }>;
}

const TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'Australia/Sydney',
];

export default function ScheduleForm({
  roundNumber,
  jobTitle,
  roundTitle,
  candidates,
  onSubmit,
  loading = false,
  title = 'Create meeting schedule',
}: ScheduleFormProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<ScheduleMode>('same_slot');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [notes, setNotes] = useState('');
  const [interviewerEmails, setInterviewerEmails] = useState('');
  const [sameSlotStart, setSameSlotStart] = useState('');
  const [sameSlotEnd, setSameSlotEnd] = useState('');
  const [differentSlots, setDifferentSlots] = useState<Record<string, DifferentSlotValue>>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleCandidate = (id: string) => {
    const newSet = new Set(selectedCandidates);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCandidates(newSet);
  };

  const handleUpdateDifferentSlot = (responseId: string, field: 'startTime' | 'endTime', value: string) => {
    setDifferentSlots((prev) => ({
      ...prev,
      [responseId]: {
        ...prev[responseId],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    if (selectedCandidates.size === 0) {
      setError('Please select at least one candidate');
      return false;
    }

    const cleanedEmails = parseInterviewerEmails(interviewerEmails);
    if (interviewerEmails.trim() && cleanedEmails.length === 0) {
      setError('Please enter valid interviewer emails');
      return false;
    }

    if (mode === 'same_slot') {
      if (!sameSlotStart || !sameSlotEnd) {
        setError('Please select start and end times for the same slot');
        return false;
      }
      if (new Date(sameSlotStart) >= new Date(sameSlotEnd)) {
        setError('End time must be after start time');
        return false;
      }
    } else {
      for (const id of selectedCandidates) {
        const slot = differentSlots[id];
        if (!slot?.startTime || !slot?.endTime) {
          setError(`Please set times for all selected candidates`);
          return false;
        }
        if (new Date(slot.startTime) >= new Date(slot.endTime)) {
          setError(`Invalid time range for one of the candidates`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        mode,
        timezone,
        notes,
        interviewerEmails: parseInterviewerEmails(interviewerEmails),
      };

      if (mode === 'same_slot') {
        Object.assign(payload, {
          sameSlot: {
            startTime: localToIso(sameSlotStart),
            endTime: localToIso(sameSlotEnd),
            candidateResponseIds: Array.from(selectedCandidates),
          },
        });
      } else {
        const candidateSlots = Array.from(selectedCandidates).map((id) => ({
          responseId: id,
          ...differentSlots[id],
        }));
        Object.assign(payload, { candidateSlots });
      }

      await onSubmit(payload);

      // Reset form
      setSelectedCandidates(new Set());
      setMode('same_slot');
      setSameSlotStart('');
      setSameSlotEnd('');
      setDifferentSlots({});
      setNotes('');
      setInterviewerEmails('');
    } catch (err: unknown) {
      const errorMessage =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(errorMessage ?? 'Failed to create schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="mt-1 text-sm text-neutral-600">
          {jobTitle} • Round {roundNumber}: {roundTitle}
        </p>
      </div>

      {error && (
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-none text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Candidate Selector */}
      <div>
        <label className="block text-sm font-semibold text-neutral-900">Select candidates</label>
        <div className="mt-3">
          <CandidateSelector
            candidates={candidates}
            selectedIds={selectedCandidates}
            onToggle={handleToggleCandidate}
            loading={loading}
          />
        </div>
      </div>

      {/* Schedule Mode */}
      <div>
        <label className="block text-sm font-semibold text-neutral-900">Schedule mode</label>
        <div className="mt-3 flex gap-3">
          {(['same_slot', 'different_slot'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === m
                  ? 'bg-black text-white'
                  : 'border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300'
              }`}
            >
              {m === 'same_slot' ? 'Same slot for all' : 'Different slots'}
            </button>
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label htmlFor="timezone" className="block text-sm font-semibold text-neutral-900">
          Timezone
        </label>
        <select
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule Times */}
      {mode === 'same_slot' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start-time" className="block text-sm font-semibold text-neutral-900">
              Start time
            </label>
            <input
              id="start-time"
              type="datetime-local"
              value={sameSlotStart}
              onChange={(e) => setSameSlotStart(e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-semibold text-neutral-900">
              End time
            </label>
            <input
              id="end-time"
              type="datetime-local"
              value={sameSlotEnd}
              onChange={(e) => setSameSlotEnd(e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-neutral-900">Set different times for each candidate</p>
          {Array.from(selectedCandidates).map((id) => {
            const candidate = candidates.find((c) => c._id === id);
            return (
              <div key={id} className="space-y-2 rounded-lg bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-900">{candidate?.candidateName}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="datetime-local"
                    value={differentSlots[id]?.startTime || ''}
                    onChange={(e) => handleUpdateDifferentSlot(id, 'startTime', e.target.value)}
                    placeholder="Start time"
                    className="rounded border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                  <input
                    type="datetime-local"
                    value={differentSlots[id]?.endTime || ''}
                    onChange={(e) => handleUpdateDifferentSlot(id, 'endTime', e.target.value)}
                    placeholder="End time"
                    className="rounded border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interviewer Emails */}
      <div>
        <label htmlFor="interviewers" className="block text-sm font-semibold text-neutral-900">
          Interviewer emails
        </label>
        <p className="mt-1 text-xs text-neutral-500">Comma-separated (optional)</p>
        <textarea
          id="interviewers"
          value={interviewerEmails}
          onChange={(e) => setInterviewerEmails(e.target.value)}
          placeholder="panel1@company.com, panel2@company.com"
          rows={2}
          className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-neutral-900">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes for the interview..."
          rows={3}
          className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || loading}
        className="w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 hover:bg-neutral-800"
      >
        {isSubmitting ? 'Creating schedule...' : 'Create schedule'}
      </button>
    </form>
  );
}
