"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Mail,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
  Workflow,
} from "lucide-react";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { useAuth } from "@/src/hooks/useAuth";

const stats = [
  { value: "4", label: "core manager workflow stages" },
  { value: "1", label: "shared dashboard for job control" },
  { value: "24/7", label: "clear visibility into hiring progress" },
];

const managerHighlights = [
  {
    title: "Create structured job postings",
    description:
      "Capture company details, role information, location, links, and job-specific context from one guided flow.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Define rounds with intent",
    description:
      "Choose the number of rounds, add round details, and plan communication for selected and rejected candidates.",
    icon: ClipboardList,
  },
  {
    title: "Review candidates with control",
    description:
      "Track applicants, make select or reject decisions, and move strong candidates forward without losing context.",
    icon: Users,
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Launch the job",
    description:
      "Start from the hiring flow, publish a role, and organize the core job details before candidates begin applying.",
    icon: Workflow,
    tags: ["Job posting", "Role details", "Company information"],
  },
  {
    number: "02",
    title: "Set up the round structure",
    description:
      "Define how many interview or assessment rounds the role needs and build the process around the actual hiring path.",
    icon: ClipboardList,
    tags: ["Round planning", "Stage setup", "Process structure"],
  },
  {
    number: "03",
    title: "Manage candidate progression",
    description:
      "Round 1 becomes the primary screening layer, where managers review applicants and move selected candidates into the next stage.",
    icon: CheckCircle2,
    tags: ["Select or reject", "Candidate movement", "Round tracking"],
  },
  {
    number: "04",
    title: "Keep communication and timing aligned",
    description:
      "Use email templates, scheduling direction, and status visibility to keep the process active and easier to coordinate.",
    icon: CalendarClock,
    tags: ["Email actions", "Status visibility", "Scheduling support"],
  },
];

const controlAreas = [
  {
    title: "Decision handling",
    points: [
      "Select or reject candidates from the workflow itself.",
      "Keep decisions connected to the relevant round.",
      "Reduce manual follow-up between team members.",
    ],
    icon: CheckCircle2,
  },
  {
    title: "Candidate communication",
    points: [
      "Prepare separate email messaging for selected candidates.",
      "Handle rejection communication more consistently.",
      "Give applicants a clearer progression experience.",
    ],
    icon: Mail,
  },
  {
    title: "Operational controls",
    points: [
      "Review job details and round configuration in context.",
      "Close roles through timers or direct actions when needed.",
      "Keep hiring activity more structured than spreadsheet-based tracking.",
    ],
    icon: TimerReset,
  },
];

const principles = [
  "Keep the hiring manager's workflow visible from job setup to final selection.",
  "Treat rounds, candidate status, and communication as parts of one system.",
  "Build toward automation and AI support without overcomplicating core hiring tasks.",
];

export default function HireManagerPage() {
  const { authUser, initializeAuth, checkAuth, isCheckingAuth } = useAuth();
  const isHireManager = authUser?.role === "hire_manager";

  useEffect(() => {
    initializeAuth();

    const token = localStorage.getItem("token");
    if (token && !authUser) {
      checkAuth();
    }
  }, [authUser, checkAuth, initializeAuth]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <Navbar />
      </div>

      <main className="pt-24">
        <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                For Hire Managers
              </span>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-serif tracking-tight sm:text-5xl lg:text-6xl">
                  A clearer operating layer for posting roles, running rounds, and moving candidates forward.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  This page focuses on the hire manager workflow inside EasyhireDesk. From job creation to round planning, candidate review, and communication, the goal is to help managers run recruitment with more structure and less manual coordination.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/hireprocess"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Start hiring workflow
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/joblists"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
                >
                  View job lists
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5">
                    <div className="text-3xl font-semibold text-black">{stat.value}</div>
                    <p className="mt-2 text-sm text-neutral-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 flex-none text-black" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Built for practical hiring operations</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    Jobs, rounds, candidate decisions, and follow-up actions stay in one hiring flow so managers can operate with better continuity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                What managers can do here
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                The workflow is designed around the decisions hiring teams actually make.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {managerHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="inline-flex rounded-2xl bg-neutral-100 p-3 text-black">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Manager workflow
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  One structured path from job setup to round-by-round progression.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-neutral-600">
                The service follows the same logic as the rest of the project: publish the role, define rounds, review candidates, and keep progress moving with better visibility.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-4">
              {workflowSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex rounded-2xl bg-black p-3 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-neutral-400">{step.number}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{step.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
              {controlAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <article key={area.title} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
                    <div className="inline-flex rounded-2xl bg-white p-3 text-black shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold">{area.title}</h3>
                    <div className="mt-6 space-y-3">
                      {area.points.map((point) => (
                        <div key={point} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                          <p className="text-sm leading-6 text-neutral-600">{point}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="rounded-[2rem] bg-black p-8 text-white">
              <div className="inline-flex rounded-full border border-white/15 px-4 py-1 text-sm text-white/75">
                Operating principles
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                Better hiring management comes from clearer systems, not more admin work.
              </h2>
              <div className="mt-8 space-y-4">
                {principles.map((principle) => (
                  <div key={principle} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-white" />
                    <p className="text-sm leading-6 text-white/80">{principle}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-none text-white" />
                  <div>
                    <h3 className="text-xl font-semibold">Next layer for managers</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      The longer-term direction is stronger automation, better interview coordination, and AI support that helps managers respond faster without adding more process overhead.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/features/ai-assistance"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
                  >
                    Explore AI direction
                  </Link>
                  <Link
                    href="/features/meeting"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View meeting flow
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
