"use client";

import React, { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ApplicationLinkProps {
  jobId: string;
}

const ApplicationLink: React.FC<ApplicationLinkProps> = ({ jobId }) => {
  const [copied, setCopied] = useState(false);

  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') return `/apply/${jobId}`;
    return `${window.location.origin}/apply/${jobId}`;
  }, [jobId]);

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = shareLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Unable to copy application link', error);
    }
  };

  return (
    <button
      onClick={handleCopyLink}
      className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy application link
        </>
      )}
    </button>
  );
};

export default ApplicationLink;