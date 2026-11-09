import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quiet Hours | AI Automation for Sydney Small Businesses',
  description: 'Practical AI enquiry replies, booking requests and admin automation for Sydney small businesses.',
  openGraph: {
    title: 'Quiet Hours | AI Automation for Sydney Small Businesses',
    description: 'Practical AI enquiry replies, booking requests and admin automation for Sydney small businesses.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
