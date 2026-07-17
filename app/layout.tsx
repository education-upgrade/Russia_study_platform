import './globals.css';
import type { ReactNode } from 'react';
import '@/lib/unit3RegistryActivation';

export const metadata = {
  title: 'Russia Study Platform',
  description: 'AQA Russia teacher and student study platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
