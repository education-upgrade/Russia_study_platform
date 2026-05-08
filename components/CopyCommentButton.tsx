'use client';

import { useState } from 'react';

type CopyCommentButtonProps = {
  text: string;
  className?: string;
};

export default function CopyCommentButton({ text, className }: CopyCommentButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyComment() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={className} onClick={copyComment} aria-label="Copy teacher comment">
      {copied ? 'Copied' : 'Copy comment'}
    </button>
  );
}
