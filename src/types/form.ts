import { JobInfo } from "./Job"; 

export interface FormConfig {
  job: JobInfo;
  formFields: FormField[];
  roundTitle: string;
}

export interface FormField {
  label: string;
  fieldType: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface FormResponse {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  responses: {
    fieldLabel: string;
    fieldType: string;
    value: any;
  }[];
  status: 'pending' | 'selected' | 'rejected';
  submittedAt: string;
  notes?: string;
  roundStatuses?: {
    round: number;
    status: 'pending' | 'selected' | 'rejected';
    notes?: string;
  }[];
}

