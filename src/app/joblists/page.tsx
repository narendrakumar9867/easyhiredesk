"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Users,
    XCircle,
} from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { axiosInstance } from "@/src/utils/axios";
import Navbar from "@/src/components/Navbar";
import FooterLogin from "@/src/components/FooterLogin";
import { Application, Job } from "@/src/types/Job";

type JobFilter = "all" | "open" | "closed";
type ApplicationFilter = "all" | "selected" | "pending" | "rejected" | "in-progress";

export default function JobListsPage() {
    const { authUser, token, initializeAuth, checkAuth, isCheckingAuth } = useAuth();
    const role = authUser?.role;

    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [jobFilter, setJobFilter] = useState<JobFilter>("all");
    const [applicationFilter, setApplicationFilter] = useState<ApplicationFilter>("all");

    useEffect(() => {
        initializeAuth();

        const storedToken = localStorage.getItem("token");
        if (storedToken && !authUser) {
            checkAuth();
        }
    }, [authUser, checkAuth, initializeAuth]);

    useEffect(() => {
        const fetchRoleData = async () => {
            if (!token || !role) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                if (role === "hire_manager") {
                    const response = await axiosInstance.get("/jobs/my-jobs", config);
                    const fetchedJobs = response.data.jobs || [];
                    setJobs(fetchedJobs);
                    setApplications([]);
                    return;
                }

                if (role === "candidate") {
                    const response = await axiosInstance.get("/jobs/my-applications", config);
                    setApplications(response.data.applications || []);
                    setJobs([]);
                    return;
                }

                setJobs([]);
                setApplications([]);
            } catch (error) {
                console.error("Error fetching job list data:", error);
                setJobs([]);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        if (!isCheckingAuth) {
            fetchRoleData();
        }
    }, [token, role, isCheckingAuth]);

    useEffect(() => {
        const fetchApplicationCounts = async () => {
            if (!token || role !== "hire_manager" || jobs.length === 0) return;

            try {
                const counts: Record<string, number> = {};

                for (const job of jobs) {
                    const response = await axiosInstance.get(`/form/responses/${job._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    counts[job._id] = response.data?.data?.responses?.length || 0;
                }

                setApplicationCounts(counts);
            } catch (error) {
                console.error("Error fetching application counts:", error);
            }
        };

        fetchApplicationCounts();
    }, [jobs, token, role]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in-progress":
                return "bg-blue-100 text-blue-800";
            case "selected":
            case "accepted":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getOverallApplicationStatus = (application: Application) => {
        if (!application || !application.jobId) return "pending";

        if (application.status?.toLowerCase() === "rejected") {
            return "rejected";
        }

        if (application.roundStatuses?.length) {
            const selectedCount = application.roundStatuses.filter((item) => item.status === "selected").length;
            const rejectedCount = application.roundStatuses.filter((item) => item.status === "rejected").length;

            if (rejectedCount > 0) return "rejected";
            if (selectedCount === application.roundStatuses.length) return "selected";
            if (selectedCount > 0) return "in-progress";
            return "pending";
        }

        switch (application.status?.toLowerCase()) {
            case "selected":
            case "accepted":
                return "selected";
            case "rejected":
                return "rejected";
            case "in-progress":
            case "reviewed":
                return "in-progress";
            default:
                return "pending";
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set";

        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isJobClosed = (job: Job) => {
        if (job.isClosed) return true;
        if (job.closeDate && new Date(job.closeDate) <= new Date()) return true;
        return false;
    };

    const filteredJobs = jobs.filter((job) => {
        if (jobFilter === "all") return true;
        if (jobFilter === "open") return !isJobClosed(job);
        return isJobClosed(job);
    });

    const filteredApplications = applications.filter((application) => {
        if (applicationFilter === "all") return true;
        return getOverallApplicationStatus(application) === applicationFilter;
    });

    const openJobsCount = jobs.filter((job) => !isJobClosed(job)).length;
    const totalApplicationsReceived = Object.values(applicationCounts).reduce((total, count) => total + count, 0);
    const inProgressApplications = applications.filter(
        (application) => getOverallApplicationStatus(application) === "in-progress"
    ).length;
    const selectedApplications = applications.filter(
        (application) => getOverallApplicationStatus(application) === "selected"
    ).length;

    if (loading || isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!authUser || !token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white px-4">
                <div className="max-w-md rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-semibold text-black">Login required</h1>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                        Please sign in to view your jobs or application activity.
                    </p>
                    <Link
                        href="/auth/login"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    >
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    if (role === "hire_manager") {
        return (
            <div className="flex min-h-screen flex-col bg-white text-neutral-900">
                <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
                    <Navbar />
                </div>

                <main className="flex-1 px-4 pb-10 pt-18 sm:px-6 lg:px-8">
                    <section className="mx-auto max-w-7xl space-y-8">
                        <div className="space-y-4">
                            <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                                Hire manager dashboard
                            </span>
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h1 className="text-4xl font-serif tracking-tight sm:text-5xl">My job posts</h1>
                                    <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
                                        Review your active and closed roles, check application volume, and jump directly into job details.
                                    </p>
                                </div>
                                <Link
                                    href="/hireprocess"
                                    className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                                >
                                    Create new job post
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <StatCard label="Total job posts" value={jobs.length} icon={BriefcaseBusiness} />
                            <StatCard label="Open jobs" value={openJobsCount} icon={CheckCircle2} />
                            <StatCard label="Applications received" value={totalApplicationsReceived} icon={Users} />
                        </div>

                        <FilterTabs<JobFilter>
                            value={jobFilter}
                            onChange={setJobFilter}
                            options={[
                                { value: "all", label: `All jobs (${jobs.length})` },
                                { value: "open", label: `Open (${openJobsCount})` },
                                { value: "closed", label: `Closed (${jobs.length - openJobsCount})` },
                            ]}
                        />

                        {jobs.length === 0 ? (
                            <EmptyState
                                title="No jobs posted yet"
                                description="Create your first job post to start receiving applications."
                                href="/hireprocess"
                                cta="Post a new job"
                            />
                        ) : filteredJobs.length === 0 ? (
                            <EmptyState
                                title="No jobs in this filter"
                                description="Try switching filters to view your other job posts."
                            />
                        ) : (
                            <div className="space-y-4">
                                {filteredJobs.map((job) => {
                                    const closed = isJobClosed(job);

                                    return (
                                        <article
                                            key={job._id}
                                            className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h2 className="text-2xl font-semibold text-black">{job.jobTitle}</h2>
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                closed ? "bg-neutral-200 text-neutral-700" : "bg-green-100 text-green-800"
                                                            }`}
                                                        >
                                                            {closed ? "Closed" : "Open"}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                                                        <span className="inline-flex items-center gap-2">
                                                            <BriefcaseBusiness className="h-4 w-4" />
                                                            {job.companyName}
                                                        </span>
                                                        <span className="inline-flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            {job.location}
                                                        </span>
                                                        <span className="inline-flex items-center gap-2">
                                                            <CalendarDays className="h-4 w-4" />
                                                            Closes {formatDate(job.closeDate)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-center">
                                                        <div className="text-2xl font-semibold text-black">{applicationCounts[job._id] || 0}</div>
                                                        <div className="text-xs text-neutral-500">Applications</div>
                                                    </div>
                                                    <Link
                                                        href={`/joblists/jobdetails-hire-manager/${job._id}`}
                                                        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                                                    >
                                                        View job details
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>

                <FooterLogin />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white text-neutral-900">
            <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
                <Navbar />
            </div>

            <main className="flex-1 px-4 pb-10 pt-18 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-7xl space-y-8">
                    <div className="space-y-4">
                        <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                            Candidate dashboard
                        </span>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h1 className="text-4xl font-serif tracking-tight sm:text-5xl">My applications</h1>
                                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
                                    Track applied roles, review current status, and open the full application view when you need more detail.
                                </p>
                            </div>
                            <Link
                                href="/services/candidates"
                                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-black"
                            >
                                Candidate service overview
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard label="Total applications" value={applications.length} icon={BriefcaseBusiness} />
                        <StatCard label="In progress" value={inProgressApplications} icon={Clock3} />
                        <StatCard label="Selected" value={selectedApplications} icon={CheckCircle2} />
                    </div>

                    <FilterTabs<ApplicationFilter>
                        value={applicationFilter}
                        onChange={setApplicationFilter}
                        options={[
                            { value: "all", label: `All (${applications.length})` },
                            { value: "in-progress", label: "In progress" },
                            { value: "pending", label: "Pending" },
                            { value: "selected", label: "Selected" },
                            { value: "rejected", label: "Rejected" },
                        ]}
                    />

                    {applications.length === 0 ? (
                        <EmptyState
                            title="No job applications yet"
                            description="Start applying to roles to track your progress here."
                            href="/"
                            cta="Browse opportunities"
                        />
                    ) : filteredApplications.length === 0 ? (
                        <EmptyState
                            title="No applications in this filter"
                            description="Try switching filters to view your applications in other stages."
                        />
                    ) : (
                        <div className="space-y-4">
                            {filteredApplications.map((application) => {
                                const status = getOverallApplicationStatus(application);

                                return (
                                    <article
                                        key={application._id}
                                        className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h2 className="text-2xl font-semibold text-black">{application.jobId?.jobTitle || "Job title unavailable"}</h2>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                                                    <span className="inline-flex items-center gap-2">
                                                        <BriefcaseBusiness className="h-4 w-4" />
                                                        {application.jobId?.companyName || "Company unavailable"}
                                                    </span>
                                                    <span className="inline-flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        {application.jobId?.location || "Location unavailable"}
                                                    </span>
                                                    <span className="inline-flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4" />
                                                        Applied {formatDate(application.submittedAt)}
                                                    </span>
                                                </div>

                                                {application.roundStatuses && application.roundStatuses.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {application.roundStatuses.map((round) => (
                                                            <span
                                                                key={`${application._id}-${round.round}`}
                                                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(round.status)}`}
                                                            >
                                                                Round {round.round}: {round.status}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <Link
                                                href={`/joblists/jobdetails-candidate/${application._id}`}
                                                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                                            >
                                                View application
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <FooterLogin />
        </div>
    );
}

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-3xl font-semibold text-black">{value}</div>
                    <p className="mt-2 text-sm text-neutral-600">{label}</p>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <Icon className="h-5 w-5 text-black" />
                </div>
            </div>
        </div>
    );
}

function FilterTabs<T extends string>({
    value,
    onChange,
    options,
}: {
    value: T;
    onChange: (nextValue: T) => void;
    options: Array<{ value: T; label: string }>;
}) {
    return (
        <div className="flex flex-wrap gap-3">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        value === option.value
                            ? "border-black bg-black text-white"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900 hover:text-black"
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

function EmptyState({
    title,
    description,
    href,
    cta,
}: {
    title: string;
    description: string;
    href?: string;
    cta?: string;
}) {
    return (
        <div className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-10 text-center">
            <div className="mx-auto max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <XCircle className="h-6 w-6 text-neutral-500" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
                {href && cta && (
                    <Link
                        href={href}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    >
                        {cta}
                    </Link>
                )}
            </div>
        </div>
    );
}
