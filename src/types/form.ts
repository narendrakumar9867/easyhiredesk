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

export interface JobInfo {
  title: string;
  company: string;
  location: string;
  companyWebsite: string;
  socialLinks: Array<{platform: string; url: string}>;
  aboutJob: string;
}