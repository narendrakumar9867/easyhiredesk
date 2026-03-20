// Utility functions for meeting scheduling

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Convert ISO string to local input datetime value (YYYY-MM-DDTHH:MM)
 */
export const toLocalInputValue = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

/**
 * Convert local input value (YYYY-MM-DDTHH:MM) to ISO string
 */
export const localToIso = (localValue: string) => {
  const date = new Date(localValue);
  return date.toISOString();
};

/**
 * Parse comma-separated interviewer emails into array
 */
export const parseInterviewerEmails = (raw: string) => {
  return Array.from(
    new Set(
      raw
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email && EMAIL_REGEX.test(email))
    )
  );
};

/**
 * Format datetime for display
 */
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Format date only
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format time only
 */
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-green-100 text-green-800',
    sent: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    partially_failed: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status badge text
 */
export const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    scheduled: 'Scheduled',
    sent: 'Sent',
    failed: 'Failed',
    cancelled: 'Cancelled',
    partially_failed: 'Partial Failure',
  };
  return texts[status] || status;
};
