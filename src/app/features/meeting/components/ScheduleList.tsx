'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Link as LinkIcon, AlertCircle, Repeat2 } from 'lucide-react';
import type { Schedule, Invite } from './types';
import { formatDateTime, getStatusColor, getStatusText } from './utils';

interface ScheduleListProps {
  schedules: Schedule[];
  onReschedule?: (scheduleId: string) => void;
  onCancel?: (scheduleId: string, candidateResponseIds: string[]) => void;
  onRetry?: (scheduleId: string) => void;
  loading?: boolean;
}

export default function ScheduleList({
  schedules,
  onReschedule,
  onCancel,
  onRetry,
  loading,
}: ScheduleListProps) {
  const [expandedSchedules, setExpandedSchedules] = useState<Set<string>>(new Set());

  const toggleExpand = (scheduleId: string) => {
    const newSet = new Set(expandedSchedules);
    if (newSet.has(scheduleId)) {
      newSet.delete(scheduleId);
    } else {
      newSet.add(scheduleId);
    }
    setExpandedSchedules(newSet);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-center text-sm text-neutral-600">Loading schedules...</p>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-center text-sm text-neutral-600">No schedules created yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => {
        const isExpanded = expandedSchedules.has(schedule._id);
        const failedCount = schedule.invites.filter((i) => i.mailStatus === 'failed').length;

        return (
          <div key={schedule._id} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            {/* Header */}
            <button
              onClick={() => toggleExpand(schedule._id)}
              className="w-full px-6 py-4 hover:bg-neutral-50 transition text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-semibold text-neutral-900">Round {schedule.roundNumber}</h4>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(schedule.status)}`}
                    >
                      {getStatusText(schedule.status)}
                    </span>
                    {failedCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                        <AlertCircle className="h-3 w-3" />
                        {failedCount} failed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">
                    {schedule.invites.length} candidates • {schedule.mode === 'same_slot' ? 'Same slot' : 'Different slots'} • {schedule.timezone}
                  </p>
                </div>
                <div className="flex-none">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
            </button>

            {/* Details */}
            {isExpanded && (
              <>
                <div className="border-t border-neutral-200 px-6 py-4">
                  {/* Notes */}
                  {schedule.notes && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Notes</p>
                      <p className="mt-2 text-sm text-neutral-700">{schedule.notes}</p>
                    </div>
                  )}

                  {/* Interviewer Emails */}
                  {schedule.interviewerEmails.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Interviewers</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {schedule.interviewerEmails.map((email) => (
                          <span
                            key={email}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Invites */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Invitations</p>
                    <div className="mt-3 space-y-3">
                      {schedule.invites.map((invite) => (
                        <InviteRow key={invite.responseId} invite={invite} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 flex flex-wrap gap-2">
                  {onReschedule && (
                    <button
                      onClick={() => onReschedule(schedule._id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-900 transition hover:bg-white"
                    >
                      Reschedule
                    </button>
                  )}
                  {onCancel && (
                    <button
                      onClick={() =>
                        onCancel(
                          schedule._id,
                          schedule.invites.map((i) => i.responseId)
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-900 transition hover:bg-red-50"
                    >
                      Cancel all
                    </button>
                  )}
                  {failedCount > 0 && onRetry && (
                    <button
                      onClick={() => onRetry(schedule._id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-900 transition hover:bg-orange-200"
                    >
                      <Repeat2 className="h-3 w-3" />
                      Retry failed ({failedCount})
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface InviteRowProps {
  invite: Invite;
}

function InviteRow({ invite }: InviteRowProps) {
  const statusColor = getStatusColor(invite.mailStatus);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-neutral-900">{invite.candidateName}</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
              {invite.mailStatus === 'scheduled' ? 'Sent' : getStatusText(invite.mailStatus)}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-neutral-600">{invite.candidateEmail}</p>
          {invite.startTime && invite.endTime && (
            <p className="mt-1 text-xs text-neutral-600">
              {formatDateTime(invite.startTime)} - {formatDateTime(invite.endTime)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-none flex-col gap-1">
          {invite.meetLink && (
            <a
              href={invite.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
            >
              <LinkIcon className="h-3 w-3" />
              Meet
            </a>
          )}
          {invite.mailError && (
            <button
              title={invite.mailError}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <AlertCircle className="h-3 w-3" />
              Error
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
