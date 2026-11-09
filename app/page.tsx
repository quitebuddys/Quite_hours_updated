import fs from 'fs';
import path from 'path';
import { defaultContent, SiteContent } from '../lib/defaultContent';
import ClientLandingPage from '../components/ClientLandingPage';

function getInitialContent(): SiteContent {
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return { ...defaultContent, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error reading initial content on server:', err);
  }
  return defaultContent;
}

export default function Page() {
  const content = getInitialContent();
  return <ClientLandingPage initialContent={content} />;
}
