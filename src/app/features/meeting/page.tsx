'use client';

import { useEffect } from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { useAuth } from '@/src/hooks/useAuth';
import { MeetingDashboard, UnauthorizedMessage } from './components';

export default function MeetingPage() {
  const { authUser, initializeAuth, checkAuth, isCheckingAuth } = useAuth();
  const isHireManager = authUser?.role === 'hire_manager';
  const isCandidate = authUser?.role === 'candidate';

  useEffect(() => {
    initializeAuth();
    if (!authUser) {
      checkAuth();
    }
  }, [authUser, checkAuth, initializeAuth]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      {/* Navbar */}
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-14">
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Page Header */}
            <div className="mb-12 space-y-4">
              <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                Meeting Scheduling
              </span>
              <h1 className="max-w-3xl text-4xl font-serif tracking-tight sm:text-5xl lg:text-6xl">
                Schedule and manage interview meetings
              </h1>
              <p className="max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                Create Google Meet links, schedule meetings with candidates, and manage your interview rounds all in one place.
              </p>
            </div>

            {/* Conditional Rendering Based on Auth State */}
            {isCheckingAuth ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-black"></div>
                  <p className="mt-4 text-sm text-neutral-600">Loading...</p>
                </div>
              </div>
            ) : !authUser ? (
              /* Not Logged In */
              <UnauthorizedMessage type="not-logged-in" />
            ) : isCandidate ? (
              /* Candidate User */
              <UnauthorizedMessage type="candidate-prompt" />
            ) : !isHireManager ? (
              /* Wrong Role */
              <UnauthorizedMessage type="wrong-role" />
            ) : (
              /* Hire Manager - Show Dashboard */
              <MeetingDashboard />
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      {!isHireManager && (
        <div className="mt-auto border-t border-neutral-200">
          <Footer />
        </div>
      )}
    </div>
  );
}
