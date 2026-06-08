'use client';

import { useState } from 'react';
import styles from '@/app/teacher/progress/page.module.css';

type CopyTextButtonProps = {
  text: string;
  label: string;
};

export default function CopyTextButton({ text, label }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className={styles.copyButton} type="button" onClick={copyText}>
      {copied ? 'Copied' : label}
    </button>
  );
}
