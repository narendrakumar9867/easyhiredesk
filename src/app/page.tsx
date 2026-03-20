"use client";

import React, { useEffect } from "react";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "@/src/hooks/useAuth";

import hremoImageDesktop from "../../public/images/image-hero-desktop.png";
import hremoImageMobile from "../../public/images/image-hero-mobile.png";

const workflowSteps = [
  {
    number: "01",
    title: "Create the job",
    description:
      "Hiring managers publish a role with all essential company and position details in one place.",
    icon: BriefcaseBusiness,
  },
  {
    number: "02",
    title: "Define the rounds",
    description:
      "Build the interview or assessment process with clearer round-by-round structure.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Track progression",
    description:
      "Move candidates through stages with better visibility into decisions and status changes.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Stay coordinated",
    description:
      "Keep communication, timing, and follow-up aligned through a single recruitment experience.",
    icon: CalendarClock,
  },
];

function getHeroContent(role?: string) {
  if (role === "hire_manager") {
    return {
      eyebrow: "Welcome back, hire manager",
      title: "Move from open role to final selection with a clearer hiring system.",
      description:
        "EasyhireDesk helps you publish jobs, define rounds, review applicants, and keep hiring activity organized from one place.",
      actions: (
        <>
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
        </>
      ),
    };
  }

  if (role === "candidate") {
    return {
      eyebrow: "Welcome back, candidate",
      title: "Discover roles, apply faster, and track every step with more confidence.",
      description:
        "Use EasyhireDesk to explore job openings, submit applications, and stay informed as you move through rounds.",
      actions: (
        <>
          <Link
            href="/joblists"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Browse jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
          >
            Update profile
          </Link>
        </>
      ),
    };
  }

  return {
    eyebrow: "Recruitment, made clearer",
    title: "Hire the right talent faster with a workflow that stays organized end to end.",
    description:
      "EasyhireDesk connects job posting, candidate applications, round management, and communication into one more practical hiring experience.",
    actions: (
      <>
        <Link
          href="/services/hire-manager"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Explore hire manager flow
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/services/candidates"
          className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
        >
          Explore candidate flow
        </Link>
      </>
    ),
  };
}

export default function Home() {
  const { authUser, checkAuth, isCheckingAuth, initializeAuth } = useAuth();
  const role = authUser?.role;
  const heroContent = getHeroContent(role);

  useEffect(() => {
    initializeAuth();

    if (!authUser) {
      checkAuth();
    }
  }, [authUser, checkAuth, initializeAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900">
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <Navbar />
      </div>

      <main className="pt-14">
        <Hero content={heroContent} />

        <section className="px-4 py-1">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Platform workflow
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  One connected process from job setup to final decision.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-neutral-600">
                The platform is organized around practical recruitment actions: create roles, define rounds, manage progression, and keep communication aligned.
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
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function Hero({
  content,
}: {
  content: {
    eyebrow: string;
    title: string;
    description: string;
    actions: React.ReactNode;
  };
}) {
  return (
    <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
            {content.eyebrow}
          </span>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-serif tracking-tight sm:text-5xl lg:text-6xl">
              <Balancer>{content.title}</Balancer>
            </h1>

            <p className="max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              <Balancer>{content.description}</Balancer>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">{content.actions}</div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5">
              <div className="text-3xl font-semibold text-black">2</div>
              <p className="mt-2 text-sm text-neutral-600">core user groups</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5">
              <div className="text-3xl font-semibold text-black">4</div>
              <p className="mt-2 text-sm text-neutral-600">workflow stages highlighted</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5">
              <div className="text-3xl font-semibold text-black">1</div>
              <p className="mt-2 text-sm text-neutral-600">connected hiring platform</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-950 p-3 shadow-xl">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_42%),linear-gradient(180deg,_#1a1a1a_0%,_#090909_100%)] px-8 py-4">
            <div className="hidden md:block">
              <Image
                src={hremoImageDesktop}
                alt="EasyhireDesk hero"
                className="mx-auto h-auto max-w-[440px]"
                priority
              />
            </div>
            <div className="md:hidden">
              <Image
                src={hremoImageMobile}
                alt="EasyhireDesk hero"
                className="mx-auto h-auto max-w-[320px]"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] border border-white/15 bg-white/10 p-6 text-white backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-1 h-5 w-5 flex-none" />
              <div>
                <h2 className="text-lg font-semibold">Designed for practical recruitment</h2>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  EasyhireDesk brings structure to recruitment so managers and candidates can move through the process with better visibility and less friction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}