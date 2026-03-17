"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  ShieldCheck,
  UserRound,
  Workflow,
} from "lucide-react";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { useAuth } from "@/src/hooks/useAuth";

const stats = [
  { value: "1", label: "candidate dashboard for applications" },
  { value: "4", label: "clear stages from apply to decision" },
  { value: "100%", label: "focus on status visibility" },
];

const candidateHighlights = [
  {
    title: "Discover relevant openings",
    description:
      "Browse active roles with clearer job details so you can decide faster where to apply.",
    icon: FileSearch,
  },
  {
    title: "Apply with less friction",
    description:
      "Submit your profile and move into round-based hiring without needing disconnected steps.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Track progress confidently",
    description:
      "See your status updates and round movement so you always know where your application stands.",
    icon: BadgeCheck,
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Find and review the job",
    description:
      "Explore available job posts, review role requirements, and identify opportunities that match your profile.",
    icon: FileSearch,
    tags: ["Job discovery", "Role details", "Quick filtering"],
  },
  {
    number: "02",
    title: "Submit your application",
    description:
      "Apply through a structured flow where your details are captured and aligned with the hiring process.",
    icon: ClipboardCheck,
    tags: ["Apply flow", "Profile details", "Submission tracking"],
  },
  {
    number: "03",
    title: "Move through interview rounds",
    description:
      "When selected, your status updates by round so you can follow progression from one stage to the next.",
    icon: UserRound,
    tags: ["Round progression", "Selection updates", "Status clarity"],
  },
  {
    number: "04",
    title: "Stay updated and prepared",
    description:
      "Get communication updates and prepare for upcoming steps with better visibility into decisions.",
    icon: Bell,
    tags: ["Notifications", "Interview prep", "Decision visibility"],
  },
];

const supportAreas = [
  {
    title: "Application tracking",
    points: [
      "Monitor status changes from pending to selected or rejected.",
      "Understand round-by-round outcomes in one place.",
      "Avoid confusion caused by scattered updates.",
    ],
    icon: Workflow,
  },
  {
    title: "Communication clarity",
    points: [
      "Get clearer updates tied to your actual stage.",
      "Reduce uncertainty around next interview steps.",
      "Stay aligned with hiring decisions without manual follow-ups.",
    ],
    icon: Bell,
  },
  {
    title: "Candidate confidence",
    points: [
      "Know exactly where your application is in the process.",
      "Approach each round with better context.",
      "Use one structured experience across multiple job applications.",
    ],
    icon: CheckCircle2,
  },
];

const principles = [
  "Candidates should be able to understand progress without chasing updates.",
  "Application flow and round status should stay connected end to end.",
  "A transparent process improves both candidate trust and hiring outcomes.",
];

export default function CandidatePage() {
  const { authUser, initializeAuth, checkAuth, isCheckingAuth } = useAuth();
  const isCandidate = authUser?.role === "candidate";

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

      <main className="pt-14">
        <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                For Candidates
              </span>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-serif tracking-tight sm:text-4xl lg:text-6xl">
                  A clearer candidate journey from discovering jobs to tracking final decisions.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  This page focuses on how candidates experience EasyhireDesk. From finding opportunities to applying and moving through rounds, the platform is designed to make every stage easier to understand.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {!isCheckingAuth && isCandidate && (
                  <Link
                    href="/joblists"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Browse jobs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {!isCheckingAuth && isCandidate ? (
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
                  >
                    Manage candidate profile
                  </Link>
                ) : (
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
                  >
                    Create candidate account
                  </Link>
                )}
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
                  <h2 className="text-lg font-semibold text-black">Built for transparent candidate progression</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    Job visibility, application status, and round updates stay connected so candidates can move forward with better clarity.
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
                What candidates can do here
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Candidate actions are structured around real hiring progression.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {candidateHighlights.map((item) => {
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
                  Candidate journey
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  One clear path from application to interview decisions.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-neutral-600">
                The candidate service follows the same connected model as the platform: discover jobs, submit applications, track rounds, and stay informed.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-4">
              {journeySteps.map((step) => {
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
              {supportAreas.map((area) => {
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
                Candidate principles
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                Better candidate experience comes from transparency, not guesswork.
              </h2>
              <div className="mt-8 space-y-4">
                {principles.map((principle) => (
                  <div key={principle} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-white" />
                    <p className="text-sm leading-6 text-white/80">{principle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
