import Link from 'next/link';
import { AlertCircle, ShieldAlert, LogIn } from 'lucide-react';

interface UnauthorizedMessageProps {
  type: 'not-logged-in' | 'wrong-role' | 'candidate-prompt';
}

export default function UnauthorizedMessage({ type }: UnauthorizedMessageProps) {
  if (type === 'not-logged-in') {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-yellow-200 bg-yellow-50 p-8">
        <div className="flex gap-4">
          <LogIn className="h-6 w-6 flex-none text-yellow-600" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-900">Sign in to schedule meetings</h3>
            <p className="mt-2 text-sm text-yellow-700">
              As a hire manager, you can schedule and manage interview meetings with candidates.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/auth/login"
                className="inline-flex items-center rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup?role=hire_manager"
                className="inline-flex items-center rounded-lg border border-yellow-300 px-4 py-2 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-100"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'wrong-role') {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8">
        <div className="flex gap-4">
          <ShieldAlert className="h-6 w-6 flex-none text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Access denied</h3>
            <p className="mt-2 text-sm text-red-700">
              Only hire managers can schedule meetings. If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'candidate-prompt') {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-blue-200 bg-blue-50 p-8">
        <div className="flex gap-4">
          <AlertCircle className="h-6 w-6 flex-none text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Candidate meeting scheduling</h3>
            <p className="mt-2 text-sm text-blue-700">
                As a candidate, you&apos;ll receive meeting invitations and can respond to them directly from your
              notifications and dashboard. Meetings are scheduled by your hiring managers.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/joblists"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Browse jobs
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center rounded-lg border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-100"
              >
                View profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
