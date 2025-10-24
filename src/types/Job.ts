export interface Job {
  _id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  companyWebsite?: string;
  socialLinks?: { platform: string; url: string; id: number }[];
  aboutJob: string;
  title: string,
  createdBy?: string,
  createdAt?: string;
  closeDate?: string;
  isClosed?: boolean;
}

export interface JobRounds {
  jobId: string;
  selectedRounds: string[];
  createdAt?: string;
}

export interface JobInfo {
  title: string;
  company: string;
  location: string;
  companyWebsite: string;
  socialLinks: Array<{platform: string; url: string}>;
  aboutJob: string;
}

export interface Application {
    _id: string;
    jobId: Job;
    candidateEmail: string;
    candidateName: string;
    status: string; //  'selected', 'Pending' ,'Rejected'
    roundStatuses?: {
        round: number;
        status: "pending" | "selected" | "rejected";
    }[];
    submittedAt: string;
    responses: any[];
}