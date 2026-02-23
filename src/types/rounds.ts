export interface FormField {
  id: number;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  options?: string[];
  isAddingOption?: boolean;
}

export interface RoundData {
  title: string;
  formFields: FormField[];
  selectedEmail: string;
  rejectionEmail: string;
}

export interface FieldType {
  value: string;
  label: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}