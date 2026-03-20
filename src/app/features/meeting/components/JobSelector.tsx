import { MapPin } from 'lucide-react';
import type { JobOverview } from './types';

interface JobSelectorProps {
  jobs: JobOverview[];
  selectedJob: JobOverview | null;
  selectedRound: number | null;
  onSelectJob: (job: JobOverview) => void;
  onSelectRound: (roundNumber: number) => void;
  loading?: boolean;
}

export default function JobSelector({
  jobs,
  selectedJob,
  selectedRound,
  onSelectJob,
  onSelectRound,
  loading = false,
}: JobSelectorProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-center text-sm text-neutral-600">Loading jobs...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-center text-sm text-neutral-600">
          No jobs with round 2+ available. Create a job with multiple rounds first.
        </p>
      </div>
    );
  }

  const availableRounds = selectedJob?.rounds.filter((r) => r.roundNumber >= 2) || [];

  return (
    <div className="space-y-4">
      {/* Job Selector */}
      <div>
        <label className="block text-sm font-semibold text-neutral-900">Select job</label>
        <div className="mt-3 space-y-2">
          {jobs.map((job) => (
            <button
              key={job._id}
              onClick={() => {
                onSelectJob(job);
                onSelectRound(0);
              }}
              className={`w-full rounded-lg border-2 px-4 py-3 text-left transition ${
                selectedJob?._id === job._id
                  ? 'border-black bg-black text-white'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-semibold ${selectedJob?._id === job._id ? 'text-white' : 'text-neutral-900'}`}>
                    {job.jobTitle}
                  </h4>
                  <div
                    className={`mt-1 flex items-center gap-1 text-xs ${
                      selectedJob?._id === job._id ? 'text-neutral-300' : 'text-neutral-600'
                    }`}
                  >
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${selectedJob?._id === job._id ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {job.rounds.length} rounds
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Round Selector */}
      {selectedJob && (
        <div>
          <label className="block text-sm font-semibold text-neutral-900">Select round</label>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {availableRounds.length > 0 ? (
              availableRounds.map((round) => (
                <button
                  key={round.roundNumber}
                  onClick={() => onSelectRound(round.roundNumber)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                    selectedRound === round.roundNumber
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div>Round {round.roundNumber}</div>
                  <div className="text-xs opacity-75">{round.title}</div>
                </button>
              ))
            ) : (
              <p className="col-span-3 text-sm text-neutral-600">
                Select a job with round 2 or higher to schedule meetings.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
