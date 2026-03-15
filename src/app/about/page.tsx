import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

import hireProcessBg from "@/public/images/hire-process-bg.jpg";

const focusAreas = [
  {
    title: "Hiring flows that stay clear",
    description:
      "Create jobs, define rounds, review applicants, and move candidates forward without losing the thread between teams.",
    icon: Workflow,
  },
  {
    title: "Candidate experience that feels guided",
    description:
      "Applicants can discover roles, apply quickly, track updates, and understand where they stand at each step.",
    icon: Users,
  },
  {
    title: "Automation where it saves real time",
    description:
      "Selection updates, round progress, and communication workflows are designed to reduce repetitive manual coordination.",
    icon: Sparkles,
  },
];

const workflowSteps = [
  {
    title: "Publish the role",
    description:
      "Hiring managers create a job with company details, job requirements, and role-specific information from a single flow.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Structure the process",
    description:
      "Set the number of rounds, configure each stage, and define how candidate communication should happen through the pipeline.",
    icon: ClipboardList,
  },
  {
    title: "Evaluate with visibility",
    description:
      "Review candidates, take select or reject decisions, and keep round-level progress visible for both internal teams and applicants.",
    icon: CheckCircle2,
  },
  {
    title: "Scale with coordination",
    description:
      "Use scheduling, status tracking, and AI-assisted roadmap features to keep the recruitment cycle moving without friction.",
    icon: CalendarClock,
  },
];

const principles = [
  "Simple navigation for hiring managers and candidates.",
  "Structured round-by-round hiring instead of scattered spreadsheets.",
  "Practical building blocks for automation, follow-ups, and future AI assistance.",
];

const audienceCards = [
  {
    title: "For Hire Managers",
    points: [
      "Post jobs and define multi-round processes.",
      "Review candidate progress from one place.",
      "Reduce manual status updates and email work.",
    ],
    cta: { label: "Explore manager flow", href: "/services/hire-manager" },
  },
  {
    title: "For Candidates",
    points: [
      "Browse active openings and apply faster.",
      "Track application states and round movement.",
      "Get a clearer picture of where you are in the process.",
    ],
    cta: { label: "Explore candidate flow", href: "/services/candidates" },
  },
];

const stats = [
  { value: "2", label: "core user groups" },
  { value: "4", label: "workflow stages highlighted" },
  { value: "1", label: "shared platform for hiring" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <Navbar />
      </div>

      <main className="pt-24">
        <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                About EasyhireDesk
              </span>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Making recruitment more organized from the first job post to the final round.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  EasyhireDesk is a hiring workflow platform that gives both hiring managers and candidates a clearer process. The goal is straightforward: bring job posting, round setup, candidate tracking, and communication into one connected experience.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services/hire-manager"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  See hire manager journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
                >
                  Talk to us
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

            <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-950 p-3 shadow-xl">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <Image
                  src={hireProcessBg}
                  alt="EasyhireDesk hiring workflow"
                  className="h-[520px] w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              </div>

              <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] border border-white/15 bg-white/10 p-6 text-white backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 flex-none" />
                  <div>
                    <h2 className="text-lg font-semibold">Built around practical recruitment flow</h2>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      Role creation, round definitions, candidate movement, and communication are treated as one workflow instead of disconnected tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                What this platform is solving
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Hiring should feel structured, not fragmented.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {focusAreas.map((item) => {
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
                  Platform journey
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  The EasyhireDesk hiring workflow, end to end.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-neutral-600">
                Based on the current product structure, the platform combines job setup, rounds, candidate reviews, and follow-up coordination into one connected system.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex rounded-2xl bg-black p-3 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-neutral-400">0{index + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-black p-8 text-white">
              <div className="inline-flex rounded-full border border-white/15 px-4 py-1 text-sm text-white/75">
                Product principles
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                Build less confusion into recruitment.
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

            <div className="grid gap-5 md:grid-cols-2">
              {audienceCards.map((card) => (
                <article key={card.title} className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
                  <h3 className="text-2xl font-semibold">{card.title}</h3>
                  <div className="mt-6 space-y-3">
                    {card.points.map((point) => (
                      <div key={point} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                        <p className="text-sm leading-6 text-neutral-600">{point}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={card.cta.href}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-black transition hover:text-neutral-600"
                  >
                    {card.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  What comes next
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Making scheduling and AI support a natural extension of the recruitment stack.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                  Based on the platform's existing features, the next layer is clear: better interview scheduling, clearer progress visibility, and AI assistance that helps both managers and candidates communicate faster.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-neutral-100 p-3">
                    <Bot className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Future-ready direction</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      AI assistance, scheduled interviews, and clearer notification flows can turn this from a structured hiring tool into a stronger day-to-day recruitment workspace.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/features/ai-assistance"
                    className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    View AI direction
                  </Link>
                  <Link
                    href="/features/meeting"
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
                  >
                    See meeting feature
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
