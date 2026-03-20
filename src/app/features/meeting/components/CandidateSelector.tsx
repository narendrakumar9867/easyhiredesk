import type { EligibleCandidate } from './types';

interface CandidateSelectorProps {
  candidates: EligibleCandidate[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  loading?: boolean;
}

export default function CandidateSelector({
  candidates,
  selectedIds,
  onToggle,
  loading = false,
}: CandidateSelectorProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-center text-sm text-neutral-600">Loading candidates...</p>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-center text-sm text-neutral-600">No eligible candidates for this round.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h4 className="text-sm font-semibold text-neutral-900">Select candidates ({selectedIds.size})</h4>
      </div>
      <div className="divide-y divide-neutral-200">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
            <input
              type="checkbox"
              id={candidate._id}
              checked={selectedIds.has(candidate._id)}
              onChange={() => onToggle(candidate._id)}
              className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
            />
            <label htmlFor={candidate._id} className="flex-1 cursor-pointer">
              <div className="text-sm">
                <p className="font-medium text-neutral-900">{candidate.candidateName}</p>
                <p className="text-xs text-neutral-600">{candidate.candidateEmail}</p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
